import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FaqList } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { serviceBySlug, services } from '@/data/services'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug[slug]
  if (!service) return {}
  return createMetadata({ title: `${service.shortTitle} u Crnoj Gori`, description: service.summary, path: `/usluge/${service.slug}/` })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceBySlug[slug]
  if (!service) notFound()
  const crumbs = [{ label: 'Usluge', href: '/usluge/' }, { label: service.shortTitle, href: `/usluge/${service.slug}/` }]
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3)
  const schemas = [breadcrumbSchema(crumbs), {
    '@context': 'https://schema.org', '@type': 'Service', name: service.shortTitle, description: service.summary,
    provider: { '@id': `${site.domain}/#organization` }, areaServed: { '@type': 'Country', name: 'Montenegro' }, url: `${site.domain}/usluge/${service.slug}/`,
  }]
  return <>
    <JsonLd data={schemas} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">{service.eyebrow}</span><h1>{service.title}</h1><p className="lead">{service.summary}</p><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-primary" href={`/kontakt/?usluga=${service.slug}`} data-track="service_lead">Zatraži plan</Link><a className="button button-ghost" href="#sta-dobijas">Šta dobijaš</a></div></div><aside className="page-hero-aside"><strong>Tipični ishodi</strong><ul>{service.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></aside></div><div className="outcome-band">{service.outcomes.map((item) => <div key={item}>{item}</div>)}</div></div></section>
    <section className="section" id="sta-dobijas"><div className="container"><SectionHeading eyebrow="Obim usluge" title="Šta konkretno dobijaš." text="Konačni obim se zaključava u ponudi. Ovo su standardni blokovi koje kombinujemo prema cilju." /><div className="deliverable-grid">{service.includes.map((item, index) => <article className="deliverable" key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3></article>)}</div></div></section>
    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Proces</span><h2>Uredan tok od dijagnostike do sljedećeg poteza.</h2><p className="lead">Svaki projekat ima vlasnika, rokove, ulazne materijale i definisanu tačku odobrenja.</p></div><div className="step-list">{service.process.map(([title,text], index) => <div className="step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <section className="section"><div className="container pricing-panel"><div><span className="eyebrow">Orijentacioni okvir</span><h2>Cijena zavisi od obima, ne od magle.</h2><p>Medijski budžet, produkcijski troškovi, osoblje, transport i zakup nijesu automatski uključeni u agencijsku naknadu. Sve stavke se odvajaju u ponudi.</p></div><div className="pricing-list">{service.pricing.map((item) => <div className="price-card" key={item.name}><div><h3>{item.name}</h3><p>{item.text}</p></div><strong>{item.price}</strong></div>)}</div></div></section>
    <section className="section"><div className="container faq-layout"><div><span className="eyebrow">Pitanja</span><h2>Najčešće prije početka.</h2><p>Za preciznu procjenu pošalji cilj, rok, tržište i ono što već postoji.</p></div><FaqList items={service.faq} /></div></section>
    <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Povezane usluge" title="Kada jedan blok nije dovoljan." /><div className="related-grid">{related.map((item) => <article className="related-card" key={item.slug}><h3>{item.shortTitle}</h3><p>{item.summary}</p><Link href={`/usluge/${item.slug}/`}>Detalji ↗</Link></article>)}</div></div></section>
    <FinalCta title={`Hajde da procijenimo da li je ${service.shortTitle.toLowerCase()} pravi sljedeći korak.`} text="Pošalji trenutnu situaciju, rok i budžet. Odgovor će biti konkretan okvir, ne obavezivanje na projekat." />
  </>
}
