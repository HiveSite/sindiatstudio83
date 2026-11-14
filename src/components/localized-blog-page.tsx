import { Breadcrumbs } from '@/components/breadcrumbs'
import { BlogExplorer } from '@/components/blog-explorer'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'


import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { enBlogFullPosts } from '@/data/localized-blog'
const seoTitle = 'Marketing, web i event vodiči za Crnu Goru'
const seoDescription = 'Praktični vodiči Sindikat Studio 83 o digitalnom marketingu, Meta i Google kampanjama, webu, SEO-u, aktivacijama, događajima i sadržaju u Crnoj Gori.'

export function BlogPageContent({locale='sr'}:{locale?:SiteLocale}) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(v:string)=>localeHref(locale,v)
  const articles=en?enBlogFullPosts:blogPosts
  const crumbs = [{ label: t('Resursi','Resources'), href: href('/blog/') }]
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: t(seoTitle,'Digital marketing, web and events guides for Montenegro'), description: t(seoDescription,'Practical guides to advertising, websites, SEO, activations, events and content in Montenegro.'), path: href('/blog/'), type: 'CollectionPage' }),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${site.domain}${href('/blog/')}#blog`,
        name: t('Resursi Sindikat Studio 83','Sindikat Studio 83 resources'),
        description: t(seoDescription,'Guides to marketing, websites, events and content in Montenegro.'),
        url: `${site.domain}${href('/blog/')}`,
        inLanguage: en ? 'en' : site.locale,
        publisher: { '@id': `${site.domain}/#organization` },
      },
      itemListSchema({
        name: t('Marketing i web vodiči','Marketing and web guides'),
        path: href('/blog/'),
        items: articles.map((post) => ({ name: post.title, href: href(`/blog/${post.slug}/`) })),
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Resursi","Resources")}</span><h1>{t("Praktični vodiči za timove koji moraju donijeti stvarnu odluku.","Practical guides for teams making real decisions.")}</h1><p className="lead">{t("Tekstovi razdvajaju problem, proces, trošak, rizik i mjerenje. Cilj nije da svaka tema završi prodajom usluge, već da lakše procijeniš šta treba raditi, kojim redom i šta može čekati.","Our articles separate the challenge, process, cost, risks and measurement. The aim is not to sell a service at the end of every article, but to help you decide what to do, in what order and what can wait.")}</p></div><aside className="page-hero-aside"><strong>{t("Glavne teme","Main topics")}</strong><ul><li>{t("Meta, Google i mjerenje kampanja","Meta, Google and campaign tracking")}</li><li>{t("landing stranice, SEO i konverzije","landing pages, SEO and conversions")}</li><li>{t("aktivacije, promo timovi i događaji","activations, promotional teams and events")}</li><li>{t("sadržaj, produkcija i zapošljavanje","content, production and recruitment")}</li></ul></aside></div></div></section>
    <section className="section"><div className="container"><BlogExplorer initialPosts={articles} locale={locale} /></div></section>
    <FinalCta locale={locale} title={t('Treba ti primjena na stvarnu situaciju?','Need to apply this to a real situation?')} text={t('Pošalji informacije o trenutnoj situaciji, cilj i rok. Izdvojićemo prioritetne korake, informacije koje nedostaju i dio koji još nije spreman za ulaganje.','Send us the current situation, your objective and timeline. We will identify priorities, missing information and what is not yet ready for investment.')} />
  </>
}
