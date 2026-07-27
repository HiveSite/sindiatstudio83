import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const target = path.join(root, 'src/data/blog-posts.json')
const endpoint = process.env.NEXT_PUBLIC_BLOG_ENDPOINT
  || 'https://script.google.com/macros/s/AKfycbzGf2MSW8mS-sm9ZUnszl7rfYoP2WRJ-3reuYdeMz-4PD0adX2L5ZzOz47Xaa-w-45N/exec?sheet=Posts&onlyPublished=1'

const current = JSON.parse(fs.readFileSync(target, 'utf8'))
const response = await fetch(endpoint, { headers: { accept: 'application/json' } })
if (!response.ok) throw new Error(`Blog API returned HTTP ${response.status}`)
const payload = await response.json()
const posts = Array.isArray(payload) ? payload : payload?.posts
if (!Array.isArray(posts)) throw new Error(payload?.error || 'Blog API response is invalid')

const map = new Map(current.map((post) => [post.slug, post]))
for (const remote of posts) {
  if (!remote?.slug) continue
  const old = map.get(remote.slug) || {}
  map.set(remote.slug, {
    ...old,
    slug: remote.slug,
    title: remote.title || old.title || '',
    excerpt: remote.excerpt || old.excerpt || '',
    description: remote.description || remote.excerpt || old.description || '',
    category: remote.category || old.category || 'blog',
    date: remote.date || old.date || '',
    cover: remote.cover_image?.startsWith('/sr-me/blog/covers/')
      ? remote.cover_image.replace('/sr-me/blog/covers/', '/images/blog/')
      : (old.cover || `/images/blog/${remote.slug}.svg`),
    coverAlt: remote.cover_alt || old.coverAlt || remote.title || '',
    tags: Array.isArray(remote.tags) ? remote.tags : (old.tags || []),
    body: remote.body || remote.content || old.body || '<p>Sadržaj je u pripremi.</p>',
  })
}

fs.writeFileSync(target, JSON.stringify([...map.values()], null, 2) + '\n', 'utf8')
console.log(`Synchronized ${posts.length} remote posts. Total local posts: ${map.size}`)
