import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const targets = [
  { name: 'imaposla-live-home-desktop', url: 'https://www.imaposla.me/', width: 1440, height: 1000, dir: 'imaposla', minText: 'Pronađi' },
  { name: 'imaposla-live-jobs-desktop', url: 'https://www.imaposla.me/poslovi', width: 1440, height: 1000, dir: 'imaposla', minText: 'Poslovi' },
  { name: 'imaposla-live-home-mobile', url: 'https://www.imaposla.me/', width: 390, height: 844, dir: 'imaposla', minText: 'Pronađi' },
  { name: 'hive-live-home-desktop', url: 'https://hiveagency.me/', width: 1440, height: 1000, dir: 'hive-agency', minText: 'Iskustvo' },
  { name: 'hive-live-programs-desktop', url: 'https://hiveagency.me/programs/', width: 1440, height: 1000, dir: 'hive-agency', minText: 'Programi' },
  { name: 'hive-live-home-mobile', url: 'https://hiveagency.me/', width: 390, height: 844, dir: 'hive-agency', minText: 'Iskustvo' },
]
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
let failures = 0
for (const job of targets) {
  const context = await browser.newContext({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1, locale: 'sr-RS', colorScheme: 'light', reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    const response = await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    if (!response || response.status() >= 400) throw new Error('HTTP ' + response?.status())
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 22000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1600)
    await page.getByRole('button', { name: /Samo neophodni/i }).click({ timeout: 1200 }).catch(() => {})
    await page.waitForTimeout(250)
    const info = await page.evaluate(() => ({ text: (document.body?.innerText || '').slice(0, 6500), images: [...document.images].filter(i=>i.complete && i.naturalWidth>0).length }))
    if (!info.text.includes(job.minText) || info.text.length < 160) throw new Error('Unexpected page or empty content: ' + info.text.slice(0,200))
    const dest = path.resolve('public/images/cases', job.dir, job.name + '.jpg')
    await mkdir(path.dirname(dest), { recursive: true })
    await page.screenshot({ path: dest, type: 'jpeg', quality: 87, fullPage: false, animations: 'disabled', caret: 'hide' })
    console.log('CAPTURED ' + job.name + ' | ' + response.status() + ' | loaded images=' + info.images + ' | h1=' + (await page.locator('h1').first().innerText()).slice(0, 95))
  } catch (err) {
    failures++
    console.error('FAILED ' + job.name, err)
  } finally {
    await context.close()
  }
}
await browser.close()
if (failures) { console.error(failures + ' capture failures'); process.exitCode=1 }
