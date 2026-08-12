import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { blogPostBySlug, blogPosts, categoryLabels } from '@/data/blog'
import { serviceBySlug } from '@/data/services'
import { site } from '@/data/site'
import { cleanArticleBody, plainTextFromHtml } from '@/lib/blog'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })) }

const serviceSlugByCategory: Record<string, string> = {
  performance: 'performance-marketing',
  seo: 'web-i-konverzije',
  web: 'web-i-konverzije',
  kreative: 'sadrzaj-za-kampanje',
  dogadjaji: 'aktivacije-i-eventi',
  aktivacije: 'aktivacije-i-eventi',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPostBySlug[slug]
  if (!post) return {}
  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
    image: post.cover,
    imageAlt: post.coverAlt,
    type: 'article',
    publishedTime: post.date || undefined,
    modifiedTime: post.date || undefined,
    tags: post.tags,
  })
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPostBySlug[slug]
  if (!post) notFound()

  const related = blogPosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score: (item.category === post.category ? 5 : 0) + item.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item)

  const relatedService = serviceBySlug[serviceSlugByCategory[post.category] || '']
  const plainText = plainTextFromHtml(post.body)
  const path = `/blog/${post.slug}/`
  const crumbs = [{ label: 'Resursi', href: '/blog/' }, { label: post.title, href: path }]
  const publishedDate = post.date || undefined
  const articleUrl = `${site.domain}${path}`

  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({
        name: post.title,
        description: post.description,
        path,
        image: post.cover,
        about: relatedService ? [{ name: relatedService.shortTitle, url: `/usluge/${relatedService.slug}/` }] : undefined,
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${articleUrl}#article`,
        headline: post.title,
        description: post.description,
        image: [`${site.domain}${post.cover}`],
        author: { '@id': `${site.domain}/#organization` },
        publisher: { '@id': `${site.domain}/#organization` },
        mainEntityOfPage: { '@id': `${articleUrl}#webpage` },
        isPartOf: { '@id': `${site.domain}/blog/#blog` },
        url: articleUrl,
        inLanguage: site.locale,
        datePublished: publishedDate,
        dateModified: publishedDate,
        keywords: post.tags.join(', '),
        articleSection: categoryLabels[post.category] || post.category,
        wordCount: plainText.split(/\s+/).filter(Boolean).length,
      },
    ]} />
    <article><header className="article-hero"><div className="container article-hero-inner"><Breadcrumbs items={crumbs} /><span className="eyebrow">{categoryLabels[post.category] || post.category}</span><h1>{post.title}</h1><p className="lead">{post.excerpt}</p><div className="article-meta"><span>Sindikat Studio 83</span>{publishedDate ? <time dateTime={publishedDate}>{publishedDate}</time> : null}{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></header><div className="article-cover"><Image src={post.cover} width={1280} height={720} priority sizes="(max-width: 900px) 100vw, 1200px" alt={post.coverAlt} /></div><section className="section"><div className="container article-layout"><aside className="article-aside"><strong>U tekstu</strong><nav><a href="#article-content">Čitanje</a><a href="#povezani">Povezani tekstovi</a>{relatedService ? <Link href={`/usluge/${relatedService.slug}/`}>{relatedService.shortTitle}</Link> : <Link href="/usluge/">Povezane usluge</Link>}<Link href="/kontakt/?izvor=blog">Primijeni na projekat</Link></nav></aside><div className="article-content" id="article-content" dangerouslySetInnerHTML={{ __html: cleanArticleBody(post.body, post.cover) }} /></div></section></article>
    <section className="section section-dark" id="povezani"><div className="container"><SectionHeading eyebrow="Nastavi čitanje" title="Povezani vodiči" /><div className="blog-grid">{related.map((item) => <article className="blog-card" key={item.slug}><Image src={item.cover} width={1280} height={720} loading="lazy" sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw" alt={item.coverAlt} /><div className="blog-card-copy"><span>{categoryLabels[item.category] || item.category}</span><h2>{item.title}</h2><p>{item.excerpt}</p><Link href={`/blog/${item.slug}/`}>Pročitaj ↗</Link></div></article>)}</div></div></section>
    <FinalCta title="Pretvori ideju iz teksta u konkretan plan." text="Pošalji trenutni setup, cilj i rok. Izdvojićemo prioritetne korake, zavisnosti i informacije koje još nedostaju." />
  </>
}
