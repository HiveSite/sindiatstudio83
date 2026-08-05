import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const root = process.cwd()
const outputDir = path.join(root, 'public/images/cases/imaposla')
const dataFile = path.join(root, 'src/data/case-gallery-overrides.ts')

await fs.mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })

const captures = [
  {
    name: 'imaposla-desktop-pocetna-brzi-angazmani.webp',
    url: 'https://www.imaposla.me/',
    viewport: { width: 1304, height: 943 },
    deviceScaleFactor: 2,
    anchor: 'Brzi angažmani',
    offset: 370,
  },
  {
    name: 'imaposla-mobilna-naslovna-pretraga-poslova-podgorica.webp',
    url: 'https://www.imaposla.me/',
    viewport: { width: 395, height: 858 },
    deviceScaleFactor: 2,
  },
  {
    name: 'imaposla-brzi-poslovi-oglasi-desktop.webp',
    url: 'https://www.imaposla.me/brzi-poslovi',
    viewport: { width: 1294, height: 940 },
    deviceScaleFactor: 2,
  },
  {
    name: 'imaposla-brzi-poslovi-mobilni-prikaz.webp',
    url: 'https://www.imaposla.me/brzi-poslovi',
    viewport: { width: 510, height: 681 },
    deviceScaleFactor: 2,
  },
  {
    name: 'imaposla-marketplace-usluga-desktop.webp',
    url: 'https://www.imaposla.me/usluge',
    viewport: { width: 1307, height: 945 },
    deviceScaleFactor: 2,
  },
  {
    name: 'imaposla-mobilni-gradovi-i-usluge.webp',
    url: 'https://www.imaposla.me/',
    viewport: { width: 390, height: 850 },
    deviceScaleFactor: 2,
    anchor: 'Gradovi',
    offset: 75,
  },
]

async function dismissOverlays(page) {
  const labels = ['Prihvati sve', 'Prihvati', 'Slažem se', 'U redu', 'Zatvori']
  for (const label of labels) {
    const button = page.getByRole('button', { name: label, exact: true }).first()
    if (await button.isVisible().catch(() => false)) {
      await button.click().catch(() => {})
    }
  }

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      [class*="cookie" i], [id*="cookie" i] { display: none !important; }
    `,
  })
}

async function positionPage(page, anchor, offset = 0) {
  if (!anchor) {
    await page.evaluate(() => window.scrollTo(0, 0))
    return
  }

  const heading = page.getByText(anchor, { exact: true }).first()
  await heading.waitFor({ state: 'visible', timeout: 30_000 })
  const box = await heading.boundingBox()
  if (!box) throw new Error(`Anchor not measurable: ${anchor}`)

  await page.evaluate(
    ({ targetY, topOffset }) => window.scrollTo({ top: Math.max(0, window.scrollY + targetY - topOffset), behavior: 'instant' }),
    { targetY: box.y, topOffset: offset },
  )
  await page.waitForTimeout(600)
}

for (const capture of captures) {
  const page = await browser.newPage({
    viewport: capture.viewport,
    deviceScaleFactor: capture.deviceScaleFactor,
  })

  await page.goto(capture.url, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.evaluate(() => document.fonts.ready)
  await dismissOverlays(page)
  await positionPage(page, capture.anchor, capture.offset)

  await page.screenshot({
    path: path.join(outputDir, capture.name),
    type: 'webp',
    quality: 95,
    fullPage: false,
  })

  await page.close()
}

await browser.close()

let data = await fs.readFile(dataFile, 'utf8')
data = data.replaceAll('.avif', '.webp')

const dimensions = [
  ['imaposla-desktop-pocetna-brzi-angazmani.webp', 2608, 1886],
  ['imaposla-mobilna-naslovna-pretraga-poslova-podgorica.webp', 790, 1716],
  ['imaposla-brzi-poslovi-oglasi-desktop.webp', 2588, 1880],
  ['imaposla-brzi-poslovi-mobilni-prikaz.webp', 1020, 1362],
  ['imaposla-marketplace-usluga-desktop.webp', 2614, 1890],
  ['imaposla-mobilni-gradovi-i-usluge.webp', 780, 1700],
]

for (const [fileName, width, height] of dimensions) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(src: '/images/cases/imaposla/${escaped}',[\\s\\S]*?width:) \\d+,(\\s*height:) \\d+,`)
  data = data.replace(pattern, `$1 ${width},$2 ${height},`)
}

await fs.writeFile(dataFile, data)
console.log(`Captured ${captures.length} ImaPosla screenshots in 2x resolution.`)
