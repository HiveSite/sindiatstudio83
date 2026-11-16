'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type ChangeEvent, useMemo, useState } from 'react'
import type { BlogPost } from '@/types/content'
import { categoryLabels } from '@/data/blog'
import { trackEvent } from '@/lib/tracking'
import { localeHref,type SiteLocale } from '@/lib/locale'

export function BlogExplorer({ initialPosts, locale='sr' }: { initialPosts: BlogPost[]; locale?:SiteLocale }) {
  const en=locale==='en'
  const englishCategories:Record<string,string>={strategija:'Strategy',performance:'Advertising',kreative:'Creative',dogadjaji:'Events',aktivacije:'Activations',seo:'SEO',web:'Websites'}
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')
  const categories = useMemo(() => [...new Set(initialPosts.map((post) => post.category))], [initialPosts])

  const filtered = initialPosts.filter((post) => {
    const categoryMatch = active === 'all' || post.category === active
    const text = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase(en?'en':'sr-Latn-ME')
    return categoryMatch && (!query || text.includes(query.toLocaleLowerCase('sr-Latn-ME')))
  })

  const selectCategory = (category: string) => {
    setActive(category)
    trackEvent('blog_filter', { category })
  }

  return (
    <>
      <div className="blog-toolbar">
        <div className="filter-row filter-row-scroll" role="group" aria-label={en?"Filter articles by category":"Filtriraj tekstove po kategoriji"}>
          <button className={`filter-button${active === 'all' ? ' is-active' : ''}`} type="button" aria-pressed={active === 'all'} onClick={() => selectCategory('all')}>{en?'All':'Sve'}</button>
          {categories.map((category) => <button key={category} className={`filter-button${active === category ? ' is-active' : ''}`} type="button" aria-pressed={active === category} onClick={() => selectCategory(category)}>{en?englishCategories[category]||category:categoryLabels[category]||category}</button>)}
        </div>
        <label className="search-field"><span className="sr-only">{en?"Search articles":"Pretraži tekstove"}</span><input type="search" placeholder={en?"Search articles":"Pretraži tekstove"} value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} /></label>
      </div>
      <p className="result-count" aria-live="polite">{en?"Showing":"Prikazano:"} {filtered.length} {en?"of":"od"} {initialPosts.length} {en?"articles.":"tekstova."}</p>
      <div className="blog-grid">
        {filtered.map((post) => <article className="blog-card blog-card-editorial" key={post.slug}>
          <Link className="blog-card-media" href={localeHref(locale,`/blog/${post.slug}/`)} aria-label={en ? `Read: ${post.title}` : `Pročitaj: ${post.title}`}>
            <Image src={post.cover} width={1000} height={1000} loading="lazy" sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw" alt={post.coverAlt} />
          </Link>
          <div className="blog-card-copy"><span>{en?englishCategories[post.category]||post.category:categoryLabels[post.category]||post.category}</span><h2><Link href={localeHref(locale,`/blog/${post.slug}/`)}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="blog-card-read" href={localeHref(locale,`/blog/${post.slug}/`)}>{en?'Read the guide ↗':'Pročitaj vodič ↗'}</Link></div>
        </article>)}
      </div>
      {!filtered.length ? <div className="empty-state"><h2 >{en?'No results':'Nema rezultata'}</h2><p>{en?'Try another term or reset the filter to All.':'Probaj drugu riječ ili vrati filter na Sve.'}</p></div> : null}
    </>
  )
}
