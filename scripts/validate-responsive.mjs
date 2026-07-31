import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const fail = (message) => {
  console.error(`ERROR: ${message}`)
  process.exitCode = 1
}

const css = read('src/app/globals.css')
const header = read('src/components/header.tsx')
const workFilter = read('src/components/work-filter.tsx')
const blogExplorer = read('src/components/blog-explorer.tsx')
const jobsBoard = read('src/components/jobs-board.tsx')
const caseMediaCss = read('src/components/case-media.module.css')

const responsiveChecks = [
  ['small phone breakpoint', '@media (max-width:420px)'],
  ['phone breakpoint', '@media (max-width:620px)'],
  ['small tablet breakpoint', '@media (max-width:760px)'],
  ['tablet breakpoint', '@media (max-width:900px)'],
  ['navigation breakpoint', '@media (max-width:1040px)'],
  ['safe-area support', 'env(safe-area-inset-bottom)'],
  ['dynamic viewport height', '100dvh'],
  ['article table overflow protection', '.article-content table'],
  ['article code overflow protection', '.article-content pre'],
  ['modal mobile layout', '.modal-dialog'],
  ['filter horizontal scrolling', '.work-filter-scroll'],
  ['full display audit layer', 'Full display audit corrections - v2.3'],
  ['single-column mobile service cards', '.service-grid-five{grid-template-columns:minmax(0,1fr)}'],
  ['mobile hero height correction', '.hero-visual{min-height:340px}'],
  ['mobile card padding correction', '.case-card-copy{padding:26px 23px}'],
  ['balanced heading wrapping', 'text-wrap:balance'],
  ['card height protection', '.case-grid-home-scroll>.case-card{height:auto;min-height:100%}'],
]

for (const [label, token] of responsiveChecks) {
  if (!css.includes(token)) fail(`Responsive CSS is missing ${label}: ${token}`)
}

if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
  fail('globals.css has unbalanced braces')
}


const mediaChecks = [
  ['media display audit layer', 'Full media display audit corrections - v2.3'],
  ['uncropped gallery media', 'object-fit:contain'],
  ['wide media ratio', ".mediaItem[data-aspect='wide'] .mediaFrame{aspect-ratio:16/8.5}"],
  ['portrait media ratio', ".mediaItem[data-aspect='portrait'] .mediaFrame{aspect-ratio:4/5}"],
  ['media caption growth protection', 'flex:0 0 auto'],
]

for (const [label, token] of mediaChecks) {
  if (!caseMediaCss.includes(token)) fail(`Media CSS is missing ${label}: ${token}`)
}

const componentChecks = [
  [header, 'mobile navigation focus trap', "event.key !== 'Tab'"],
  [header, 'Escape handling for mobile navigation', "event.key === 'Escape'"],
  [header, 'desktop resize cleanup', 'matchMedia(desktopMediaQuery)'],
  [header, 'mobile menu backdrop', 'mobile-menu-scrim'],
  [workFilter, 'accessible work filter group', 'role="group"'],
  [workFilter, 'filter result controls', 'aria-controls="work-results"'],
  [blogExplorer, 'scrollable blog filters', 'filter-row-scroll'],
  [jobsBoard, 'telephone input mode', 'inputMode="tel"'],
]

for (const [source, label, token] of componentChecks) {
  if (!source.includes(token)) fail(`Missing ${label}: ${token}`)
}

if (!process.exitCode) {
  console.log('Responsive validation passed: final cascade, card growth, media visibility, safe areas, mobile navigation, filters and forms.')
}
