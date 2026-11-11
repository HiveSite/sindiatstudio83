import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173'
const routes = ['/', '/usluge/', '/cijene/', '/radovi/', '/industrije/', '/kontakt/', '/usluge/meta-ads/', '/usluge/google-ads/']
const widths = [320,360,390,430,768,1024,1440]
const errors = []
fs.mkdirSync('qa-screenshots',{recursive:true})
const browser = await chromium.launch({headless:true,args:['--no-sandbox']})
try {
  for (const width of widths) {
    const page = await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'})
    for (const route of routes) {
      try {
        const res = await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:20000})
        if (!res || res.status() >= 400) errors.push(width+'px '+route+' HTTP '+(res?.status()||'missing'))
        if (await page.locator('h1').count() !== 1) errors.push(width+'px '+route+' H1 count')
        const dimension = await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth}))
        if (dimension.scroll > dimension.width+2 || dimension.body>dimension.width+2) errors.push(width+'px '+route+' overflow '+JSON.stringify(dimension))
        if(route==='/'&&(width===390||width===1440)) {
          const picture=page.locator('.demo-hero-photo img').first()
          const loaded=await picture.evaluate(async img=>{try{await img.decode();return img.naturalWidth>0}catch{return false}})
          if(!loaded) errors.push(width+'px home hero image failed')
          await page.screenshot({path:'qa-screenshots/home-'+width+'.png',fullPage:true,animations:'disabled'})
        }
        if(width===390 && ['/cijene/','/usluge/','/kontakt/'].includes(route)) {
          await page.screenshot({path:'qa-screenshots/'+route.replace(/\//g,'-')+'-390.png',fullPage:true,animations:'disabled'})
        }
        console.log('CHECK '+width+'px '+route)
      } catch(e){errors.push(width+'px '+route+': '+String(e))}
    }
    if(width===390){
      try{
        await page.goto(base+'/',{waitUntil:'domcontentloaded'})
        const nav=page.getByRole('navigation',{name:'Brza mobilna navigacija'})
        if(!await nav.isVisible())errors.push('Mobile quick navigation hidden')
        await nav.getByRole('link',{name:'Cijene'}).click({timeout:7000})
        await page.waitForURL('**/cijene/',{timeout:10000})
      }catch(e){errors.push('Mobile pricing navigation '+String(e))}
    }
    await page.close()
  }
} finally {await browser.close()}
if(errors.length){console.error('QA FAIL\n'+errors.join('\n'));process.exitCode=1}
else console.log('BROWSER QA PASS: '+(routes.length*widths.length)+' viewport/page combinations plus mobile pricing navigation')
