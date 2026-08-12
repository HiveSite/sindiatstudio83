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
const leadForm = read('src/components/lead-form.tsx')
const caseMediaCss = read('src/components/case-media.module.css')
const caseMediaComponent = read('src/components/case-media.tsx')

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
  ['filter horizontal scrolling', '.work-filter-scroll'],
  ['full display audit layer', 'Full display audit corrections - v2.3'],
  ['single-column mobile service cards', '.service-grid-five{grid-template-columns:minmax(0,1fr)}'],
  ['mobile hero height correction', '.hero-visual{min-height:340px}'],
  ['mobile card padding correction', '.case-card-copy{padding:26px 23px}'],
  ['balanced heading wrapping', 'text-wrap:balance'],
  ['card height protection', '.case-grid-home-scroll>.case-card{height:auto;min-height:100%}'],
  ['full-width editorial layer', 'Full-width editorial layout and mobile polish - v2.4'],
  ['fluid full-width container', '--container:2200px'],
  ['fluid page gutters', '--page-gutters:clamp(24px,6vw,128px)'],
  ['wide featured work rail', 'grid-auto-columns:min(84vw,1320px)'],
  ['readable text measure', '--reading-measure:760px'],
  ['phone total gutters', ':root{--page-gutters:24px}'],
  ['small phone total gutters', ':root{--page-gutters:20px}'],
  ['mobile touch target', '.button,.menu-toggle,.modal-close,.filter-button{min-height:48px}'],
]

for (const [label, token] of responsiveChecks) {
  if (!css.includes(token)) fail(`Responsive CSS is missing ${label}: ${token}`)
}

if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
  fail('globals.css has unbalanced braces')
}

const mediaChecks = [
  ['uncropped gallery media', 'object-fit: contain'],
  ['full gallery visibility', 'opacity: 1'],
  ['wide media ratio', ".mediaItem[data-aspect='wide'] .mediaFrame"],
  ['portrait media ratio', ".mediaItem[data-aspect='portrait'] .mediaFrame"],
  ['clean gallery without decorative pseudo-elements', '.mediaItem::before'],
  ['thumbnail overlay', '.coverShade'],
  ['clean full-size case cover', '.fullCoverImage'],
]

for (const [label, token] of mediaChecks) {
  if (!caseMediaCss.includes(token)) fail(`Media CSS is missing ${label}: ${token}`)
}

if (caseMediaComponent.includes('<figcaption') || caseMediaComponent.includes('mediaCaption')) {
  fail('Gallery component still renders visible photo captions')
}
if (caseMediaComponent.includes('mediaVeil')) {
  fail('Gallery component still renders a dark image veil')
}
if (!caseMediaComponent.includes('if (!image) return null')) {
  fail('Missing images should not render instructional placeholder cards')
}

const componentChecks = [
  [header, 'mobile navigation focus trap', "event.key !== 'Tab'"],
  [header, 'Escape handling for mobile navigation', "event.key === 'Escape'"],
  [header, 'desktop resize cleanup', 'matchMedia(desktopMediaQuery)'],
  [header, 'mobile menu backdrop', 'mobile-menu-scrim'],
  [workFilter, 'accessible work filter group', 'role="group"'],
  [workFilter, 'filter result controls', 'aria-controls="work-results"'],
  [blogExplorer, 'scrollable blog filters', 'filter-row-scroll'],
  [leadForm, 'telephone input mode', 'inputMode="tel"'],
]

for (const [source, label, token] of componentChecks) {
  if (!source.includes(token)) fail(`Missing ${label}: ${token}`)
}

if (!process.exitCode) {
  console.log('Responsive validation passed: full-width layout, readable measures, final cascade, card growth, media visibility, safe areas, mobile navigation, filters and active lead form.')
}
