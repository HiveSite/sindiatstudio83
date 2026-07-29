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
  title: 'Sindikat Studio 83 - digitalni proizvodi, kampanje i teren',
  description: 'Studio iz Podgorice koji povezuje digitalne proizvode, kampanje, sadržaj, promo timove, aktivacije i događaje kroz jednu odgovornu realizaciju.',
  path: '/',
})

const faqs = [
  ['Koliko košta saradnja?', 'Cijena se formira nakon kratkog briefa, prema cilju, obimu, rokovima, produkciji, broju ljudi, lokacijama i integracijama. Prije početka dobijaš jasno razdvojene isporuke, troškove i odgovornosti.'],
  ['Radite li van Podgorice?', 'Da. Digitalne projekte radimo bez obzira na lokaciju, a aktivacije, promo angažmane i događaje organizujemo širom Crne Gore uz posebno definisanu logistiku.'],
  ['Da li moram znati koja mi usluga treba?', 'Ne. Dovoljno je da znaš šta želiš da promijeniš, do kada i šta trenutno postoji. Mi predlažemo najkraći realan sistem, a ne najduži spisak usluga.'],
  ['Možete li preuzeti samo jedan dio projekta?', 'Da. Možemo raditi jasno definisan blok, ali prvo provjeravamo da li zavisi od dijela koji ostaje kod klijenta ili drugog partnera. Odgovornosti moraju biti precizne.'],
  ['Kako izgleda prvi odgovor?', 'Pregledamo brief, označimo šta je jasno, šta nedostaje i da li postoji dobar fit. Zatim predlažemo sljedeći korak: kratki poziv, dodatna pitanja, audit ili okvir projekta.'],
  ['Da li medijski budžet ulazi u ponudu?', 'Medijski budžet, produkcija, osoblje, transport, zakup, dobavljači i agencijska naknada prikazuju se kao odvojene stavke kada su dio projekta.'],
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
        <div className="hero-copy"><span className="eyebrow">Studio za digital, ljude i teren</span><h1><span>Od digitalnog</span><span>proizvoda do</span><span className="outline">stvarne realizacije.</span></h1><p className="lead">Sindikat Studio 83 razvija platforme i kampanje, organizuje promo timove i vodi događaje širom Crne Gore. Klijent dobija jednu odgovornu tačku, jasan obim i sistem koji povezuje sve pokretne djelove.</p><div className="button-row hero-actions"><Link className="button button-primary" href="/kontakt/" data-track="hero_lead">Pošalji brief</Link><Link className="button button-ghost" href="/radovi/" data-track="hero_cases">Pogledaj projekte</Link></div><div className="hero-note"><span><i /> Podgorica i cijela Crna Gora</span><span><i /> Jedna koordinacija od plana do izvještaja</span></div></div>
        <div className="hero-visual" aria-label="Sistem koji povezuje digital, ljude i realizaciju"><div className="hero-glow" /><div className="hero-ring" /><div className="hero-ring" /><div className="hero-system"><div className="hero-core"><strong>jedan brief<br />jedan sistem</strong></div><div className="hero-node hero-node-1"><strong>Digital</strong><span>Proizvod, kampanja i mjerenje</span></div><div className="hero-node hero-node-2"><strong>Ljudi</strong><span>Roster, priprema i odgovornost</span></div><div className="hero-node hero-node-3"><strong>Teren</strong><span>Lokacije, logistika i izvještaj</span></div></div></div>
      </div></section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Operativna osnova, ne samo prezentacija.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Kada smo najkorisniji" title="Kada projekat ima više pokretnih djelova, neko mora držati cjelinu." text="Najveća vrijednost Sindikata nije u jednoj pojedinačnoj usluzi. Vrijednost je u tome što digitalni proizvod, kampanja, sadržaj, ljudi i terenska realizacija mogu koristiti isti cilj, rokove i sistem odgovornosti." /><div className="problem-grid">
        <article className="problem-card"><span>01</span><h3>Novi proizvod ili ponuda</h3><p>Treba postaviti pozicioniranje, web, prijavni ili prodajni tok, sadržaj i distribuciju bez pet nepovezanih dobavljača.</p></article>
        <article className="problem-card"><span>02</span><h3>Kampanja bez jasnog rezultata</h3><p>Budžet se troši, ali ponuda, mjerenje, kreative i obrada upita nijesu dio istog sistema.</p></article>
        <article className="problem-card"><span>03</span><h3>Aktivacija na više lokacija</h3><p>Potrebni su ljudi, smjene, transport, briefing, materijal, rezervna rješenja i pregled realizacije.</p></article>
        <article className="problem-card"><span>04</span><h3>Događaj ili community program</h3><p>Program, promocija, prijave, partneri, produkcija, osoblje i sadržaj moraju pratiti istu operativnu mapu.</p></article>
      </div></div></section>

      <section className="section section-light"><div className="container"><SectionHeading eyebrow="Glavni sistemi" title="Ne prodajemo katalog. Slažemo najkraći put od problema do izvedbe." text="Krećemo od ishoda koji projekat treba da proizvede. Tek nakon toga biramo kanale, funkcionalnosti, sadržaj, ljude i nivo produkcije." /><div className="service-grid">{services.slice(0, 3).map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-dark" href="/usluge/">Pogledaj svih pet usluga</Link></div></div></section>

      <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Kako projekat ulazi u rad</span><h2>Prvo zaključavamo odgovornost. Onda kreće produkcija.</h2><p className="lead">Dobar projekat ne počinje gomilom zadataka. Počinje jasnim ciljem, informacijama koje nedostaju i dogovorom ko donosi koju odluku.</p><Link className="button button-primary" href="/kontakt/">Pošalji početni brief</Link></div><div className="step-list">
        {[['01','Cilj i kontekst','Definišemo šta treba da se promijeni, kome, do kada i kako izgleda prihvatljiv rezultat.'],['02','Obim i vlasnici','Razdvajamo isporuke, zavisnosti, rokove, odobrenja i odgovornu osobu za svaki ključni blok.'],['03','Produkcijska mapa','Kampanje, web, sadržaj, timovi, lokacije i dobavljači ulaze u jedan realan raspored.'],['04','Realizacija i kontrola','Napredak, promjene i problemi vode se kroz dogovoreni kanal i ne ostaju skriveni do kraja projekta.'],['05','Izvještaj i naredni potez','Zaključujemo šta je urađeno, šta je naučeno i šta ima smisla ponoviti, promijeniti ili proširiti.']].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}
      </div></div></section>

      <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Radovi i sistemi" title="Projekti pokazuju kako različite discipline rade zajedno." text="Ne prikazujemo samo finalni vizual. Svaki case objašnjava problem, našu ulogu, postavljeni sistem, konkretan obim i ono što je projekat omogućio." /><div className="case-grid">{cases.slice(0, 3).map((item) => <CaseCard key={item.slug} item={item} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-ghost" href="/radovi/">Pogledaj sve projekte</Link></div></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Industrije" title="Najviše vrijedimo tamo gdje lokalni kontekst mijenja način realizacije." text="Sezona, lokacija, osoblje, regulisana komunikacija, kapacitet i brzina obrade često su važniji od samog izbora platforme. Zato industrijski kontekst ulazi u plan od prvog dana." /><div className="industry-grid">{industries.map((item) => <IndustryCard key={item.slug} item={item} />)}</div></div></section>

      <section className="section"><div className="container engagement-panel"><div><span className="eyebrow">Modeli saradnje</span><h2>Jasan okvir prije početka, bez univerzalnih paketa.</h2><p>Različiti projekti ne mogu imati isti obim samo zato što koriste isti kanal. Nakon briefa razdvajamo isporuke, troškove, rokove i odgovornosti, pa biraš format koji odgovara stvarnoj situaciji.</p></div><div className="engagement-list"><div className="engagement-card"><h3>Projektni sprint</h3><p>Za audit, strategiju, prototip, postavku sistema ili jednu jasno definisanu isporuku.</p><span>Jasan početak i završna predaja</span></div><div className="engagement-card"><h3>Kontinuirana saradnja</h3><p>Za kampanje, sadržaj, optimizaciju i redovan mjesečni ritam odlučivanja.</p><span>Plan, prioriteti i izvještavanje</span></div><div className="engagement-card"><h3>Produkcija i teren</h3><p>Za timove, lokacije, logistiku, događaje i realizaciju sa više dobavljača ili termina.</p><span>Ponuda prema stvarnom obimu</span></div></div></div></section>

      <section className="section section-dark"><div className="container faq-layout"><div><span className="eyebrow">FAQ</span><h2>Najvažnije prije prvog razgovora.</h2><p>Što ranije razdvojimo cilj, ograničenja i odgovornosti, to je manja vjerovatnoća da projekat postane skup nepovezanih zadataka.</p></div><FaqList items={faqs} /></div></section>
      <FinalCta />
    </>
  )
}
