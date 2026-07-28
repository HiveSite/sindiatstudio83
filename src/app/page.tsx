import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { site } from '@/data/site'
import { ServiceCard, CaseCard, IndustryCard, FaqList } from '@/components/cards'
import { SectionHeading } from '@/components/section-heading'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Sindikat Studio 83 - digital, ljudi i teren',
  description: 'Razvijamo digitalne proizvode, vodimo kampanje i organizujemo timove, aktivacije i događaje širom Crne Gore.',
  path: '/',
})

const faqs = [
  ['Koliko košta saradnja?', 'Cijena se formira nakon kratkog briefa, prema cilju, obimu, rokovima, produkciji, broju ljudi i lokacija. Prije početka dobijaš jasno razdvojene stavke i odgovornosti.'],
  ['Radite li van Podgorice?', 'Da. Digitalne projekte radimo bez obzira na lokaciju, a aktivacije i događaje organizujemo širom Crne Gore uz posebno definisanu logistiku.'],
  ['Da li moram znati koja mi usluga treba?', 'Ne. Dovoljno je da znaš cilj, problem, rok i šta trenutno postoji. Mi predlažemo najkraći realan sistem.'],
  ['Da li medijski budžet ulazi u ponudu?', 'Medijski budžet, produkcija, osoblje, transport, zakup i agencijska naknada prikazuju se kao odvojene stavke kada su dio projekta.'],
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': `${site.domain}/#service`, name: site.name, url: site.domain,
        image: `${site.domain}/images/brand/og-cover.png`, areaServed: { '@type': 'Country', name: 'Montenegro' },
        address: { '@type': 'PostalAddress', addressLocality: 'Podgorica', addressCountry: 'ME' }, parentOrganization: { '@id': `${site.domain}/#organization` },
      }} />

      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy"><span className="eyebrow">Podgorica - digital - ljudi - teren</span><h1><span>Od kampanje</span><span>do ljudi</span><span className="outline">na terenu.</span></h1><p className="lead">Razvijamo digitalne proizvode, vodimo kampanje i organizujemo timove, aktivacije i događaje širom Crne Gore - kroz jedan sistem i jednu odgovornu tačku.</p><div className="button-row hero-actions"><Link className="button button-primary" href="/kontakt/" data-track="hero_lead">Pošalji brief</Link><Link className="button button-ghost" href="/radovi/" data-track="hero_cases">Pogledaj projekte</Link></div><div className="hero-note"><span><i /> Podgorica i cijela Crna Gora</span><span><i /> Digital + teren u istom sistemu</span></div></div>
        <div className="hero-visual" aria-label="Sistem koji povezuje digital, ljude i realizaciju"><div className="hero-glow" /><div className="hero-ring" /><div className="hero-ring" /><div className="hero-system"><div className="hero-core"><strong>jedan tim<br />jedan ishod</strong></div><div className="hero-node hero-node-1"><strong>Digital</strong><span>Proizvod, kampanja i mjerenje</span></div><div className="hero-node hero-node-2"><strong>Ljudi</strong><span>Roster, priprema i odgovornost</span></div><div className="hero-node hero-node-3"><strong>Realizacija</strong><span>Lokacije, logistika i izvještaj</span></div></div></div>
      </div></section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Operativna osnova, ne samo prezentacija.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Zašto Sindikat" title="Digital, ljudi i teren ne predajemo iz ruke u ruku." text="Najveća vrijednost je u spoju kompetencija. Projekat ne zapinje između agencije, produkcije, promotera i klijenta jer postoji jedan sistem odgovornosti." /><div className="problem-grid">
        <article className="problem-card"><span>01</span><h3>Digitalni proizvod i kampanja</h3><p>Web, sadržaj, distribucija i mjerenje planiraju se kao jedan korisnički put.</p></article>
        <article className="problem-card"><span>02</span><h3>Sopstvena mreža ljudi</h3><p>Roster, selekcija, briefing, lideri smjene i zamjene nijesu prepušteni improvizaciji.</p></article>
        <article className="problem-card"><span>03</span><h3>Lokalna operativa</h3><p>Poznamo lokacije, sezonalnost, logistiku i realne uslove realizacije u Crnoj Gori.</p></article>
        <article className="problem-card"><span>04</span><h3>Jedna odgovorna tačka</h3><p>Od briefa i rokova do terena i završnog izvještaja zna se ko vodi cjelinu.</p></article>
      </div></div></section>

      <section className="section section-light"><div className="container"><SectionHeading eyebrow="Glavni sistemi" title="Ne prodajemo katalog. Slažemo najkraći put do rezultata." text="Krećemo od ishoda koji biznis želi. Alati, kanali, ljudi i produkcija dolaze tek nakon toga." /><div className="service-grid">{services.slice(0, 3).map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-dark" href="/usluge/">Pogledaj kompletnu ponudu</Link></div></div></section>

      <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Aktivacije i eventi</span><h2>Teren koji ima cilj, vlasnika i dokaz.</h2><p className="lead">Od prvog briefa do završnog izvještaja, svaki korak ima odgovornu osobu, rok i način kontrole.</p><Link className="button button-primary" href="/usluge/aktivacije-i-eventi/">Kako radimo aktivacije</Link></div><div className="step-list">
        {[['01','Cilj i mehanika','Definišemo radnju koju publika treba da uradi i način na koji je bilježimo.'],['02','Tim i operativna mapa','Lokacije, smjene, oprema, odgovornosti, zamjene i plan B.'],['03','Priprema i realizacija','Ljudi znaju poruku, proces i standard prije nego što izađu na teren.'],['04','Sadržaj i mjerenje','Prikupljamo podatke, foto/video dokaz i nalaze za digitalni nastavak.'],['05','Izvještaj i naredni potez','Klijent dobija šta je urađeno, šta smo naučili i gdje postoji prostor za rast.']].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}
      </div></div></section>

      <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Radovi i sistemi" title="Dokaz prije obećanja." text="Digitalni proizvodi, višemjesečni programi, promo operacije i događaji - svaki projekat prikazujemo kroz problem, odgovornost i ishod." /><div className="case-grid">{cases.slice(0, 3).map((item) => <CaseCard key={item.slug} item={item} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-ghost" href="/radovi/">Svi projekti</Link></div></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Industrije" title="Najviše vrijedimo tamo gdje su digital i lokalna realizacija povezani." text="Ne pokušavamo da budemo specijalisti za svaku industriju. Fokus je na sektorima u kojima naš operativni model ima stvarnu prednost." /><div className="industry-grid">{industries.map((item) => <IndustryCard key={item.slug} item={item} />)}</div></div></section>

      <section className="section"><div className="container engagement-panel"><div><span className="eyebrow">Modeli saradnje</span><h2>Jasan okvir prije početka.</h2><p>Ne objavljujemo univerzalne cijene za projekte različitog obima. Nakon kratkog briefa razdvajamo cilj, isporuke, troškove i odgovornosti.</p></div><div className="engagement-list"><div className="engagement-card"><h3>Projektni sprint</h3><p>Za audit, strategiju, prototip ili jednu jasno definisanu isporuku.</p><span>Jasan početak i kraj</span></div><div className="engagement-card"><h3>Kontinuirana saradnja</h3><p>Za kampanje, sadržaj, optimizaciju i dogovoreni operativni ritam.</p><span>Mjesečni plan i odgovornost</span></div><div className="engagement-card"><h3>Produkcija i teren</h3><p>Za ljude, lokacije, logistiku, događaje i višednevnu realizaciju.</p><span>Ponuda prema stvarnom obimu</span></div></div></div></section>

      <section className="section section-dark"><div className="container faq-layout"><div><span className="eyebrow">FAQ</span><h2>Prije prvog razgovora.</h2><p>Najvažnije stvari treba da budu jasne prije nego što uđemo u detalje projekta.</p></div><FaqList items={faqs} /></div></section>
      <FinalCta />
    </>
  )
}
