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

const seoTitle = 'Marketing agencija Podgorica - kampanje, web i događaji'
const seoDescription = 'Sindikat Studio 83 iz Podgorice kreira sadržaj, vodi digitalne kampanje, pravi sajtove i organizuje događaje i promocije širom Crne Gore.'

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
            <p className="lead">Vodimo kampanje, snimamo sadržaj, pravimo sajtove i organizujemo događaje. Od prve ideje do posljednjeg detalja - sve drži jedan tim.</p>
            <div className="button-row demo-hero-actions">
              <Link className="button button-primary" href="/kontakt/?izvor=hero" data-track="hero_contact">Hajde da radimo ↗</Link>
              <Link className="button button-ghost" href="/radovi/" data-track="hero_work">Pogledaj naše radove ↗</Link>
            </div>
            <div className="demo-hero-subline">Podgorica · cijela Crna Gora / Jedan tim, više disciplina.</div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Ne ostajemo na lijepoj prezentaciji.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <HomeQuickChoices />

      <HomeServiceDirectory />

      <HomeProjectHighlights />

      <OfferChooser />

      <HomeProcessAndFaq />

      <HomeIndustriesPreview />

      <FinalCta title="Imaš ideju ili problem koji treba riješiti?" text="Napiši nam šta želiš da postigneš i kada ti treba. Predložićemo konkretnu uslugu, obim posla i sljedeći korak." label="Pošalji brief" />
    </div>
  )
}
