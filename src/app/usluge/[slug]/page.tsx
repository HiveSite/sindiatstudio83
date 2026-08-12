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
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, itemListSchema, serviceSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug[slug]
  if (!service) return {}
  return createMetadata({
    title: `${service.shortTitle} u Crnoj Gori - usluge i cijene`,
    description: service.summary,
    path: `/usluge/${service.slug}/`,
  })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceBySlug[slug]
  if (!service) notFound()

  const products = serviceProducts[service.slug] || []
  const path = `/usluge/${service.slug}/`
  const crumbs = [{ label: 'Usluge', href: '/usluge/' }, { label: service.shortTitle, href: path }]
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 4)
  const relatedCases = cases.filter((item) => item.serviceSlugs.includes(service.slug)).slice(0, 2)
  const schemas = [
    breadcrumbSchema(crumbs),
    webPageSchema({
      name: `${service.shortTitle} u Crnoj Gori`,
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
      name: `Proizvodi - ${service.shortTitle}`,
      path,
      items: products.map((product) => ({ name: product.name, href: `${path}#proizvodi` })),
    }),
  ]

  return <div className="premium-service-page">
    <JsonLd data={schemas} />

    <section className="page-hero premium-service-hero"><div className="container">
      <Breadcrumbs items={crumbs} />
      <div className="page-hero-grid">
        <div>
          <span className="eyebrow">{service.eyebrow}</span>
          <h1>{service.title}</h1>
          <p className="lead">{service.summary}</p>
          <div className="button-row" style={{ marginTop: 30 }}><a className="button button-primary" href="#proizvodi">Pogledaj proizvode i cijene</a><Link className="button button-ghost" href={`/kontakt/?usluga=${service.slug}`} data-track="service_lead">Pošalji brief</Link></div>
        </div>
        <aside className="service-price-anchor">
          <span>Početni okvir</span>
          <strong>{products[0]?.price || 'po ponudi'}</strong>
          <p>Konačna cijena zavisi od izabranog proizvoda i stvarnog obima. Prije početka sve stavke su jasno odvojene.</p>
        </aside>
      </div>
      <div className="outcome-band">{service.outcomes.map((item) => <div key={item}>{item}</div>)}</div>
    </div></section>

    <section className="section section-light" id="proizvodi"><div className="container">
      <SectionHeading eyebrow="Proizvodi i cijene" title="Izaberite konkretan obim, ne apstraktan paket." text="Svaki proizvod ima jasan početni okvir i definisanu namjenu. Ako projekat prelazi standardni obim, cijenu formiramo nakon kratkog briefa." />
      <div className="product-pricing-grid">
        {products.map((product) => <article className={`product-price-card${product.featured ? ' is-featured' : ''}`} key={product.name}>
          <div className="product-price-top"><span>{product.featured ? 'Najčešći izbor' : 'Proizvod'}</span><h2>{product.name}</h2><strong>{product.price}</strong><p>{product.description}</p></div>
          <ul>{product.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          <Link className={`button ${product.featured ? 'button-primary' : 'button-dark'}`} href={`/kontakt/?usluga=${service.slug}&proizvod=${encodeURIComponent(product.name)}`}>Zatraži ovaj proizvod</Link>
        </article>)}
      </div>
    </div></section>

    <section className="section"><div className="container">
      <SectionHeading eyebrow="Šta može biti dio isporuke" title="Sve što je potrebno da proizvod stvarno radi." text="Ne ubacujemo stavke samo da ponuda izgleda veća. Konačni scope uključuje samo ono što direktno podržava cilj i dogovorenu isporuku." />
      <div className="deliverable-grid premium-deliverables">{service.includes.map((item, index) => <article className="deliverable" key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3></article>)}</div>
    </div></section>

    <section className="section section-dark"><div className="container split-sticky">
      <div className="sticky-copy"><span className="eyebrow">Proces</span><h2>Jednostavan tok od briefa do predaje.</h2><p className="lead">Bez velikog konsultantskog procesa. Zaključamo cilj, obim i rok, zatim proizvod ide u realizaciju kroz jasne tačke odobrenja.</p></div>
      <div className="step-list">{service.process.map(([title, text], index) => <div className="step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </div></section>

    {relatedCases.length ? <section className="section section-light"><div className="container">
      <SectionHeading eyebrow="Dokaz u praksi" title="Pogledajte gdje je ova usluga već bila dio stvarnog projekta." text="Case study je važniji od dodatnog obećanja. Prikazujemo kontekst, našu ulogu i konkretan obim." />
      <div className="case-preview-grid">{relatedCases.map((item) => <CasePreviewCard key={item.slug} item={item} />)}</div>
    </div></section> : null}

    <section className="section"><div className="container faq-layout"><div><span className="eyebrow">Pitanja</span><h2>Najčešće prije kupovine.</h2><p>Ako je cilj jasan, ne treba nam duga dokumentacija. Dovoljni su rok, okvir, ono što već postoji i nekoliko ključnih informacija.</p></div><FaqList items={service.faq} /></div></section>

    <section className="section section-dark"><div className="container">
      <div className="service-rail-head"><div><span className="eyebrow">Ostale usluge</span><h2>Nastavite kroz ponudu.</h2></div><Link className="text-link" href="/usluge/">Sve usluge <span>↗</span></Link></div>
      <div className="service-rail" role="region" aria-label="Povezane usluge" tabIndex={0}>{relatedServices.map((item) => <Link className="service-rail-card" key={item.slug} href={`/usluge/${item.slug}/`}><span>{item.eyebrow}</span><h3>{item.shortTitle}</h3><p>{item.summary}</p><b>Pogledaj uslugu ↗</b></Link>)}</div>
    </div></section>

    <FinalCta title={`Treba vam ${service.shortTitle.toLowerCase()}?`} text="Izaberite proizvod iznad ili pošaljite brief ako obim nije standardan. Vratićemo se sa konkretnom preporukom i jasnim cjenovnim okvirom." label="Pošalji brief" />
  </div>
}
