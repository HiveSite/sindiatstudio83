import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { OfferAreas, OfferChooser } from '@/components/sales-offer'
import { services } from '@/data/services'
import { serviceProducts } from '@/data/service-products'
import { breadcrumbSchema } from '@/lib/schema'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Usluge - kampanje, web, aktivacije i timovi',
  description: 'Izaberite oblast i konkretan proizvod: kampanje i rast, web i digitalni proizvodi, aktivacije i eventi ili timovi i angažmani.',
  path: '/usluge/',
})

export default function ServicesPage() {
  const crumbs = [{ label: 'Usluge', href: '/usluge/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Usluge</span><h1>Izaberite oblast. Zatim konkretan proizvod i cjenovni okvir.</h1><p className="lead">Ponuda je organizovana tako da brzo pronađete ono što vam treba - bez agencijskog žargona i bez univerzalnih paketa.</p></div><aside className="page-hero-aside"><strong>Kako da koristite ovu stranicu</strong><ul><li>izaberite kategoriju najbližu problemu</li><li>pogledajte konkretne proizvode i početne cijene</li><li>otvorite detalje proizvoda koji vam odgovara</li><li>pošaljite brief ako obim nije standardan</li></ul></aside></div></div></section>

    <OfferAreas />

    <section className="section section-dark"><div className="container">
      <div className="service-rail-head"><div><span className="eyebrow">Sve glavne usluge</span><h2>Brz pregled bez ulaska u svaku stranicu.</h2></div></div>
      <div className="service-rail services-index-rail" role="region" aria-label="Sve usluge" tabIndex={0}>
        {services.map((service) => {
          const products = serviceProducts[service.slug] || []
          return <Link className="service-rail-card" key={service.slug} href={`/usluge/${service.slug}/`}>
            <span>{service.eyebrow}</span>
            <h3>{service.shortTitle}</h3>
            <p>{service.summary}</p>
            <div className="service-rail-price"><small>Početni okvir</small><strong>{products[0]?.price || 'po ponudi'}</strong></div>
            <b>Pogledaj proizvode i cijene ↗</b>
          </Link>
        })}
      </div>
    </div></section>

    <OfferChooser />

    <FinalCta title="Ne znate koji proizvod odgovara projektu?" text="Pošaljite cilj, rok i budžetski okvir. Vratićemo se sa konkretnim proizvodom ili custom obimom ako standardna opcija nije dovoljna." label="Pošalji brief" />
  </>
}
