import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import sharp from 'sharp'

const root = process.cwd()
const outputDir = path.join(root, 'public/images/cases/imaposla')
const dataFile = path.join(root, 'src/data/case-gallery-overrides.ts')

const canvas = { width: 1055, height: 1491 }
const viewport = { width: 1440, height: 1000 }
const screenshotBox = { left: 42, top: 124, width: 971, height: 1325 }

const captures = [
  {
    name: 'imaposla-pocetna-platforma-poslovi.webp',
    url: 'https://www.imaposla.me/',
    address: 'imaposla.me',
    label: 'Početna stranica platforme i pregled glavnih tokova',
    alt: 'Početna stranica ImaPosla.me sa pretragom poslova, najnovijim oglasima, brzim angažmanima i kategorijama',
  },
  {
    name: 'imaposla-oglasi-za-posao.webp',
    url: 'https://www.imaposla.me/oglasi',
    address: 'imaposla.me/oglasi',
    label: 'Pretraga i filtriranje oglasa za posao',
    alt: 'Stranica oglasa za posao na ImaPosla.me sa filterima po gradu i kategoriji',
  },
  {
    name: 'imaposla-brzi-angazmani.webp',
    url: 'https://www.imaposla.me/brzi-poslovi',
    address: 'imaposla.me/brzi-poslovi',
    label: 'Kratki poslovi sa terminom, lokacijom i naknadom',
    alt: 'Stranica brzih angažmana na ImaPosla.me sa karticama kratkih poslova i filterima',
  },
  {
    name: 'imaposla-usluge-marketplace.webp',
    url: 'https://www.imaposla.me/usluge',
    address: 'imaposla.me/usluge',
    label: 'Marketplace lokalnih usluga i pružalaca',
    alt: 'Marketplace usluga na ImaPosla.me sa profilima fotografa, servisa, hostesa i drugih pružalaca',
  },
  {
    name: 'imaposla-firme-poslodavci.webp',
    url: 'https://www.imaposla.me/firme',
    address: 'imaposla.me/firme',
    label: 'Javni profili poslodavaca',
    alt: 'Stranica poslodavaca na ImaPosla.me sa javnim profilima firmi iz Crne Gore',
  },
  {
    name: 'imaposla-kategorije-poslova.webp',
    url: 'https://www.imaposla.me/kategorije',
    address: 'imaposla.me/kategorije',
    label: 'Pregled poslova po kategorijama',
    alt: 'Pregled kategorija poslova na ImaPosla.me uključujući ugostiteljstvo, turizam, prodaju, administraciju i IT',
  },
]

const obsoleteFiles = [
  'imaposla-brzi-poslovi-mobilni-prikaz.avif',
  'imaposla-brzi-poslovi-mobilni-prikaz.webp',
  'imaposla-brzi-poslovi-oglasi-desktop.avif',
  'imaposla-brzi-poslovi-oglasi-desktop.webp',
  'imaposla-desktop-pocetna-brzi-angazmani.avif',
  'imaposla-desktop-pocetna-brzi-angazmani.webp',
  'imaposla-marketplace-usluga-desktop.avif',
  'imaposla-marketplace-usluga-desktop.webp',
  'imaposla-mobilna-naslovna-pretraga-poslova-podgorica.avif',
  'imaposla-mobilna-naslovna-pretraga-poslova-podgorica.webp',
  'imaposla-mobilni-gradovi-i-usluge.avif',
  'imaposla-mobilni-gradovi-i-usluge.webp',
]

function escapeXml(value) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character])
}

