import type { Metadata } from 'next'
import Link from 'next/link'
import { cases } from '@/data/cases'
import { site } from '@/data/site'
import { CaseCard } from '@/components/cards'
import { SectionHeading } from '@/components/section-heading'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { EngagementModels, OfferAreas, OfferChooser } from '@/components/sales-offer'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Sindikat Studio 83 - digital, kampanje, ljudi i realizacija',
  description: 'Studio iz Podgorice koji povezuje digitalne proizvode, kampanje, promo timove, aktivacije i događaje kroz jednu odgovornu realizaciju.',
  path: '/',
})

export default function HomePage() {
  return (
    <div className="sales-home">
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': `${site.domain}/#service`, name: site.name, url: site.domain,
        image: `${site.domain}/images/brand/og-cover.png`, areaServed: { '@type': 'Country', name: 'Montenegro' },
        address: { '@type': 'PostalAddress', addressLocality: 'Podgorica', addressCountry: 'ME' }, parentOrganization: { '@id': `${site.domain}/#organization` },
      }} />

      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Studio za rast i realizaciju</span>
          <h1><span>Digital, kampanje,</span><span>ljudi i realizacija.</span><span className="outline">Jedan tim.</span></h1>
          <p className="lead">Od prvog klika do posljednjeg detalja na terenu - preuzimamo djelove koji moraju da rade zajedno i vodimo ih kroz jednu odgovornu tačku.</p>
          <div className="button-row hero-actions"><Link className="button button-primary" href="#izaberi-rjesenje" data-track="hero_solution">Pronađi rješenje</Link><Link className="button button-ghost" href="/radovi/" data-track="hero_cases">Pogledaj radove</Link></div>
          <div className="hero-note"><span><i /> Podgorica i cijela Crna Gora</span><span><i /> Jedan vlasnik projekta, manje koordinacije za klijenta</span></div>
        </div>
        <div className="hero-visual" aria-label="Sistem koji povezuje digital, ljude i realizaciju"><div className="hero-system"><div className="hero-orbit-stage"><div className="hero-glow" /><div className="hero-ring" /><div className="hero-ring" /><div className="hero-core"><strong>jedna tačka<br />odgovornosti</strong></div></div><div className="hero-node-grid"><div className="hero-node hero-node-1"><strong>Digital</strong><span>Kampanje, web i mjerenje</span></div><div className="hero-node hero-node-2"><strong>Ljudi</strong><span>Timovi, raspored i logistika</span></div><div className="hero-node hero-node-3"><strong>Teren</strong><span>Aktivacije, eventi i sadržaj</span></div></div></div></div>
      </div></section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Operativa koja postoji i van prezentacije.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <OfferAreas />

      <section className="section section-dark"><div className="container">
        <SectionHeading eyebrow="Radovi" title="Pogledajte kako izgleda kada više djelova rade kao jedan sistem." text="Ne prikazujemo samo finalni vizual. Case studies pokazuju problem, našu ulogu, obim i rezultat koji je projekat omogućio." />
        <div className="case-grid case-grid-home-scroll" role="region" aria-label="Istaknuti projekti" tabIndex={0}>{cases.slice(0, 3).map((item) => <CaseCard key={item.slug} item={item} />)}</div>
        <div className="button-row" style={{ marginTop: 28 }}><Link className="button button-ghost" href="/radovi/">Pogledaj sve projekte</Link></div>
      </div></section>

      <EngagementModels />
      <OfferChooser />

      <FinalCta title="Imate cilj. Mi ćemo složiti sistem koji ga može izvesti." text="Ne morate unaprijed znati koja vam usluga treba. Pošaljite cilj, rok i okvirni budžet - vratićemo se sa konkretnim sljedećim korakom." label="Pošalji brief" />
    </div>
  )
}
