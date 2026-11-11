import type { Metadata } from 'next'
import Link from 'next/link'
import { cases } from '@/data/cases'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { FinalCta } from '@/components/final-cta'
import { HeroShowcase } from '@/components/hero-showcase'
import { HomeServiceDirectory, HomeProjectHighlights, HomeProcessAndFaq } from '@/components/home-sales-sections'
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
          <p className="lead">Vodimo digitalni marketing, web projekte, promocije i događaje - od ideje do realizacije. Jedan tim, jasni koraci i jedna odgovorna tačka za vaš projekat.</p>
          <div className="button-row hero-actions"><Link className="button button-primary" href="/kontakt/?izvor=hero" data-track="hero_contact">Zatraži ponudu</Link><Link className="button button-ghost" href="#izaberi-rjesenje" data-track="hero_solution">Istraži usluge</Link></div>
          <div className="hero-note"><span><i /> Podgorica i cijela Crna Gora</span><span><i /> Jedan vlasnik projekta, manje koordinacije za klijenta</span></div>
        </div>
        <div className="hero-visual"><HeroShowcase /></div>
      </div></section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Operativa koja postoji i van prezentacije.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <OfferAreas />

      <HomeServiceDirectory />

      <HomeProjectHighlights />

      <OfferChooser />

      <HomeProcessAndFaq />

      <FinalCta title="Imate cilj. Mi ćemo složiti konkretan proizvod i obim." text="Ne morate unaprijed znati sve detalje. Pošaljite cilj, rok i okvirni budžet - vratićemo se sa jasnim sljedećim korakom i cijenom prema izabranom proizvodu." label="Pošalji brief" />
    </div>
  )
}
