import type { Metadata } from 'next'
import Link from 'next/link'
import { cases } from '@/data/cases'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { FinalCta } from '@/components/final-cta'
import { HeroShowcase } from '@/components/hero-showcase'
import { HomeServiceDirectory, HomeProjectHighlights, HomeProcessAndFaq } from '@/components/home-sales-sections'
import { JsonLd } from '@/components/json-ld'
import { OfferChooser } from '@/components/sales-offer'
import { HomeQuickChoices, HomeIndustriesPreview } from '@/components/demo-home-choices'
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

      <section className="demo-hero" aria-label="Sindikat Studio 83 - kreativni i produkcijski studio">
        <div className="demo-hero-photo"><HeroShowcase /></div>
        <div className="container demo-hero-content">
          <div className="demo-hero-copy">
            <span className="eyebrow">Nezavisni kreativni i produkcijski studio / Podgorica</span>
            <h1><span>IDEJE.</span><span>LJUDI.</span><span className="demo-hero-accent">REALIZACIJA.</span></h1>
            <p className="lead">Od sadržaja i kampanja do web proizvoda, događaja i aktivacija. Sindikat spaja kreativni rad i operativu u jedan konkretan rezultat.</p>
            <div className="button-row demo-hero-actions">
              <Link className="button button-primary" href="/kontakt/?izvor=hero" data-track="hero_contact">Hajde da radimo ↗</Link>
              <Link className="button button-ghost" href="/radovi/" data-track="hero_work">Pogledaj naše radove ↗</Link>
            </div>
            <div className="demo-hero-subline">Podgorica · cijela Crna Gora / Jedan tim, više disciplina.</div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Operativa koja postoji i van prezentacije.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <HomeQuickChoices />

      <HomeServiceDirectory />

      <HomeProjectHighlights />

      <OfferChooser />

      <HomeProcessAndFaq />

      <HomeIndustriesPreview />

      <FinalCta title="Imate cilj. Mi ćemo složiti konkretan proizvod i obim." text="Ne morate unaprijed znati sve detalje. Pošaljite cilj, rok i okvirni budžet - vratićemo se sa jasnim sljedećim korakom i cijenom prema izabranom proizvodu." label="Pošalji brief" />
    </div>
  )
}
