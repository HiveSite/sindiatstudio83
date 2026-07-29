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
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 3)
  const relatedCases = cases.filter((item) => item.serviceSlugs.includes(service.slug)).slice(0, 3)
  const schemas = [breadcrumbSchema(crumbs), {
    '@context': 'https://schema.org', '@type': 'Service', name: service.shortTitle, description: service.summary,
    provider: { '@id': `${site.domain}/#organization` }, areaServed: { '@type': 'Country', name: 'Montenegro' }, url: `${site.domain}/usluge/${service.slug}/`,
  }]

  return <>
    <JsonLd data={schemas} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">{service.eyebrow}</span><h1>{service.title}</h1><p className="lead">{service.summary}</p><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-primary" href={`/kontakt/?usluga=${service.slug}`} data-track="service_lead">Pošalji brief za ovu uslugu</Link><a className="button button-ghost" href="#sta-dobijas">Pogledaj obim</a></div></div><aside className="page-hero-aside"><strong>Tipični ishodi</strong><ul>{service.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></aside></div><div className="outcome-band">{service.outcomes.map((item) => <div key={item}>{item}</div>)}</div></div></section>

    <section className="section"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">Kada ima smisla</span><h2>Situacije u kojima ova usluga može napraviti stvarnu razliku.</h2><ul>{service.bestFor.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">Šta nam treba od tebe</span><h2>Ulazne informacije koje čuvaju rok i kvalitet.</h2><ul>{service.clientInputs.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>

    <section className="section section-light" id="sta-dobijas"><div className="container"><SectionHeading eyebrow="Obim usluge" title="Šta konkretno može biti dio isporuke." text="Konačni obim zaključavamo nakon briefa. Ne uključujemo svaki blok automatski, već samo ono što podržava cilj i što možemo odgovorno isporučiti." /><div className="deliverable-grid">{service.includes.map((item, index) => <article className="deliverable" key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3></article>)}</div></div></section>

    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Proces</span><h2>Uredan tok od prve procjene do predaje i naredne odluke.</h2><p className="lead">Svaka faza ima ulazne informacije, vlasnika, rok i kriterijum da je završena. Tako se projekat ne pretvara u otvorenu listu zadataka.</p></div><div className="step-list">{service.process.map(([title, text], index) => <div className="step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

    <section className="section"><div className="container"><SectionHeading eyebrow="Kako izgleda uspjeh" title="Signali da je sistem postavljen kako treba." text="Rezultat se ne svodi uvijek na jednu brojku. Pratimo i tehničku pouzdanost, kvalitet procesa, brzinu odgovora i mogućnost da se ono što radi ponovi." /><div className="case-scope-grid">{service.successSignals.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></article>)}</div></div></section>

    <section className="section"><div className="container engagement-panel"><div><span className="eyebrow">Modeli saradnje</span><h2>Ista disciplina, različit nivo odgovornosti.</h2><p>Rok, broj kanala, produkcija, ljudi, lokacije i integracije definišu konačnu ponudu. Svaka stavka je jasno odvojena prije početka.</p></div><div className="engagement-list">{service.engagements.map((item) => <div className="engagement-card" key={item.name}><h3>{item.name}</h3><p>{item.text}</p><span>Obim se zaključava nakon briefa</span></div>)}</div></div></section>

    {relatedCases.length ? <section className="section section-light"><div className="container"><SectionHeading eyebrow="Dokaz u praksi" title="Projekti u kojima je ova usluga imala konkretnu ulogu." text="Ista disciplina izgleda drugačije kada je dio platforme, terenske operacije, community programa ili događaja. Zato je prikazujemo kroz projekte, ne kroz generička obećanja." /><div className="case-preview-grid">{relatedCases.map((item) => <CasePreviewCard key={item.slug} item={item} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-dark" href="/radovi/#projekti">Pogledaj sve projekte</Link></div></div></section> : null}

    <section className="section"><div className="container faq-layout"><div><span className="eyebrow">Pitanja</span><h2>Najčešće prije početka.</h2><p>Za preciznu procjenu pošalji cilj, rok, tržište, lokacije i ono što već postoji. Ne moraš unaprijed znati tehničko rješenje.</p></div><FaqList items={service.faq} /></div></section>

    <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Povezane usluge" title="Kada jedan blok nije dovoljan da rezultat stvarno radi." text="Povezane usluge nijesu automatski dodatak. Uključujemo ih samo kada postoji jasna zavisnost između ponude, kanala, sadržaja, proizvoda ili realizacije." /><div className="related-grid">{relatedServices.map((item) => <article className="related-card" key={item.slug}><h3>{item.shortTitle}</h3><p>{item.summary}</p><Link href={`/usluge/${item.slug}/`}>Pogledaj detalje ↗</Link></article>)}</div></div></section>
    <FinalCta title={`Da li je ${service.shortTitle.toLowerCase()} pravi prvi korak?`} text="Pošalji trenutnu situaciju, rok i ono što već postoji. Dobićeš preporučenu prvu fazu, ključne zavisnosti i pitanja koja moramo zatvoriti prije ponude." />
  </>
}
