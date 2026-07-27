import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ServiceCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { services } from '@/data/services'
import { breadcrumbSchema } from '@/lib/schema'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Usluge - performance, aktivacije, web i recruitment',
  description: 'Kompletna ponuda Sindikat Studio 83: performance kampanje, aktivacije i eventi, web i konverzije, sadržaj i recruitment kampanje.',
  path: '/usluge/',
})

export default function ServicesPage() {
  const crumbs = [{ label: 'Usluge', href: '/usluge/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Ponuda</span><h1>Usluge organizovane prema rezultatu, ne prema alatima.</h1><p className="lead">Biramo najkraći sistem koji ima smisla za cilj - od kampanje i landing stranice do ljudi, terena i recruitment distribucije.</p></div><aside className="page-hero-aside"><strong>Svaki projekat dobija</strong><ul><li>jasan cilj i mjerilo</li><li>definisan obim i odgovornost</li><li>tracking i izvještaj gdje je primjenjivo</li><li>konkretan sljedeći korak</li></ul></aside></div></div></section>
    <section className="section section-light"><div className="container"><div className="service-grid service-grid-five">{services.map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div></div></section>
    <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Kako biramo obim</span><h2>Prvo problem. Onda kanal.</h2><p className="lead">Ne preporučujemo sajt, kampanju, content ili aktivaciju prije nego što znamo šta treba da se promijeni u ponašanju kupca ili kandidata.</p></div><div className="step-list">{[
      ['01','Ishod','Upit, rezervacija, posjeta, prodaja, prijava ili mjerljiva interakcija.'],
      ['02','Ograničenja','Budžet, rok, tržište, kapacitet tima i postojeći materijali.'],
      ['03','Najkraći sistem','Biramo minimum kanala i isporuka koji mogu da daju koristan signal.'],
      ['04','Skaliranje','Širimo tek kada osnovni flow radi i kada znamo šta treba pojačati.'],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <FinalCta title="Ne znaš koja usluga ti treba? To nije problem." text="Pošalji cilj, rok i okvir. Preporučićemo najkraći realan put, uključujući opciju da još nije vrijeme za veću kampanju." />
  </>
}
