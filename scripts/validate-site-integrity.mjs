import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const failures = []
const warnings = []
const fail = (message) => failures.push(message)

const sourceFiles = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(target)
    else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(target)
  }
}
walk(path.join(root, 'src'))
const source = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')

const staticRoutes = new Set([
  '/', '/usluge/', '/industrije/', '/radovi/', '/o-nama/', '/blog/', '/kontakt/',
  '/postani-dio-tima/', '/privatnost/', '/kolacici/', '/uslovi-koriscenja/', '/hvala/',
])

const collectSlugs = (file) => [...read(file).matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1])
for (const slug of collectSlugs('src/data/services.ts')) staticRoutes.add(`/usluge/${slug}/`)
for (const slug of collectSlugs('src/data/industries.ts')) staticRoutes.add(`/industrije/${slug}/`)
for (const slug of collectSlugs('src/data/cases.ts')) staticRoutes.add(`/radovi/${slug}/`)
for (const post of JSON.parse(read('src/data/blog-posts.json'))) staticRoutes.add(`/blog/${post.slug}/`)

const literalLinks = []
for (const file of sourceFiles.filter((file) => file.endsWith('.tsx'))) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/\bhref=["']([^"']+)["']/g)) {
    literalLinks.push({ file: path.relative(root, file), href: match[1] })
  }

  for (const match of text.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/g)) {
    if (!/\brel=["'][^"']*(noopener|noreferrer)/.test(match[0])) fail(`${path.relative(root, file)} has target="_blank" without noopener/noreferrer`)
  }

  for (const match of text.matchAll(/<button\b([^>]*)>/g)) {
    if (!/\btype=/.test(match[1])) warnings.push(`${path.relative(root, file)} has a button without an explicit type`)
  }
}

for (const { file, href } of literalLinks) {
  if (!href.startsWith('/') || href.startsWith('//')) continue
  const route = href.split(/[?#]/)[0] || '/'
  if (route.startsWith('/images/') || route.startsWith('/icons/') || route.includes('${')) continue
  const normalized = route === '/' ? '/' : `${route.replace(/\/+$/, '')}/`
  if (!staticRoutes.has(normalized)) fail(`${file} links to an unknown internal route: ${href}`)
}

const redirectLines = read('public/_redirects').split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'))
for (const line of redirectLines) {
  const [, target] = line.split(/\s+/)
  if (!target || !target.startsWith('/') || target.includes(':')) continue
  const route = target.split(/[?#]/)[0] || '/'
  const normalized = route === '/' ? '/' : `${route.replace(/\/+$/, '')}/`
  if (!staticRoutes.has(normalized)) fail(`Redirect target does not resolve to a known route: ${line}`)
}

for (const match of source.matchAll(/\bsrc=["'](\/[^"']+)["']/g)) {
  const asset = match[1]
  if (asset.includes('${')) continue
  if (!fs.existsSync(path.join(root, 'public', asset.replace(/^\//, '')))) fail(`Missing referenced public asset: ${asset}`)
}

const sitemap = read('src/app/sitemap.ts')
for (const token of ['...services.map', '...industries.map', '...cases.map', '...blogPosts.map']) {
  if (!sitemap.includes(token)) fail(`Sitemap is missing dynamic collection: ${token}`)
}
const robots = read('src/app/robots.ts')
if (!robots.includes('sitemap')) fail('robots.ts does not expose the sitemap')

const manifest = read('src/app/manifest.ts')
if (manifest.includes("purpose: 'any maskable'")) fail('Manifest contains invalid combined icon purpose')
if (!manifest.includes("purpose: 'maskable'")) fail('Manifest is missing a maskable icon')

const visibleSalesFiles = ['src/app/page.tsx', 'src/data/services.ts', 'src/app/usluge/[slug]/page.tsx']
for (const file of visibleSalesFiles) {
  const text = read(file)
  if (/\b(?:od\s*)?\d[\d.]*\s*€(?:\s*\/\s*mj\.)?/i.test(text)) fail(`${file} contains an unconfirmed public price`)
}

for (const forbidden of ['Grafičke MART', 'Placeholderi ostaju', 'biće zaključani nakon interne provjere']) {
  if (source.includes(forbidden)) fail(`Public source still contains internal or incorrect wording: ${forbidden}`)
}

for (const token of ['form_start', 'generate_lead', 'next_page_view', 'outbound_click', 'file_download']) {
  if (!source.includes(token)) fail(`Tracking event is missing from source: ${token}`)
}

const headers = `${read('public/_headers')}\n${read('netlify.toml')}`
for (const host of ['https://script.google.com', 'https://www.google-analytics.com', 'https://www.googletagmanager.com']) {
  if (!headers.includes(host)) fail(`Security policy is missing required integration host: ${host}`)
}

if (warnings.length) console.warn(warnings.map((message) => `WARNING: ${message}`).join('\n'))
if (failures.length) {
  console.error(failures.map((message) => `ERROR: ${message}`).join('\n'))
  process.exit(1)
}
console.log(`Site integrity validation passed: ${staticRoutes.size} routes, ${literalLinks.length} literal links, ${redirectLines.length} redirects and core tracking/SEO checks.`)
