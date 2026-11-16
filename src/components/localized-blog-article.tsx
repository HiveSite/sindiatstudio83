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
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'


import { enBlogFullBySlug,enBlogFullPosts } from '@/data/localized-blog'
import { localizedService } from '@/lib/localized-data'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
const serviceSlugByCategory: Record<string, string> = {
  performance: 'performance-marketing',
  seo: 'web-i-konverzije',
  web: 'web-i-konverzije',
  kreative: 'sadrzaj-za-kampanje',
  dogadjaji: 'aktivacije-i-eventi',
  aktivacije: 'aktivacije-i-eventi',
}

export function ArticlePageContent({slug,locale='sr'}:{slug:string;locale?:SiteLocale}){
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(v:string)=>localeHref(locale,v)
  const post=en?enBlogFullBySlug[slug]:blogPostBySlug[slug]
  if(!post)notFound()
  const availablePosts=en?enBlogFullPosts:blogPosts
  const related = availablePosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score: (item.category === post.category ? 5 : 0) + item.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item)

  const relatedService = localizedService(serviceSlugByCategory[post.category] || '',locale)
  const plainText = plainTextFromHtml(post.body)
  const path = href(`/blog/${post.slug}/`)
  const crumbs = [{ label: t('Resursi','Resources'), href: href('/blog/') }, { label: post.title, href: path }]
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
        about: relatedService ? [{ name: relatedService.shortTitle, url: href(`/usluge/${relatedService.slug}/`) }] : undefined,
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
        isPartOf: { '@id': `${site.domain}${href('/blog/')}#blog` },
        url: articleUrl,
        inLanguage: en ? 'en' : site.locale,
        datePublished: publishedDate,
        dateModified: publishedDate,
        keywords: post.tags.join(', '),
        articleSection: en ? ({strategija:'Strategy',performance:'Advertising',kreative:'Creative',dogadjaji:'Events',aktivacije:'Activations',seo:'SEO',web:'Websites'} as Record<string,string>)[post.category] || post.category : categoryLabels[post.category] || post.category,
        wordCount: plainText.split(/\s+/).filter(Boolean).length,
      },
    ]} />
    <article><header className="article-hero"><div className="container article-hero-inner"><Breadcrumbs items={crumbs} locale={locale} /><span className="eyebrow">{en ? ({strategija:'Strategy',performance:'Advertising',kreative:'Creative',dogadjaji:'Events',aktivacije:'Activations',seo:'SEO',web:'Websites'} as Record<string,string>)[post.category] || post.category : categoryLabels[post.category] || post.category}</span><h1>{post.title}</h1><p className="lead">{post.excerpt}</p><div className="article-meta"><span>Sindikat Studio 83</span>{publishedDate ? <time dateTime={publishedDate}>{publishedDate}</time> : null}{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></header><figure className="article-cover article-cover-editorial"><Image src={post.cover} width={1200} height={675} priority sizes="(max-width: 900px) 100vw, 1000px" alt={post.coverAlt} /></figure><section className="section"><div className="container article-layout"><aside className="article-aside"><strong>{t("U tekstu","In this article")}</strong><nav><a href="#article-content">{t("Čitanje","Read article")}</a><a href="#povezani">{t("Povezani tekstovi","Related articles")}</a>{relatedService ? <Link href={href(`/usluge/${relatedService.slug}/`)}>{relatedService.shortTitle}</Link> : <Link href={href("/usluge/")}>{t("Povezane usluge","Related services")}</Link>}<Link href={href("/kontakt/?izvor=blog")}>{t("Primijeni na projekat","Apply to a project")}</Link></nav></aside><div className="article-content" id="article-content" dangerouslySetInnerHTML={{ __html: cleanArticleBody(post.body, post.cover) }} /></div></section></article>
    <section className="section section-light article-next-step"><div className="container"><div><span className="eyebrow">{t('Treba ti konkretna pomoć?','Need a hand?')}</span><h2>{t('Treba ti pomoć da ovo primijeniš?','Need help putting this into practice?')}</h2><p>{t('Pogledaj kako možemo pomoći tvom poslu ili nam pošalji kratak upit. Predložićemo konkretan naredni korak.','See how we can help your business or send us a short enquiry. We will suggest a practical next step.')}</p></div><div className="button-row">{relatedService ? <Link className="button button-dark" href={href(`/usluge/${relatedService.slug}/`)}>{t('Pogledaj uslugu','Explore this service')}</Link> : <Link className="button button-dark" href={href('/usluge/')}>{t('Sve usluge','All services')}</Link>}<Link className="button button-dark" href={href('/radovi/')}>{t('Pogledaj projekte','See projects')}</Link><Link className="button button-primary" href={href(`/kontakt/?izvor=blog-${post.slug}`)}>{t('Zatraži ponudu','Request a proposal')}</Link></div></div></section>
    <section className="section section-dark" id="povezani"><div className="container"><SectionHeading eyebrow={t("Nastavi čitanje","Keep reading")} title={t("Povezani vodiči","Related guides")} /><div className="blog-grid">{related.map((item) => <article className="blog-card blog-card-editorial" key={item.slug}><Link className="blog-card-media" href={href(`/blog/${item.slug}/`)}><Image src={item.cover} width={1200} height={675} loading="lazy" sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw" alt={item.coverAlt} /></Link><div className="blog-card-copy"><span>{en ? ({strategija:'Strategy',performance:'Advertising',kreative:'Creative',dogadjaji:'Events',aktivacije:'Activations',seo:'SEO',web:'Websites'} as Record<string,string>)[item.category] || item.category : categoryLabels[item.category] || item.category}</span><h2>{item.title}</h2><p>{item.excerpt}</p><Link href={href(`/blog/${item.slug}/`)}>{t("Pročitaj ↗","Read article ↗")}</Link></div></article>)}</div></div></section>
    <FinalCta locale={locale} title={t('Hajde da riješimo tvoj sljedeći marketinški zadatak.','Let’s tackle your next marketing challenge.')} text={t('Opiši šta ti treba i kada želiš da kreneš. Javićemo ti se sa predlogom saradnje.','Tell us what you need and when you would like to start. We will follow up with a proposal.')} />
  </>
}
