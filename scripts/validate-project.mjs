import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const required = [
  'next.config.ts', 'netlify.toml', 'src/app/layout.tsx', 'src/app/page.tsx',
  'src/app/sitemap.ts', 'src/app/robots.ts', 'src/app/manifest.ts', 'src/data/site.ts',
  'src/components/lead-form.tsx', 'src/components/jobs-board.tsx', 'src/lib/tracking.ts',
  'public/_redirects', 'public/_headers', 'public/.well-known/security.txt',
]
const failures = []
const warnings = []
for (const file of required) if (!fs.existsSync(path.join(root, file))) failures.push(`Missing required file: ${file}`)

const blogPath = path.join(root, 'src/data/blog-posts.json')
const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
const slugs = new Set()
for (const [index, post] of posts.entries()) {
  if (!post.slug || !post.title || !post.description || !post.cover || !post.body || !post.coverAlt) failures.push(`Incomplete blog post at index ${index}`)
  if (slugs.has(post.slug)) failures.push(`Duplicate blog slug: ${post.slug}`)
  slugs.add(post.slug)

  const asset = path.join(root, 'public', String(post.cover).replace(/^\//, ''))
  if (!fs.existsSync(asset)) failures.push(`Missing blog cover: ${post.cover}`)
  if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) failures.push(`Invalid blog date: ${post.slug}`)
  if (!post.date) warnings.push(`Blog post has no confirmed publication date: ${post.slug}`)
  if (String(post.description || '').length > 165) warnings.push(`Long meta description (${post.description.length} chars): ${post.slug}`)
  if (String(post.description || '').length < 70) warnings.push(`Short meta description (${post.description.length} chars): ${post.slug}`)
  if (/[\u0400-\u04FF]/.test(`${post.title} ${post.excerpt} ${post.description}`)) warnings.push(`Cyrillic detected in Latin content: ${post.slug}`)
  if (/<\s*(script|iframe|object|embed|form|style|link|meta)\b/i.test(post.body)) failures.push(`Unsafe HTML tag in blog body: ${post.slug}`)
  if (/<img\b[^>]+src=[\"'](?:https?:\/\/|\/sr-me\/)/i.test(post.body)) failures.push(`External or legacy image in blog body: ${post.slug}`)
  const words = String(post.body).replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  if (words < 250) warnings.push(`Thin blog content (${words} words): ${post.slug}`)
}

const sourceFiles = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(target)
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) sourceFiles.push(target)
  }
}
walk(path.join(root, 'src'))
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8')
  const result = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    fileName: file,
    reportDiagnostics: true,
  })
  for (const diagnostic of result.diagnostics || []) {
    if (diagnostic.category === ts.DiagnosticCategory.Error) failures.push(`${path.relative(root, file)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`)
  }
}

const redirects = fs.readFileSync(path.join(root, 'public/_redirects'), 'utf8')
for (const requiredRedirect of ['/sr-me/ / 301!', '/sr-me/kontakt/ /kontakt/ 301!', '/sr-me/poslovi/ /postani-dio-tima/ 301!']) {
  if (!redirects.includes(requiredRedirect)) failures.push(`Missing redirect rule: ${requiredRedirect}`)
}
const redirectSources = redirects.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).map((line) => line.split(/\s+/)[0])
for (const source of new Set(redirectSources)) if (redirectSources.filter((item) => item === source).length > 1) warnings.push(`Duplicate redirect source: ${source}`)

const headers = fs.readFileSync(path.join(root, 'public/_headers'), 'utf8')
for (const header of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy']) {
  if (!headers.includes(header)) failures.push(`Missing security header: ${header}`)
}

if (warnings.length) console.warn(warnings.map((item) => `WARNING: ${item}`).join('\n'))
if (failures.length) {
  console.error(failures.map((item) => `ERROR: ${item}`).join('\n'))
  process.exit(1)
}
console.log(`Source validation passed: ${sourceFiles.length} TS/TSX files, ${posts.length} blog posts, ${required.length} required files, ${warnings.length} warnings.`)
