import type { Metadata } from 'next'
import Link from 'next/link'
import { cases } from '@/data/cases'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { CaseCard } from '@/components/cards'
import { SectionHeading } from '@/components/section-heading'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { OfferAreas, OfferChooser } from '@/components/sales-offer'
import { createMetadata } from '@/lib/metadata'
import { itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Digitalni marketing, web, eventi i promo timovi u Crnoj Gori'
const seoDescription = 'Sindikat Studio 83 je studio iz Podgorice za digitalni marketing, web i digitalne proizvode, aktivacije, događaje, sadržaj i promo timove širom Crne Gore.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/',
})

export default function HomePage() {
  return (
    <div className="sales-home">
      <JsonLd data={[
        webPageSchema({ name: seoTitle, description: seoDescription, path: '/', image: '/images/brand/og-cover.png' }),
        itemListSchema({
          name: 'Usluge Sindikat Studio 83',
          path: '/',
          items: services.map((service) => ({ name: service.shortTitle, href: `/usluge/${service.slug}/` })),
        }),
      ]} />

      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Studio za rast i realizaciju</span>
          <h1><span>Digital, kampanje,</span><span>ljudi i realizacija.</span><span className="outline">Jedan tim.</span></h1>
          <p className="lead">Od digitalnog marketinga i web proizvoda do promo timova, aktivacija i događaja u Crnoj Gori - povezujemo djelove koji moraju da rade zajedno i vodimo ih kroz jednu odgovornu tačku.</p>
          <div className="button-row hero-actions"><Link className="button button-primary" href="#izaberi-rjesenje" data-track="hero_solution">Pogledaj ponudu</Link><Link className="button button-ghost" href="/radovi/" data-track="hero_cases">Pogledaj radove</Link></div>
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

      <OfferChooser />

      <FinalCta title="Imate cilj. Mi ćemo složiti konkretan proizvod i obim." text="Ne morate unaprijed znati sve detalje. Pošaljite cilj, rok i okvirni budžet - vratićemo se sa jasnim sljedećim korakom i cijenom prema izabranom proizvodu." label="Pošalji brief" />
    </div>
  )
}
