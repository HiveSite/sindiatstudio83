import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const targets = [
  { name: 'imaposla-hq-home-desktop', url: 'https://www.imaposla.me/', width: 1728, height: 1060, dpr: 2, mobile: false, expect: /Pronađi posao/i },
  { name: 'imaposla-hq-jobs-desktop', url: 'https://www.imaposla.me/poslovi', width: 1728, height: 1060, dpr: 2, mobile: false, expect: /Oglasi za posao/i },
  { name: 'imaposla-hq-home-mobile', url: 'https://www.imaposla.me/', width: 430, height: 932, dpr: 3, mobile: true, expect: /Pronađi posao/i },
  { name: 'imaposla-hq-jobs-mobile', url: 'https://www.imaposla.me/poslovi', width: 430, height: 932, dpr: 3, mobile: true, expect: /Oglasi za posao/i },
  { name: 'imaposla-hq-companies-desktop', url: 'https://www.imaposla.me/firme', width: 1728, height: 1060, dpr: 2, mobile: false, expect: /Poslodavci|Firme/i },
]

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
const failures = []
for (const job of targets) {
  const context = await browser.newContext({
    viewport: { width: job.width, height: job.height },
    deviceScaleFactor: job.dpr,
    isMobile: job.mobile,
    hasTouch: job.mobile,
    locale: 'sr-RS',
    reducedMotion: 'reduce',
    colorScheme: 'light',
  })
  const page = await context.newPage()
  try {
    const response = await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    if (!response || response.status() >= 400) throw new Error('HTTP ' + response?.status())
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 20000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1800)
    for (const name of [/Samo neophodni/i, /Prihvati sve/i, /Accept all/i]) {
      await page.getByRole('button', { name }).first().click({ timeout: 1000 }).catch(() => {})
    }
    await page.waitForTimeout(350)
    const h1 = (await page.locator('h1').first().innerText()).replace(/\s+/g, ' ').trim()
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    if (!job.expect.test(text) || text.length < 250) throw new Error('Unexpected page: ' + text.slice(0, 230))
    const cover = await page.locator('body').evaluate(el => ({
      images: [...el.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth > 0).length,
      broken: [...el.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length,
      title: document.title,
    }))
    if (cover.broken > 8) throw new Error('Too many broken images: ' + cover.broken)
    const dest = path.resolve('public/images/cases/imaposla', job.name + '.jpg')
    await mkdir(path.dirname(dest), { recursive: true })
    await page.screenshot({ path: dest, type: 'jpeg', quality: 96, fullPage: false, animations: 'disabled', caret: 'hide' })
    console.log(JSON.stringify({ captured: job.name, dimensions: (job.width*job.dpr) + 'x' + (job.height*job.dpr), h1, ...cover }))
  } catch (error) {
    failures.push(job.name + ': ' + error.message)
    console.error('FAILED', job.name, error.message)
  } finally { await context.close() }
}
await browser.close()
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1 }
