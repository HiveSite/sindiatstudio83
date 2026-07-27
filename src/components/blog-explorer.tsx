'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import type { BlogPost } from '@/types/content'
import { categoryLabels } from '@/data/blog'
import { site } from '@/data/site'

export function BlogExplorer({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')
  const categories = useMemo(() => [...new Set(initialPosts.map((post) => post.category))], [initialPosts])

  useEffect(() => {
    const controller = new AbortController()
    fetch(site.integrations.blogEndpoint, { cache: 'no-store', signal: controller.signal })
      .then((response) => response.json())
      .then((data: { posts?: Array<Partial<BlogPost>> }) => {
        const live = Array.isArray(data?.posts) ? data.posts : []
        let matched = 0
        setPosts((current) => current.map((post) => {
          const update = live.find((candidate) => String(candidate.slug || '') === post.slug)
          if (!update) return post
          matched += 1
          return { ...post, title: update.title || post.title, excerpt: update.excerpt || post.excerpt }
        }))
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'blog_feed_sync', matched_posts: matched })
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const filtered = posts.filter((post) => {
    const categoryMatch = active === 'all' || post.category === active
    const text = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase('sr')
    return categoryMatch && (!query || text.includes(query.toLocaleLowerCase('sr')))
  })

  const selectCategory = (category: string) => {
    setActive(category)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'blog_filter', category })
  }

  return (
    <>
      <div className="blog-toolbar">
        <div className="filter-row">
          <button className={`filter-button${active === 'all' ? ' is-active' : ''}`} type="button" onClick={() => selectCategory('all')}>Sve</button>
          {categories.map((category) => <button key={category} className={`filter-button${active === category ? ' is-active' : ''}`} type="button" onClick={() => selectCategory(category)}>{categoryLabels[category] || category}</button>)}
        </div>
        <label className="search-field"><span className="sr-only">Pretraži tekstove</span><input type="search" placeholder="Pretraži tekstove" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} /></label>
      </div>
      <div className="blog-grid">
        {filtered.map((post) => <article className="blog-card" key={post.slug}>
          <Image src={post.cover} width={1280} height={720} loading="lazy" alt={post.coverAlt} />
          <div className="blog-card-copy"><span>{categoryLabels[post.category] || post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}/`}>Pročitaj tekst ↗</Link></div>
        </article>)}
      </div>
    </>
  )
}
