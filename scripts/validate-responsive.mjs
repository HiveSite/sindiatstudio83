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
  ['long-content wrapping', 'overflow-wrap:break-word'],
]

for (const [label, token] of responsiveChecks) {
  if (!css.includes(token)) fail(`Responsive CSS is missing ${label}: ${token}`)
}

if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
  fail('globals.css has unbalanced braces')
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
  console.log('Responsive validation passed: breakpoints, overflow protection, safe areas, mobile navigation, filters and forms.')
}
