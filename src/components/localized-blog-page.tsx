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
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Resursi","Resources")}</span><h1>{t("Ideje i savjeti za marketing koji radi.","Ideas and advice for marketing that works.")}</h1><p className="lead">{t("Kako da privučeš više upita, bolje predstaviš ponudu, planiraš oglašavanje ili organizuješ događaj? Pronađi jasne odgovore, primjere i korake koje možeš primijeniti.","Want more enquiries, a clearer offer, better advertising or a well-planned event? Find practical answers, examples and steps you can use.")}</p></div><aside className="page-hero-aside"><strong>{t("Glavne teme","Main topics")}</strong><ul><li>{t("Meta, Google i mjerenje kampanja","Meta, Google and campaign tracking")}</li><li>{t("landing stranice, SEO i konverzije","landing pages, SEO and conversions")}</li><li>{t("aktivacije, promo timovi i događaji","activations, promotional teams and events")}</li><li>{t("sadržaj, produkcija i zapošljavanje","content, production and recruitment")}</li></ul></aside></div></div></section>
    <section className="section"><div className="container"><BlogExplorer initialPosts={articles} locale={locale} /></div></section>
    <FinalCta locale={locale} title={t('Treba ti pomoć oko marketinga?','Need help with your marketing?')} text={t('Reci nam šta želiš da postigneš. Predložićemo uslugu i plan koji odgovaraju tvom poslu.','Tell us what you want to achieve. We will suggest a service and plan that fit your business.')} />
  </>
}
