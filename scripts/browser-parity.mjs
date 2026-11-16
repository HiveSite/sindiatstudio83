import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { chromium } from 'playwright'

const dist=path.resolve('out')
const output=path.resolve('reports')
const screenshotDir=path.join(output,'bilingual-screenshots')
fs.mkdirSync(screenshotDir,{recursive:true})
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.txt':'text/plain'}
const server=http.createServer((req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost')
  const decoded=decodeURIComponent(url.pathname)
  const dest=path.resolve(dist,decoded.replace(/^\/+/,''))
  if(dest!==dist && !dest.startsWith(dist+path.sep)){res.writeHead(403).end();return}
  let file=dest
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html')
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end('Not found');return}
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'})
  fs.createReadStream(file).pipe(res)
 }catch(error){res.writeHead(500).end(String(error))}
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
const origin='http://127.0.0.1:'+server.address().port
const routes=[]
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const dest=path.join(dir,e.name),relative=path.relative(dist,dest).split(path.sep)
  if(e.isDirectory()&&['en','_not-found','404','comment-picker','sr-me','studio83-media','team-building'].includes(e.name))continue
  if(e.isDirectory())walk(dest)
  else if(e.name==='index.html'){
   const r=path.relative(dist,dest).replaceAll(path.sep,'/')
   routes.push(r==='index.html'?'/':'/'+r.replace(/index\.html$/,''))
  }
 }
}
walk(dist);routes.sort()
const errors=[]
const widths=[390,768,1440]
const screenshotPages=new Set(['/','/usluge/','/cijene/','/blog/','/blog/p01/','/radovi/','/industrije/','/o-nama/','/kontakt/'])
const snapshotScript=()=>{
 const main=document.querySelector('main#main')||document.querySelector('main')
 if(!main)return null
 const tags=['section','article','h1','h2','h3','form','input','label','button','select','textarea','nav','a','img','picture','figure','details','summary','ul','li']
 const counts=Object.fromEntries(tags.map(tag=>[tag,main.querySelectorAll(tag).length]))
 const seq=[...main.querySelectorAll(tags.join(','))].map(e=>e.tagName.toLowerCase())
 const links=[...main.querySelectorAll('a[href]')].map(e=>e.getAttribute('href'))
 const forms=[...main.querySelectorAll('input,select,textarea')].map(e=>({tag:e.tagName,name:e.getAttribute('name'),type:e.getAttribute('type'),required:e.hasAttribute('required')}))
 const documentOverflow=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth
 const h1=main.querySelector('h1')?.textContent?.trim()||''
 const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT)
 const textSegments=[]
 while(walker.nextNode()){
  const el=walker.currentNode.parentElement
  if(!el||el.closest('script,style,noscript,template'))continue
  const value=(walker.currentNode.nodeValue||'').replace(/\s+/g,' ').trim()
  if(value)textSegments.push(value)
 }
 const visibleText=main.innerText
 const schema=[]
 const schemaErrors=[]
 for(const script of document.querySelectorAll('script[type="application/ld+json"]')){
  try {
   const json=JSON.parse(script.textContent||'{}')
   schema.push(...(Array.isArray(json)?json:[json]))
  } catch(e) {schemaErrors.push(String(e))}
 }
 const brokenImages=[...document.querySelectorAll('img')].filter(img=>img.complete&&img.naturalWidth===0&&img.getBoundingClientRect().top<window.innerHeight+600).map(img=>img.getAttribute('src')).filter(Boolean).slice(0,5)
 const idList=[...main.querySelectorAll('[id]')].map(el=>el.id).filter(Boolean)
 const duplicateIds=[...new Set(idList.filter((v,i)=>idList.indexOf(v)!==i))]
 const canonical=document.querySelector('link[rel="canonical"]')?.getAttribute('href')||''
 const alternateLang=[...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(x=>({language:x.getAttribute('hreflang'),href:x.getAttribute('href')}))
 return {counts,seq,links,forms,documentOverflow,h1,language:document.documentElement.lang,text:visibleText.slice(0,4500),textSegmentCount:textSegments.length,serbianFragments:textSegments.filter(value=>/\b(?:Početna opcija|Sve usluge|Pogledaj|Pošalji|Zatraži|Prijava kandidata|Saznaj više|Nijesi siguran|Najčešći izbor|Više kupaca i upita|Jači nastup na mrežama|Sajt koji prodaje|Događaj ili aktivacija|Potrebni su mi ljudi|Digitalno oglašavanje|Odredišna stranica|Napredni mini-sajt|Kampanja za jednu poziciju|Kreativni plan|Sadržaj za kampanje)\b/i.test(value)).slice(0,8),schema,schemaErrors,canonical,alternateLang,brokenImages,duplicateIds}
}
const browser=await chromium.launch({headless:true,args:['--no-sandbox']})
let checked=0
try {
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce',serviceWorkers:'block'})
  await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort())
  const page=await context.newPage()
  page.setDefaultTimeout(10000)
  let jsErrors=[]
  page.on('pageerror',e=>jsErrors.push(e.message))
  for(const route of routes){
   const copies=[]
   for(const locale of ['sr','en']){
    const routePath=locale==='en'?'/en'+route:route
    jsErrors=[]
    const response=await page.goto(origin+routePath,{waitUntil:'load',timeout:18000}).catch(e=>{errors.push({route:routePath,width,error:'Navigation: '+e.message});return null})
    if(!response||response.status()!==200){errors.push({route:routePath,width,error:'HTTP '+(response?.status()||'no response')});continue}
    const snap=await page.evaluate(snapshotScript)
    if(!snap){errors.push({route:routePath,width,error:'No main landmark'});continue}
    copies.push(snap)
    checked++
    if(snap.documentOverflow>4)errors.push({route:routePath,width,error:'Horizontal overflow '+snap.documentOverflow+'px'})
    if(snap.counts.h1!==1)errors.push({route:routePath,width,error:'Expected one H1, found '+snap.counts.h1})
    if(jsErrors.length)errors.push({route:routePath,width,error:'JS exception '+jsErrors.slice(0,2).join(' | ')})
    if(locale==='en'&&snap.language!=='en')errors.push({route:routePath,width,error:'HTML language '+snap.language})
    if(snap.schemaErrors.length)errors.push({route:routePath,width,error:'Invalid JSON-LD '+snap.schemaErrors.join(' | ')})
    if(snap.brokenImages.length)errors.push({route:routePath,width,error:'Broken visible images '+snap.brokenImages.join(' | ')})
    if(snap.duplicateIds.length)errors.push({route:routePath,width,error:'Duplicate HTML IDs '+snap.duplicateIds.join(' | ')})
    const expectedPrefix=locale==='en'?'/en':''
    const expectedLang=locale==='en'?'en':'sr-Latn-ME'
    const domain='https://www.sindikatstudio83.me'
    const expectedCanonical=domain+expectedPrefix+route
    if(snap.canonical && snap.canonical.replace(/\/$/,'')!==expectedCanonical.replace(/\/$/,''))
      errors.push({route:routePath,width,error:'Wrong canonical '+snap.canonical+' expected '+expectedCanonical})
    for(const entry of snap.schema){
      const type=entry['@type']
      if(['WebPage','CollectionPage','AboutPage','ContactPage','Service','BlogPosting','Blog','CreativeWork'].includes(type)){
        if(entry.inLanguage!==expectedLang)
          errors.push({route:routePath,width,error:'Incorrect '+type+' language '+entry.inLanguage+' expected '+expectedLang})
        if(typeof entry.url==='string'){
          const parsed=new URL(entry.url,domain)
          const expectedPath=expectedPrefix+route
          if(parsed.pathname.replace(/\/$/,'')!==expectedPath.replace(/\/$/,''))
            errors.push({route:routePath,width,error:'Incorrect '+type+' URL '+entry.url})
        }
      }
      if(type==='BreadcrumbList'&&entry.itemListElement?.length){
        const root=entry.itemListElement[0]
        if(root.name!==(locale==='en'?'Home':'Početna')||new URL(root.item,domain).pathname!==(locale==='en'?'/en/':'/'))
          errors.push({route:routePath,width,error:'Incorrect breadcrumb root '+JSON.stringify(root)})
      }
    }

    if(screenshotPages.has(route)&&width!==768){
     const name=(route==='/'?'home':route.replace(/^\/|\/$/g,'').replaceAll('/','-'))
     await page.screenshot({path:path.join(screenshotDir,name+'-'+locale+'-'+width+'.png'),animations:'disabled',fullPage:false})
    }
   }
   if(copies.length!==2)continue
   const [sr,en]=copies
   for(const tag of Object.keys(sr.counts))if(sr.counts[tag]!==en.counts[tag])errors.push({route,width,error:tag+' DOM count SR '+sr.counts[tag]+' EN '+en.counts[tag]})
   if(sr.seq.join('|')!==en.seq.join('|'))errors.push({route,width,error:'Element sequence differs'})
   if(JSON.stringify(sr.forms)!==JSON.stringify(en.forms))errors.push({route,width,error:'Form field structure differs'})
   if(sr.textSegmentCount!==en.textSegmentCount)errors.push({route,width,error:'Visible text-node count differs '+sr.textSegmentCount+' SR / '+en.textSegmentCount+' EN'})
   if(en.serbianFragments.length)errors.push({route,width,error:'Untranslated EN labels: '+en.serbianFragments.join(' | ')})

   if(sr.links.length!==en.links.length)errors.push({route,width,error:'Link count differs '+sr.links.length+'/'+en.links.length})
   else {
    let exceptions=0
    for(let i=0;i<sr.links.length;i++){
     const href=sr.links[i],translated=en.links[i]
     if(href?.startsWith('/')&&!href.startsWith('//')&&!href.startsWith('/en/')){
      const wanted='/en'+href
      if(wanted!==translated&&exceptions++<4)errors.push({route,width,error:'Link '+i+': expected '+wanted+' got '+translated})
     }
    }
   }
  }
  await context.close()
 }
  // Interactive smoke tests complement the static-page comparison above.
  // They do not send a live enquiry or contact an external service.
  for(const width of [390,1440]){
    for(const locale of ['sr','en']){
      const context=await browser.newContext({viewport:{width,height:850},serviceWorkers:'block'})
      await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort())
      const page=await context.newPage()
      const base=locale==='en'?'/en':''
      const mark=(name,error)=>errors.push({route:base+'/functional-smoke/',width,error:name+': '+error})
      try{
        await page.goto(origin+base+'/',{waitUntil:'load'})
        const banner=page.locator('.cookie-banner')
        await banner.waitFor({state:'visible',timeout:7000})
        await banner.locator('button').first().click()
        const choice=await page.evaluate(()=>JSON.parse(localStorage.getItem('sindikat_cookie_consent')||'{}').choice)
        if(choice!=='rejected')mark('Cookie choice','Essential-only option was not stored')
        await page.locator('button.footer-link-button').click()
        await banner.waitFor({state:'visible',timeout:4000})
        await banner.locator('button').nth(1).click()
        const updated=await page.evaluate(()=>JSON.parse(localStorage.getItem('sindikat_cookie_consent')||'{}').choice)
        if(updated!=='analytics')mark('Cookie settings','Updated analytics-only choice was not stored')
        if(width===390){
          const menu=page.locator('#mobile-navigation')
          await page.locator('button.menu-toggle').click()
          if(!(await menu.isVisible()))mark('Mobile menu','Menu did not open')
          await page.keyboard.press('Escape')
          if(await menu.isVisible())mark('Mobile menu','Menu did not close on Escape')
        }
        await page.goto(origin+base+'/cijene/',{waitUntil:'load'})
        await page.locator('button.language-switcher-button').click()
        const target=locale==='en'?'/cijene/':'/en/cijene/'
        await page.locator('#language-menu a[href="'+target+'"]').click()
        await page.waitForURL(url=>url.pathname===target,{timeout:10000})
        const pathNow=new URL(page.url()).pathname
        if(pathNow!==target)mark('Language switch','Expected '+target+' got '+pathNow)
        await page.goto(origin+base+'/usluge/',{waitUntil:'load'})
        await page.locator('button.sales-category-tab').nth(1).click()
        const optionNames=await page.locator('a.sales-item-link strong').allTextContents()
        const expectedService=locale==='en'?'Landing page':'Odredišna stranica'
        if(!optionNames.some(name=>name.trim()===expectedService))
          mark('Interactive service categories','Expected localized '+expectedService+' among '+optionNames.join(' / '))
        await page.locator('.sales-chooser-step').nth(0).locator('button').first().click()
        await page.locator('.sales-chooser-step').nth(1).locator('button').first().click()
        await page.locator('.sales-chooser-step').nth(2).locator('button').first().click()
        const recommendation=await page.locator('.sales-recommendation-copy strong').textContent()
        if(!recommendation||!recommendation.trim())mark('Service recommendation','Missing computed recommendation')
        await page.goto(origin+base+'/kontakt/',{waitUntil:'load'})
        await page.locator('input[name="email"]').fill('invalid-email')
        await page.locator('button[type="submit"]').click()
        await page.locator('.form-status').filter({hasText:locale==='en'?'required fields':'obavezna polja'}).waitFor({state:'visible',timeout:6000})
        // Mock the external Apps Script endpoint so no real lead is sent.
        let capturedLead=null
        await context.route('https://script.google.com/**',async route=>{
          try{capturedLead=JSON.parse(route.request().postData()||'{}')}catch{capturedLead=null}
          await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"ok":true}'})
        })
        await page.locator('input[name="name"]').fill('QA Test Studio83')
        await page.locator('input[name="email"]').fill('qa@example.invalid')
        await page.locator('select[name="goal"]').selectOption({index:1})
        await page.locator('textarea[name="message"]').fill('Automated validation of the contact form without a real lead submission.')
        await page.locator('button[type="submit"]').click()
        await page.waitForURL(url=>url.pathname===base+'/hvala/',{timeout:9000})
        if(!capturedLead||capturedLead.email!=='qa@example.invalid'||!capturedLead.goal)
          mark('Contact form','Missing or incorrect outbound lead payload')

      }catch(error){mark('Interactive smoke',String(error).slice(0,650))}
      finally{await context.close()}
    }
  }
}finally{
 await browser.close()
 await new Promise(resolve=>server.close(resolve))
}
const result={checked,routes:routes.length,widths,issues:errors}
fs.writeFileSync(path.join(output,'browser-parity.json'),JSON.stringify(result,null,2)+'\n')
console.log('Browser parity checked '+checked+' pages across '+widths.length+' responsive widths; '+errors.length+' issues')
for(const e of errors.slice(0,120))console.log('BROWSER PARITY '+JSON.stringify(e))
if(errors.length)process.exitCode=1
