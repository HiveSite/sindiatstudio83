import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CasePreviewCard, FaqList } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { cases } from '@/data/cases'
import { serviceBySlug, services } from '@/data/services'
import { serviceProducts } from '@/data/service-products'
import { enProducts } from '@/data/en-products'
import { localizedService } from '@/lib/localized-data'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, itemListSchema, serviceSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })) }

const serviceSeo: Record<string, { title: string; description: string }> = {
  'performance-marketing': {
    title: 'Meta Ads i Google Ads kampanje u Crnoj Gori',
    description: 'Meta i Google Ads kampanje, postavka mjerenja, optimizacija i analiza upita. Sindikat Studio 83 - digitalni marketing iz Podgorice.',
  },
  'web-i-konverzije': {
    title: 'Izrada web sajtova i landing stranica u Podgorici',
    description: 'Izrada brzih sajtova, landing stranica i digitalnih proizvoda u Crnoj Gori. UX, mobilni dizajn, SEO osnova, analitika i integracije.',
  },
  'aktivacije-i-eventi': {
    title: 'Organizacija događaja i promo aktivacija u Crnoj Gori',
    description: 'Organizacija događaja, promocija, promo timova i aktivacija na terenu. Koncept, logistika, koordinacija i izvještavanje širom Crne Gore.',
  },
  'sadrzaj-za-kampanje': {
    title: 'Kreiranje sadržaja i video produkcija u Crnoj Gori',
    description: 'Foto i video produkcija, Reels, kreativni koncepti i sadržaj za Instagram, Facebook i digitalne kampanje. Sindikat Studio 83 Podgorica.',
  },
  'recruitment-kampanje': {
    title: 'Kampanje za zapošljavanje i employer branding',
    description: 'Kampanje za zapošljavanje u Crnoj Gori. Oglasi, prijavni tokovi, sadržaj za poslodavce, distribucija i optimizacija prijava.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug[slug]
  if (!service) return {}
  const seo = serviceSeo[slug]
  return createMetadata({
    title: seo?.title || `${service.shortTitle} u Crnoj Gori - usluge i cijene`,
    description: seo?.description || service.summary,
    path: `/usluge/${service.slug}/`,
  })
}

export function ServicePageContent({ slug, locale='sr' }: { slug: string; locale?: SiteLocale }) {
  const english=locale==='en'
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const href=(value:string)=>localeHref(locale,value)
  const service = localizedService(slug,locale)
  if (!service) notFound()

  const products = (english ? enProducts : serviceProducts)[service.slug] || []
  const path = href(`/usluge/${service.slug}/`)
  const crumbs = [{ label: t('Usluge','Services'), href: href('/usluge/') }, { label: service.shortTitle, href: path }]
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 4).map(item=>localizedService(item.slug,locale)!).filter(Boolean)
  const relatedCases = cases.filter((item) => item.serviceSlugs.includes(service.slug)).slice(0, 2)
  const schemas = [
    breadcrumbSchema(crumbs),
    webPageSchema({
      name: english ? `${service.shortTitle} in Montenegro` : `${service.shortTitle} u Crnoj Gori`,
      description: service.summary,
      path,
      about: [{ name: service.shortTitle, url: path }],
    }),
    serviceSchema({
      name: service.shortTitle,
      description: service.summary,
      path,
      serviceType: service.shortTitle,
    }),
    itemListSchema({
      name: `${t('Proizvodi','Products')} - ${service.shortTitle}`,
      path,
      items: products.map((product) => ({ name: product.name, href: `${path}#proizvodi` })),
    }),
  ]

  return <div className="premium-service-page">
    <JsonLd data={schemas} />

    <section className="page-hero premium-service-hero"><div className="container">
      <Breadcrumbs items={crumbs} locale={locale} />
      <div className="page-hero-grid">
        <div>
          <span className="eyebrow">{service.eyebrow}</span>
          <h1>{service.title}</h1>
          <p className="lead">{service.summary}</p>
          <div className="button-row" style={{ marginTop: 30 }}><a className="button button-primary" href="#proizvodi">{t("Pogledaj proizvode i cijene","View products and prices")}</a><Link className="button button-ghost" href={href(`/kontakt/?usluga=${service.slug}`)} data-track="service_lead">{t("Pošalji upit","Send enquiry")}</Link></div>
        </div>
        <aside className="service-price-anchor">
          <span>{t("Početni okvir","Starting price")}</span>
          <strong>{products[0]?.price || 'po ponudi'}</strong>
          <p>{t("Konačna cijena zavisi od izabranog proizvoda i stvarnog obima. Prije početka sve stavke su jasno odvojene.","The final price depends on the product and scope selected. We specify every cost before work begins.")}</p>
        </aside>
      </div>
      <div className="outcome-band">{service.outcomes.map((item) => <div key={item}>{item}</div>)}</div>
    </div></section>

    <section className="section service-audience-section" aria-label={t('Za koga je usluga i šta donosi','Who this service helps and what it delivers')}><div className="container service-audience-layout">
      <div className="service-audience-column"><span className="eyebrow">{t("Za koga je","Who it is for")}</span><h2>{t("Kada ova usluga ima smisla?","When is this service the right fit?")}</h2>
        <ul>{service.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="service-audience-column"><span className="eyebrow">{t("Šta pratimo","What we measure")}</span><h2>{t("Kako prepoznajemo napredak?","How do we measure progress?")}</h2>
        <ul>{service.successSignals.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div></section>

    <section className="section section-light" id="proizvodi"><div className="container">
      <SectionHeading eyebrow={t("Proizvodi i cijene","Products and prices")} title={t("Izaberite konkretan obim, ne apstraktan paket.","Choose a specific scope, not a vague package.")} text={t("Svaki proizvod ima jasan početni okvir i definisanu namjenu. Ako projekat prelazi standardni obim, cijenu formiramo nakon kratkog briefa.","Each product has a defined purpose and starting price. We quote custom work following a short brief.")} />
      <div className="product-pricing-grid">
        {products.map((product) => <article className={`product-price-card${product.featured ? ' is-featured' : ''}`} key={product.name}>
          <div className="product-price-top"><span>{product.featured ? 'Najčešći izbor' : 'Proizvod'}</span><h2>{product.name}</h2><strong>{product.price}</strong><p>{product.description}</p></div>
          <ul>{product.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          <Link className={`button ${product.featured ? 'button-primary' : 'button-dark'}`} href={href(`/kontakt/?usluga=${service.slug}&proizvod=${encodeURIComponent(product.name)}`)}>{t("Zatraži ovaj proizvod","Request this product")}</Link>
        </article>)}
      </div>
    </div></section>

    <section className="section"><div className="container">
      <SectionHeading eyebrow={t("Šta može biti dio isporuke","What delivery can include")} title={t("Sve što je potrebno da proizvod stvarno radi.","Everything required to make it work.")} text={t("Ne ubacujemo stavke samo da ponuda izgleda veća. Konačni scope uključuje samo ono što direktno podržava cilj i dogovorenu isporuku.","We include only what supports your goal and the agreed deliverable, not extras to make a proposal look larger.")} />
      <div className="deliverable-grid premium-deliverables">{service.includes.map((item, index) => <article className="deliverable" key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3></article>)}</div>
    </div></section>

    <section className="section service-input-section"><div className="container">
      <div className="service-input-panel">
        <div><span className="eyebrow">{t("Brži početak","Start faster")}</span><h2>{t("Šta nam treba od vas?","What we need from you")}</h2><p>{t("Nije potrebno da imate gotov brief. Ovo su informacije koje pomažu da brzo i realno procijenimo obim.","You do not need a finished brief. These details help us estimate the scope quickly and realistically.")}</p></div>
        <ul>{service.clientInputs.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div></section>

    <section className="section section-dark"><div className="container split-sticky">
      <div className="sticky-copy"><span className="eyebrow">{t("Proces","Process")}</span><h2>{t("Jednostavan tok od briefa do predaje.","A clear process from brief to delivery.")}</h2><p className="lead">{t("Bez velikog konsultantskog procesa. Zaključamo cilj, obim i rok, zatim proizvod ide u realizaciju kroz jasne tačke odobrenja.","We agree the goal, scope and deadline without lengthy consulting stages, then proceed through clear approval points.")}</p></div>
      <div className="step-list">{service.process.map(([title, text], index) => <div className="step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </div></section>

    {relatedCases.length ? <section className="section section-light"><div className="container">
      <SectionHeading eyebrow={t("Dokaz u praksi","Evidence in practice")} title={t("Pogledaj kako smo ovu uslugu koristili na stvarnim projektima.","See how this service has worked in real projects.")} text={t("Case study je važniji od dodatnog obećanja. Prikazujemo kontekst, našu ulogu i konkretan obim.","Practical case studies demonstrate the context, our role and the scope better than additional promises.")} />
      <div className="case-preview-grid">{relatedCases.map((item) => <CasePreviewCard key={item.slug} item={item} />)}</div>
    </div></section> : null}

    <section className="section"><div className="container faq-layout"><div><span className="eyebrow">{t("Pitanja","Questions")}</span><h2>{t("Najčešće prije kupovine.","Common questions before starting.")}</h2><p>{t("Ne treba nam duga dokumentacija da bismo razumjeli tvoj cilj. Dovoljni su rok, okvir, ono što već postoji i nekoliko ključnih informacija.","A long specification is not needed. A timeline, approximate budget, existing materials and a few key details are enough.")}</p></div><FaqList items={service.faq} /></div></section>

    <section className="section section-dark"><div className="container">
      <div className="service-rail-head"><div><span className="eyebrow">{t("Ostale usluge","Other services")}</span><h2>{t("Pogledaj i druge usluge.","Explore related services.")}</h2></div><Link className="text-link" href={href("/usluge/")}>Sve usluge <span>↗</span></Link></div>
      <div className="service-rail" role="region" aria-label={t('Povezane usluge','Related services')} tabIndex={0}>{relatedServices.map((item) => <Link className="service-rail-card" key={item.slug} href={href(`/usluge/${item.slug}/`)}><span>{item.eyebrow}</span><h3>{item.shortTitle}</h3><p>{item.summary}</p><b>{t("Pogledaj uslugu ↗","View service ↗")}</b></Link>)}</div>
    </div></section>

    <FinalCta locale={locale} title={english ? 'Interested in '+service.shortTitle.toLowerCase()+'?' : 'Treba vam '+service.shortTitle.toLowerCase()+'?'} text={t('Izaberite proizvod iznad ili pošaljite brief ako obim nije standardan. Vratićemo se sa konkretnom preporukom i jasnim cjenovnim okvirom.','Select a service above or send a brief for a custom scope. We will respond with a practical recommendation and a clear price range.')} label={t('Pošalji upit','Send enquiry')} />
  </div>
}

export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <ServicePageContent slug={slug} locale="sr" />}
