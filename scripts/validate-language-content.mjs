import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const issues=[]
const check=(ok,message)=>{if(!ok)issues.push(message)}
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'))
function parseVar(file,name){
 const src=fs.readFileSync(file,'utf8')
 const ast=ts.createSourceFile(file,src,ts.ScriptTarget.Latest,true)
 let value
 for(const statement of ast.statements){
  if(!ts.isVariableStatement(statement))continue
  for(const declaration of statement.declarationList.declarations){
   if(declaration.name.getText(ast)===name)value=declaration.initializer
  }
 }
 if(!value)throw Error('Missing source variable '+name+' in '+file)
 return decode(value)
}
function decode(node){
 if(ts.isAsExpression(node)||ts.isSatisfiesExpression(node))return decode(node.expression)
 if(ts.isParenthesizedExpression(node))return decode(node.expression)
 if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))return node.text
 if(ts.isNumericLiteral(node))return Number(node.text)
 if(node.kind===ts.SyntaxKind.TrueKeyword)return true
 if(node.kind===ts.SyntaxKind.FalseKeyword)return false
 if(ts.isArrayLiteralExpression(node))return node.elements.map(decode)
 if(ts.isObjectLiteralExpression(node)){
  const result={}
  for(const prop of node.properties){
   if(!ts.isPropertyAssignment(prop))continue
   const key=ts.isIdentifier(prop.name)||ts.isStringLiteral(prop.name)?prop.name.text:prop.name.getText()
   result[key]=decode(prop.initializer)
  }
  return result
 }
 return {dynamic:node.getText()}
}
const srcDir='src/data/'
const srServices=parseVar(srcDir+'services.ts','services')
const enServiceParity=parseVar(srcDir+'en-service-parity.ts','enServiceParity')
const srProducts=parseVar(srcDir+'service-products.ts','serviceProducts')
const enProducts=parseVar(srcDir+'en-products.ts','enProducts')
const srIndustries=parseVar(srcDir+'industries.ts','industries')
const enIndustryDetails=parseVar(srcDir+'en-industry-details.ts','enIndustryDetails')
const srCases=parseVar(srcDir+'cases.ts','cases')
const enCaseParity=parseVar(srcDir+'en-case-parity.ts','enCaseParity')
const enCaseExtra=parseVar(srcDir+'localized-cases.ts','caseTranslations')
const srLegal=parseVar(srcDir+'legal.ts','legalPages')
const enLegal=parseVar(srcDir+'en-legal.ts','enLegalPages')
const reports={services:0,products:0,industries:0,cases:0,blog:0,legal:0}
const checkLength=(a,b,label)=>check(Array.isArray(a)&&Array.isArray(b)&&a.length===b.length,label+' SR '+a?.length+' vs EN '+b?.length)
const hasText=(v)=>typeof v==='string'&&v.trim().length>0
const checkText=(v,label)=>check(hasText(v),label+' missing full EN text')
const money=value=>(String(value).match(/\d[\d.,]*/g)||[]).map(x=>x.replaceAll(',','')).join('|')
for(const service of srServices){
 const en=enServiceParity[service.slug]
 check(!!en,'Missing EN service: '+service.slug)
 if(!en)continue
 reports.services++
 for(const key of ['eyebrow','title','shortTitle','summary'])checkText(en[key],service.slug+' '+key)
 checkLength(service.outcomes,en.outcomes,service.slug+' outcomes')
 checkLength(service.engagements,en.engagements,service.slug+' engagements')
 for(const x of en.outcomes)checkText(x,service.slug+' outcome')
 for(const x of en.engagements){checkText(x.name,service.slug+' engagement name');checkText(x.text,service.slug+' engagement description')}
 const srPlans=srProducts[service.slug],enPlans=enProducts[service.slug]
 checkLength(srPlans,enPlans,service.slug+' product offerings')
 if(srPlans&&enPlans){
  for(let j=0;j<srPlans.length;j++){
   const sp=srPlans[j],ep=enPlans[j]
   if(!ep)continue
   reports.products++
   checkText(ep.name,service.slug+' product name '+j)
   checkText(ep.description,service.slug+' product description '+j)
   check(money(sp.price)===money(ep.price),service.slug+' price '+j+' mismatch')
   check(Boolean(sp.featured)===Boolean(ep.featured),service.slug+' featured product '+j+' differs')
   checkLength(sp.includes,ep.includes,service.slug+' included deliverables '+j)
   for(const label of ep.includes)checkText(label,service.slug+' included deliverable '+j)
  }
 }
}
check(Object.keys(enServiceParity).length===srServices.length,'EN service slug count differs')
for(const industry of srIndustries){
 const e=enIndustryDetails[industry.slug]
 check(!!e,'Missing EN industry '+industry.slug)
 if(!e)continue
 reports.industries++
 for(const [srKey,enKey] of [['problems','problems'],['solutions','solutions'],['bestFor','bestFor'],['successSignals','signals']])
   checkLength(industry[srKey],e[enKey],industry.slug+' '+srKey)
 checkText(e.timing,industry.slug+' timing')
}
for(const item of srCases){
 const e=enCaseParity[item.slug],details=enCaseExtra[item.slug]
 check(!!e&&!!details,'Missing translated project '+item.slug)
 if(!e||!details)continue
 reports.cases++
 for(const key of ['title','summary','challenge','solution','result'])checkText(e[key],item.slug+' '+key)
 checkText(details.role,item.slug+' role')
 checkLength(item.scope,details.scope,item.slug+' scope')
 checkLength(item.metrics||[],details.metrics||[],item.slug+' metrics')
 checkLength(item.subprojects||[],details.subprojects||[],item.slug+' subprojects')
 if(/Jägermeister/.test(item.title))check(/Jägermeister/.test(e.title)&&/Jack Daniel/.test(e.title),'Names of both original regulated brands must be preserved in the English title')
}
for(const [slug,doc] of Object.entries(srLegal)){
 const e=enLegal[slug]
 check(!!e,'Missing EN legal document: '+slug)
 if(!e)continue
 reports.legal++
 checkText(e.title,slug+' legal title')
 checkText(e.description,slug+' legal description')
 checkLength(doc.sections,e.sections,slug+' legal sections')
 for(const block of e.sections){checkText(block.title,slug+' legal heading');checkText(block.text,slug+' legal text')}
}
const enLegalSource=fs.readFileSync(srcDir+'en-legal.ts','utf8')
check((enLegalSource.match(/site\.email/g)||[]).length>=2,'Both EN legal documents must contain the actual email as on the SR pages')
const blog=readJson(srcDir+'blog-posts.json')
const enBlog=[...readJson(srcDir+'blog-en-aligned-01.json'),...readJson(srcDir+'blog-en-aligned-02.json'),...readJson(srcDir+'blog-en-aligned-03.json')]
check(blog.length===enBlog.length,'Blog article count differs')
const blogLookup=Object.fromEntries(enBlog.map(article=>[article.slug,article]))
for(const article of blog){
 const e=blogLookup[article.slug]
 check(!!e,'Missing full EN article '+article.slug)
 if(!e)continue
 reports.blog++
 checkText(e.title,article.slug+' title')
 const segments=[...article.body.matchAll(/>([^<>]+)</g)].map(m=>m[1].trim()).filter(v=>v&&/[A-Za-zÀ-ž]/.test(v))
 checkLength(segments,e.segments,article.slug+' paragraph/heading segments')
 for(let i=0;i<e.segments.length;i++)checkText(e.segments[i],article.slug+' paragraph '+i)
}
const result={...reports,totalContentUnits:Object.values(reports).reduce((a,b)=>a+b,0),issues}
fs.mkdirSync('reports',{recursive:true})
fs.writeFileSync('reports/content-parity.json',JSON.stringify(result,null,2)+'\n')
console.log('Content data parity '+JSON.stringify(reports)+'; '+issues.length+' issues')
for(const issue of issues)console.error('CONTENT PARITY '+issue)
if(issues.length)process.exitCode=1
