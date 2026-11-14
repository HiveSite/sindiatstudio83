import fs from 'node:fs'
import path from 'node:path'

const out=path.resolve('out')
const issues=[]
const routes=[]
const ignored=new Set(['404','comment-picker','studio83-media','team-building','sr-me','en'])
const walk=(dir)=>{
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,e.name)
  if(e.isDirectory()){
   if(path.relative(out,full).split(path.sep).some(x=>ignored.has(x)))continue
   walk(full)
  }else if(e.name==='index.html')routes.push(full)
 }
}
if(!fs.existsSync(out))throw new Error('Missing Next.js export out/')
walk(out)
const tagCount=(html,tag)=>(html.match(new RegExp('<'+tag+'(?=[\\s>])','gi'))||[]).length
const value=(html,tag)=>(html.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+tag+'>','i'))||[])[1]||''
const main=html=>{const s=html.indexOf('<main');if(s<0)return '';const b=html.indexOf('>',s)+1;const e=html.indexOf('</main>',b);return html.slice(b,e<0?undefined:e)}
const text=s=>s.replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').trim()
const report=[]
for(const srFile of routes){
 const sub=path.relative(out,srFile)
 const enFile=path.join(out,'en',sub)
 const route=sub==='index.html'?'/':'/'+sub.replaceAll(path.sep,'/').replace(/index\\.html$/,'')
 if(!fs.existsSync(enFile)){issues.push(route+' missing EN file');continue}
 const sr=fs.readFileSync(srFile,'utf8')
 const en=fs.readFileSync(enFile,'utf8')
 const srMain=main(sr),enMain=main(en)
 if(!srMain||!enMain){issues.push(route+' missing main element');continue}
 const count={}
 for(const tag of ['section','article','h1','h2','h3','form','input','select','textarea','button','details','summary','nav']){
  const a=tagCount(srMain,tag),b=tagCount(enMain,tag)
  count[tag]=[a,b]
  if(a!==b)issues.push(route+' '+tag+' structure differs SR='+a+' EN='+b)
 }
 const srH1=text(value(srMain,'h1')),enH1=text(value(enMain,'h1'))
 if(srH1&&srH1===enH1)issues.push(route+' unchanged translated H1: '+srH1.slice(0,80))
 const internalLinks=(s)=>(s.match(/<a\\b[^>]*href="\\/[^"]*"/g)||[]).length
 const a=internalLinks(srMain),b=internalLinks(enMain)
 if(a!==b)issues.push(route+' internal link count differs SR='+a+' EN='+b)
 if(!/<html[^>]+lang="en"/.test(en))issues.push(route+' English document lang is not en')
 report.push({route,srH1,enH1,sections:count.section,articles:count.article,forms:count.form,links:[a,b]})
}
fs.mkdirSync('reports',{recursive:true})
fs.writeFileSync('reports/strict-parity.json',JSON.stringify({pairs:report.length,issues},null,2)+'\\n')
console.log('Bilingual routes checked: '+report.length)
console.log('Structural differences: '+issues.length)
for(const issue of issues.slice(0,180))console.log('PARITY '+issue)
if(issues.length)process.exitCode=1