function browserChrome(address) {
  const safeAddress = escapeXml(address)
  return Buffer.from(`
    <svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#142033" flood-opacity="0.17"/>
        </filter>
        <linearGradient id="toolbar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#f5f5f4"/>
        </linearGradient>
      </defs>
      <rect width="1055" height="1491" fill="#f7f6f3"/>
      <rect x="24" y="28" width="1007" height="1435" rx="20" fill="#ffffff" stroke="#d7d9dc" filter="url(#shadow)"/>
      <path d="M44 28h967a20 20 0 0 1 20 20v69H24V48a20 20 0 0 1 20-20Z" fill="url(#toolbar)"/>
      <line x1="24" y1="117" x2="1031" y2="117" stroke="#dedfe2"/>
      <circle cx="61" cy="69" r="8" fill="#ff5f57"/>
      <circle cx="87" cy="69" r="8" fill="#febc2e"/>
      <circle cx="113" cy="69" r="8" fill="#28c840"/>
      <path d="M173 62v14M167 63h12v12h-12z" fill="none" stroke="#6e7278" stroke-width="2"/>
      <path d="M222 61l-8 8 8 8M258 61l8 8-8 8" fill="none" stroke="#73777c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="323" y="47" width="409" height="44" rx="13" fill="#ececeb"/>
      <path d="M454 65v-3a5 5 0 0 1 10 0v3M453 65h12v10h-12z" fill="#85898e"/>
      <text x="527.5" y="75" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#4e5359">${safeAddress}</text>
      <path d="M709 61a8 8 0 1 0 3 6M709 61v7h-7" fill="none" stroke="#777b80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M887 75V57M880 64l7-7 7 7M879 74h16" fill="none" stroke="#6f7479" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M927 69h18M936 60v18" fill="none" stroke="#6f7479" stroke-width="2" stroke-linecap="round"/>
      <rect x="966" y="60" width="15" height="15" rx="2" fill="none" stroke="#6f7479" stroke-width="2"/>
      <rect x="971" y="65" width="15" height="15" rx="2" fill="none" stroke="#6f7479" stroke-width="2"/>
      <rect x="42" y="124" width="971" height="1325" rx="10" fill="#ffffff"/>
    </svg>
  `)
}

async function dismissOverlays(page) {
  const labels = ['Prihvati sve', 'Prihvati', 'Slažem se', 'U redu', 'Zatvori']
  for (const label of labels) {
    const button = page.getByRole('button', { name: label, exact: true }).first()
    if (await button.isVisible().catch(() => false)) await button.click().catch(() => {})
  }

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html { scrollbar-width: none !important; }
      body::-webkit-scrollbar { display: none !important; }
      [class*="cookie" i], [id*="cookie" i] { display: none !important; }
    `,
  })
}

await fs.mkdir(outputDir, { recursive: true })
const browser = await chromium.launch({ headless: true })

for (const capture of captures) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 })
  await page.goto(capture.url, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.evaluate(() => document.fonts.ready)
  await dismissOverlays(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)

  const pageScreenshot = await page.screenshot({ type: 'png', fullPage: true })
  const fittedPage = await sharp(pageScreenshot)
    .resize({
      width: screenshotBox.width,
      height: screenshotBox.height,
      fit: 'contain',
      position: 'top',
      background: '#ffffff',
    })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: canvas.width,
      height: canvas.height,
      channels: 4,
      background: '#f7f6f3',
    },
  })
    .composite([
      { input: browserChrome(capture.address), top: 0, left: 0 },
      { input: fittedPage, top: screenshotBox.top, left: screenshotBox.left },
    ])
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(path.join(outputDir, capture.name))

  await page.close()
}

await browser.close()

for (const fileName of obsoleteFiles) {
  await fs.rm(path.join(outputDir, fileName), { force: true })
}

const entries = captures.map((capture) => `    {
      label: '${capture.label}',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/${capture.name}',
        alt: '${capture.alt}',
        width: ${canvas.width},
        height: ${canvas.height},
      },
    },`).join('\n')

await fs.writeFile(dataFile, `import type { CaseStudyMedia } from '@/types/content'

export const caseGalleryOverrides: Record<string, CaseStudyMedia[]> = {
  'imaposla-digitalni-proizvod': [
${entries}
  ],
}
`)

console.log(`Generated ${captures.length} ImaPosla case-study screenshots with a consistent browser frame.`)
