import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'O nama - Performance & Activation Studio',
  description: 'Sindikat Studio 83 je studio iz Podgorice koji spaja digitalne kampanje, sadržaj, web, ljude i aktivacije na terenu.',
  path: '/o-nama/',
})

export default function AboutPage() {
  const crumbs = [{ label: 'O nama', href: '/o-nama/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">O Sindikatu</span><h1>Nastali smo iz terena. Digital smo dodali da rezultat ne ostane slučajan.</h1><p className="lead">Sindikat je Performance & Activation Studio iz Podgorice. Povezujemo strategiju, kampanje, sadržaj, web, ljude i lokalnu realizaciju.</p></div><aside className="page-hero-aside"><strong>Naš fokus</strong><ul><li>jedan cilj po projektu</li><li>jasna odgovornost i rokovi</li><li>realna lokalna izvedba</li><li>mjerenje bez uljepšavanja</li></ul></aside></div></div></section>
    <section className="section"><div className="container manifesto"><div><span className="eyebrow">Zašto postojimo</span><h2>Između plana i rezultata postoji operativa.</h2></div><div className="manifesto-copy">Dobar oglas ne spašava nejasnu ponudu. Dobar event ne vrijedi mnogo ako prođe bez podataka i nastavka. <strong>Naš posao je da spojimo djelove u sistem koji može da se izvede.</strong></div></div></section>
    <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Način rada" title="Četiri pravila koja nas čuvaju od full-service haosa." /><div className="value-grid"><article className="value-card"><span>01</span><h3>Jedan vlasnik</h3><p>Klijent zna ko vodi projekat i ko je odgovoran za sljedeći potez.</p></article><article className="value-card"><span>02</span><h3>Zaključan obim</h3><p>Dogovorene isporuke, rokovi i revizije nijesu otvorena lista bez kraja.</p></article><article className="value-card"><span>03</span><h3>Dokaz prije priče</h3><p>Rezultate prikazujemo samo kada možemo objasniti izvor i kontekst.</p></article><article className="value-card"><span>04</span><h3>Operativa je dio proizvoda</h3><p>Raspored, tracking, forma i izvještaj nijesu sitnice koje se rješavaju na kraju.</p></article></div></div></section>
    <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Razvoj</span><h2>Od event industrije do povezanog sistema rasta.</h2><p className="lead">Počeli smo sa ljudima i događajima. Kroz rad smo vidjeli da teren bez kampanje ostaje izolovan, a kampanja bez sadržaja, landing stranice i operativnog kapaciteta brzo dođe do plafona.</p></div><div className="step-list">{[
      ['01','Event i promo operativa','Izbor ljudi, roster, smjene, koordinacija i realizacija u Crnoj Gori.'],
      ['02','Digitalne kampanje','Meta, Google, creative testing i tracking za upite, registracije i posjete.'],
      ['03','Web i proizvodi','Landing stranice, platforme i procesi koji povezuju podatke sa narednom radnjom.'],
      ['04','Jedinstven sistem','Danas biramo samo blokove koji zajedno imaju smisla za konkretan cilj.'],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <FinalCta />
  </>
}
