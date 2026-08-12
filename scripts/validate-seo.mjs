import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const failures = []
const warnings = []
const fail = (message) => failures.push(message)
const warn = (message) => warnings.push(message)

const metadata = read('src/lib/metadata.ts')
for (const token of ['alternates: { canonical }', 'openGraph', 'twitter', 'max-image-preview']) {
  if (!metadata.includes(token)) fail(`Metadata helper is missing SEO token: ${token}`)
}
if (!metadata.includes('index: false') || !metadata.includes('follow: true')) fail('Noindex metadata must remain crawlable with follow=true')

const robots = read('src/app/robots.ts')
if (!robots.includes('sitemap:')) fail('robots.ts must expose sitemap.xml')
if (!robots.includes('host: site.domain')) fail('robots.ts must declare canonical host')
if (/hvala/i.test(robots) && /disallow/i.test(robots)) fail('/hvala/ must not be blocked in robots.txt because its page-level noindex must remain crawlable')

const sitemap = read('src/app/sitemap.ts')
for (const forbidden of ['/privatnost/', '/kolacici/', '/uslovi-koriscenja/', '/hvala/']) {
  if (sitemap.includes(`'${forbidden}'`) || sitemap.includes(`\`${forbidden}\``)) fail(`Non-indexable utility route found in sitemap source: ${forbidden}`)
}
if (sitemap.includes('changeFrequency') || sitemap.includes('priority:')) fail('Sitemap should not emit ignored changeFrequency/priority values')
if (!sitemap.includes('images:')) fail('Sitemap should expose discoverable image URLs for visual content')

for (const file of ['src/app/hvala/page.tsx', 'src/app/[legal]/page.tsx']) {
  if (!read(file).includes('noIndex: true')) fail(`${file} must remain noindex`)
}

const redirects = read('public/_redirects')
for (const line of [
  'https://sindikatstudio83.me/* https://www.sindikatstudio83.me/:splat 301!',
  'https://sindikatstudio83.netlify.app/* https://www.sindikatstudio83.me/:splat 301!',
  'https://main--sindikatstudio83.netlify.app/* https://www.sindikatstudio83.me/:splat 301!',
]) {
  if (!redirects.includes(line)) fail(`Missing canonical host redirect: ${line}`)
}

const hubPages = [
  'src/app/page.tsx',
  'src/app/usluge/page.tsx',
  'src/app/radovi/page.tsx',
  'src/app/industrije/page.tsx',
  'src/app/blog/page.tsx',
]
for (const file of hubPages) {
  const text = read(file)
  if (!text.includes('createMetadata')) fail(`${file} must use shared metadata helper`)
  if (!text.includes('webPageSchema')) fail(`${file} must expose WebPage/CollectionPage structured data`)
  if (!text.includes('itemListSchema')) fail(`${file} must expose crawlable collection hierarchy with ItemList structured data`)
  const h1Count = (text.match(/<h1\b/g) || []).length
  if (h1Count !== 1) fail(`${file} should contain exactly one explicit H1, found ${h1Count}`)
}

for (const file of ['src/app/o-nama/page.tsx', 'src/app/kontakt/page.tsx']) {
  const text = read(file)
  if (!text.includes('webPageSchema')) fail(`${file} must expose page-specific structured data`)
  const h1Count = (text.match(/<h1\b/g) || []).length
  if (h1Count !== 1) fail(`${file} should contain exactly one explicit H1, found ${h1Count}`)
}

const detailPages = [
  'src/app/usluge/[slug]/page.tsx',
  'src/app/industrije/[slug]/page.tsx',
  'src/app/radovi/[slug]/page.tsx',
  'src/app/blog/[slug]/page.tsx',
]
for (const file of detailPages) {
  const text = read(file)
  if (!text.includes('breadcrumbSchema')) fail(`${file} is missing breadcrumb structured data`)
  if (!text.includes('webPageSchema')) fail(`${file} is missing WebPage structured data`)
}
if (!read('src/app/usluge/[slug]/page.tsx').includes('serviceSchema')) fail('Service detail pages are missing Service structured data')
if (!read('src/app/blog/[slug]/page.tsx').includes("'@type': 'BlogPosting'")) fail('Blog articles must use BlogPosting structured data')
if (!read('src/app/radovi/[slug]/page.tsx').includes('href={`/usluge/${service.slug}/`}')) fail('Case studies must link disciplines to service pages')

const posts = JSON.parse(read('src/data/blog-posts.json'))
const titles = new Set()
const descriptions = new Set()
for (const post of posts) {
  if (titles.has(post.title)) fail(`Duplicate blog title: ${post.title}`)
  if (descriptions.has(post.description)) fail(`Duplicate blog meta description: ${post.slug}`)
  titles.add(post.title)
  descriptions.add(post.description)
  if (String(post.title).length < 20 || String(post.title).length > 90) warn(`Review blog title length (${post.title.length}): ${post.slug}`)
  if (String(post.description).length < 70 || String(post.description).length > 180) warn(`Review blog description length (${post.description.length}): ${post.slug}`)
}

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
if (/\bkeywords\s*:/i.test(metadata)) warn('Do not add legacy meta keywords to shared metadata; Google does not use them for ranking')

for (const file of sourceFiles.filter((file) => file.endsWith('.tsx'))) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/<Image\b([\s\S]*?)\/>/g)) {
    if (!/\balt=/.test(match[1])) warn(`${path.relative(root, file)} has a Next Image without an explicit alt attribute`)
  }
}

if (warnings.length) console.warn(warnings.map((message) => `SEO WARNING: ${message}`).join('\n'))
if (failures.length) {
  console.error(failures.map((message) => `SEO ERROR: ${message}`).join('\n'))
  process.exit(1)
}
console.log(`SEO validation passed: ${hubPages.length} hubs, ${detailPages.length} detail templates, ${posts.length} blog posts, ${warnings.length} warnings.`)
