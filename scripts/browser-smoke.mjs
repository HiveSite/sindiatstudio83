import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173'
const routes = [
  '/', '/usluge/', '/cijene/', '/radovi/', '/industrije/', '/kontakt/',
  '/usluge/meta-ads/', '/usluge/google-ads/',
  '/usluge/performance-marketing/', '/usluge/aktivacije-i-eventi/',
  '/usluge/web-i-konverzije/', '/usluge/sadrzaj-za-kampanje/', '/usluge/recruitment-kampanje/',
  '/industrije/ugostiteljstvo-i-turizam/', '/industrije/retail-i-fmcg/',
  '/industrije/eventi-i-venue/', '/industrije/nekretnine-i-premium-usluge/',
  '/industrije/poslodavci-i-zaposljavanje/',
  '/radovi/imaposla-digitalni-proizvod/', '/radovi/battlebots-arena/',
  '/radovi/sistem-za-terenske-angazmane/', '/radovi/student-connect-mini-festival/',
  '/o-nama/', '/blog/', '/privatnost/', '/kolacici/', '/uslovi-koriscenja/',
]
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
        if (dimension.scroll > dimension.width+2 || dimension.body>dimension.width+2) {
          const offenders=await page.evaluate(()=>Array.from(document.body.querySelectorAll('*')).map(el=>{
            const r=el.getBoundingClientRect()
            return {tag:el.tagName.toLowerCase(),className:typeof el.className==='string'?el.className.slice(0,100):'',left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)}
          }).filter(r=>r.right>innerWidth+2 && r.width>0).slice(0,16))
          errors.push(width+'px '+route+' overflow '+JSON.stringify(dimension)+' elements '+JSON.stringify(offenders))
        }
        if(route==='/' && width===390) {
          const demoImages = Array.from({length:10},(_,i) => '/images/demo-hero/slide-'+String(i+1).padStart(2,'0')+'.webp')
          for(const asset of demoImages) {
            const imageResponse = await page.request.get(base+asset)
            if(!imageResponse.ok() || !(imageResponse.headers()['content-type']||'').includes('image/')) {
              errors.push('Demo hero image unavailable: '+asset+' status='+imageResponse.status())
            }
          }
        }
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
      // Test the real motion behavior separately from reduced-motion layout checks.
      const motionPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'})
      try {
        await motionPage.goto(base+'/',{waitUntil:'domcontentloaded'})
        const counter=motionPage.locator('.hero-photo-counter')
        await counter.waitFor({state:'visible'})
        const first=(await counter.innerText()).trim()
        await motionPage.waitForTimeout(5400)
        const second=(await counter.innerText()).trim()
        if(first===second)errors.push('Hero rotation did not advance after 5 seconds')
        await motionPage.getByRole('button',{name:'Pauziraj rotaciju'}).click()
        const paused=(await counter.innerText()).trim()
        await motionPage.waitForTimeout(5400)
        if((await counter.innerText()).trim()!==paused)errors.push('Hero slider continued rotating after pause')
      } catch(e) {errors.push('Hero rotation/pause behavior: '+String(e))}
      finally {await motionPage.close()}
    }
    if(width===390){
      try{
        await page.goto(base+'/',{waitUntil:'domcontentloaded'})
        const nav=page.getByRole('navigation',{name:'Brza mobilna navigacija'})
        if(!await nav.isVisible())errors.push('Mobile quick navigation hidden')
        await nav.getByRole('link',{name:'Cijene'}).click({timeout:7000})
        await page.waitForURL('**/cijene/',{timeout:10000})
        const expectedProductHref=await page.locator('.demo-pricing-card a.button').first().getAttribute('href')
        const expectedProduct=new URL(expectedProductHref,base).searchParams.get('proizvod')
        await page.locator('.demo-pricing-card a.button').first().click({timeout:7000})
        await page.waitForURL('**/kontakt/?*',{timeout:10000})
        await page.locator('.brief-context').waitFor({state:'visible',timeout:10000})
        const context=await page.locator('.brief-context').innerText()
        if(!expectedProduct || !context.includes(expectedProduct))errors.push('Pricing selection mismatch. Expected '+JSON.stringify(expectedProduct)+'; got '+JSON.stringify(context)+'; URL '+page.url())
        if(await page.locator('form.lead-form').count()!==1)errors.push('Lead form missing on chosen product contact page')
        await page.locator('form.lead-form button[type="submit"]').click()
        const invalid=await page.locator('form.lead-form input[name="name"]').evaluate(el=>!el.checkValidity())
        if(!invalid)errors.push('Empty lead form did not preserve required field validation')
        const status=await page.locator('form.lead-form [role="status"]').innerText()
        if(!status.includes('obavezna polja'))errors.push('Lead form validation does not communicate required fields')
      }catch(e){errors.push('Mobile pricing navigation '+String(e))}
    }

    if(width===390){
      // All network responses are mocked. No real lead is sent to the business endpoint.
      const formPage=await browser.newPage({viewport:{width:390,height:844}})
      try {
        await formPage.route('https://script.google.com/**', async route => {
          await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"ok":false,"error":"test response"}'})
        })
        await formPage.goto(base+'/kontakt/?izvor=browser-qa',{waitUntil:'domcontentloaded'})
        await formPage.locator('input[name="name"]').fill('QA Test')
        await formPage.locator('input[name="email"]').fill('qa@example.test')
        await formPage.locator('select[name="goal"]').selectOption({label:'Više prodaje ili upita'})
        await formPage.locator('form.lead-form button[type="submit"]').click()
        await formPage.getByRole('status').getByText(/Slanje nije potvrđeno/).waitFor({timeout:10000})
        const failedPageLeads=await formPage.evaluate(()=>Array.isArray(window.dataLayer)?window.dataLayer.filter(x=>x.event==='generate_lead').length:0)
        if(failedPageLeads!==0)errors.push('Failed endpoint generated a false GA4 lead')
        if(formPage.url().includes('/hvala/'))errors.push('Failed endpoint redirected to success page')

        await formPage.unroute('https://script.google.com/**')
        await formPage.route('https://script.google.com/**', async route => {
          await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"ok":true}'})
        })
        await formPage.locator('form.lead-form button[type="submit"]').click()
        await formPage.getByRole('status').getByText(/Upit je poslat/).waitFor({timeout:10000})
        const successLeads=await formPage.evaluate(()=>Array.isArray(window.dataLayer)?window.dataLayer.filter(x=>x.event==='generate_lead').length:0)
        if(successLeads!==1)errors.push('Mocked successful endpoint should emit one generate_lead, found '+successLeads)
        await formPage.waitForURL('**/hvala/?*',{timeout:10000})
        // The two dedicated ad pages must preserve which advertising channel was selected.
        const focusPage=await browser.newPage({viewport:{width:390,height:844}})
        try {
          await focusPage.goto(base+'/kontakt/?usluga=performance-marketing&cilj=Meta%20Ads&izvor=seo-usluga',{waitUntil:'domcontentloaded'})
          await focusPage.locator('.brief-context').waitFor({state:'visible',timeout:10000})
          const focusText=await focusPage.locator('.brief-context').innerText()
          if(!focusText.includes('Meta Ads') || !focusText.includes('Tema upita'))errors.push('Meta Ads enquiry context was lost: '+JSON.stringify(focusText)+' url='+focusPage.url())
        } finally {await focusPage.close()}
        console.log('CHECK mocked lead fail, retry and successful conversion')
      } catch(e) {errors.push('Mocked contact submit scenarios '+String(e))}
      finally {await formPage.close()}
    }
    await page.close()
  }

  // More interaction-level tests on a mobile viewport, without calling external services.
  const uxPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
  try {
    await uxPage.goto(base+'/',{waitUntil:'domcontentloaded'})
    await uxPage.getByRole('button',{name:'Otvori meni'}).click()
    const mobileDialog=uxPage.getByRole('dialog',{name:'Mobilna navigacija'})
    if(!await mobileDialog.isVisible())errors.push('Mobile menu did not open')
    await uxPage.keyboard.press('Escape')
    if(await mobileDialog.isVisible())errors.push('Escape key did not close mobile menu')

    const chooser=uxPage.locator('#pronadji-model')
    await chooser.getByRole('button',{name:'Više prodaje ili upita'}).click()
    await chooser.getByRole('button',{name:'Da, jedan projekat'}).click()
    await chooser.getByRole('button',{name:'Do 150 €'}).click()
    const recommended=await chooser.locator('.sales-recommendation-copy strong').innerText()
    if(!recommended || recommended.includes('Izaberite tri'))errors.push('Three-choice recommendation is not generated')
    const chosenLink=await chooser.locator('.sales-recommendation-actions a.button-primary').getAttribute('href')
    if(!chosenLink || !chosenLink.includes('izvor=chooser'))errors.push('Chooser did not carry recommendation context')

    await uxPage.goto(base+'/blog/',{waitUntil:'domcontentloaded'})
    const search=uxPage.getByRole('searchbox',{name:'Pretraži tekstove'})
    await search.fill('never-existing-topic-QA-38112')
    await uxPage.getByText('Nema rezultata',{exact:true}).waitFor({state:'visible'})
    await search.fill('')
    const count=await uxPage.locator('.blog-card').count()
    if(count<1)errors.push('Blog search reset did not restore article cards')
    console.log('CHECK mobile menu, recommendation chooser, and blog search filtering')
  } catch(e) {errors.push('Additional interactive checks '+String(e))}
  finally {await uxPage.close()}
} finally {await browser.close()}
if(errors.length){console.error('QA FAIL\n'+errors.join('\n'));process.exitCode=1}
else console.log('BROWSER QA PASS: '+(routes.length*widths.length)+' viewport/page combinations plus mobile pricing navigation')
