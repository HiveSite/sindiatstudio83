'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type ChangeEvent, useMemo, useState } from 'react'
import type { BlogPost } from '@/types/content'
import { categoryLabels } from '@/data/blog'
import { trackEvent } from '@/lib/tracking'

export function BlogExplorer({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')
  const categories = useMemo(() => [...new Set(initialPosts.map((post) => post.category))], [initialPosts])

  const filtered = initialPosts.filter((post) => {
    const categoryMatch = active === 'all' || post.category === active
    const text = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase('sr-Latn-ME')
    return categoryMatch && (!query || text.includes(query.toLocaleLowerCase('sr-Latn-ME')))
  })

  const selectCategory = (category: string) => {
    setActive(category)
    trackEvent('blog_filter', { category })
  }

  return (
    <>
      <div className="blog-toolbar">
        <div className="filter-row" role="group" aria-label="Filtriraj tekstove po kategoriji">
          <button className={`filter-button${active === 'all' ? ' is-active' : ''}`} type="button" aria-pressed={active === 'all'} onClick={() => selectCategory('all')}>Sve</button>
          {categories.map((category) => <button key={category} className={`filter-button${active === category ? ' is-active' : ''}`} type="button" aria-pressed={active === category} onClick={() => selectCategory(category)}>{categoryLabels[category] || category}</button>)}
        </div>
        <label className="search-field"><span className="sr-only">Pretraži tekstove</span><input type="search" placeholder="Pretraži tekstove" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} /></label>
      </div>
      <p className="result-count" aria-live="polite">Prikazano: {filtered.length} od {initialPosts.length} tekstova.</p>
      <div className="blog-grid">
        {filtered.map((post) => <article className="blog-card" key={post.slug}>
          <Image src={post.cover} width={1280} height={720} loading="lazy" sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw" alt={post.coverAlt} />
          <div className="blog-card-copy"><span>{categoryLabels[post.category] || post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}/`}>Pročitaj tekst ↗</Link></div>
        </article>)}
      </div>
      {!filtered.length ? <div className="empty-state"><h2>Nema rezultata</h2><p>Probaj drugu riječ ili vrati filter na Sve.</p></div> : null}
    </>
  )
}
