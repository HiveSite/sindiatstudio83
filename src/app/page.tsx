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
  title: 'Sindikat Studio 83 - kampanje, ljudi i teren',
  description: 'Performance kampanje, aktivacije, sadržaj, web i recruitment u Crnoj Gori. Povezujemo digital, ljude i teren kroz jedan mjerljiv cilj.',
  path: '/',
})

const faqs = [
  ['Koliko košta saradnja?', 'Strategija i sprint kreću od 190 €, mjesečna saradnja od 600 €, dok se aktivacije i veći projekti procjenjuju prema obimu.'],
  ['Radite li van Podgorice?', 'Da. Digitalne projekte radimo bez obzira na lokaciju, a aktivacije organizujemo širom Crne Gore uz posebno definisanu logistiku.'],
  ['Da li moram znati koja mi usluga treba?', 'Ne. Dovoljno je da znaš cilj, problem, rok i okvirni budžet. Mi predlažemo najkraći realan sistem.'],
  ['Da li medijski budžet ulazi u cijenu?', 'Ne automatski. Agencijska naknada, medijski budžet, produkcija, osoblje, transport i zakup prikazuju se kao odvojene stavke.'],
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
        <div className="hero-copy"><span className="eyebrow">Podgorica - digital - ljudi - teren</span><h1><span>Kampanje koje</span><span>dovode ljude</span><span className="outline">do stvarne akcije.</span></h1><p className="lead">Povezujemo Meta i Google kampanje, sadržaj, landing stranice, promotivne timove i realizaciju na terenu kroz jedan jasan cilj.</p><div className="button-row hero-actions"><Link className="button button-primary" href="/kontakt/" data-track="hero_lead">Zatraži plan i procjenu</Link><Link className="button button-ghost" href="/radovi/" data-track="hero_cases">Pogledaj projekte</Link></div><div className="hero-note"><span><i /> Podgorica i cijela Crna Gora</span><span><i /> Digital + teren u istom sistemu</span></div></div>
        <div className="hero-visual" aria-label="Sistem koji povezuje kampanje, sadržaj i teren"><div className="hero-glow" /><div className="hero-ring" /><div className="hero-ring" /><div className="hero-system"><div className="hero-core"><strong>od oglasa<br />do akcije</strong></div><div className="hero-node hero-node-1"><strong>Kampanja</strong><span>Meta, Google i mjerenje</span></div><div className="hero-node hero-node-2"><strong>Teren</strong><span>Ljudi, logistika i aktivacija</span></div><div className="hero-node hero-node-3"><strong>Sadržaj</strong><span>Kreative i digitalni nastavak</span></div></div></div>
      </div></section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">Operativna osnova, ne samo prezentacija.</div>{site.proof.map((item) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Problemi koje rješavamo" title="Marketing ne smije da bude skup odvojenih zadataka." text="Kampanja, sadržaj, sajt i teren moraju da podrže istu radnju. U suprotnom svako radi svoj dio, a rezultat nema vlasnika." /><div className="problem-grid">
        <article className="problem-card"><span>01</span><h3>Kampanje troše, a upiti nijesu dovoljno kvalitetni</h3><p>Provjeravamo ponudu, mjerenje i put do kontakta prije povećanja budžeta.</p></article>
        <article className="problem-card"><span>02</span><h3>Aktivacija prođe bez podataka i nastavka</h3><p>Postavljamo mehaniku, evidenciju i sadržaj koji ostaje upotrebljiv poslije događaja.</p></article>
        <article className="problem-card"><span>03</span><h3>Brend nema pouzdan tim za realizaciju</h3><p>Izbor ljudi, raspored, priprema, vođe smjene i kontrola nalaze se u jednom sistemu.</p></article>
        <article className="problem-card"><span>04</span><h3>Sezona ili lansiranje dolaze bez pripremljenog prodajnog puta</h3><p>Spajamo ponudu, landing, distribuciju, sadržaj i lokalnu realizaciju prije nego što krene pritisak.</p></article>
      </div></div></section>

      <section className="section section-light"><div className="container"><SectionHeading eyebrow="Glavni proizvodi" title="Ne prodajemo katalog. Slažemo sistem prema cilju." text="Krećemo od ishoda koji biznis želi. Alati, kanali i produkcija dolaze tek nakon toga." /><div className="service-grid">{services.slice(0, 3).map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-dark" href="/usluge/">Pogledaj kompletnu ponudu</Link></div></div></section>

      <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Aktivacije i eventi</span><h2>Teren koji ima cilj, vlasnika i dokaz.</h2><p className="lead">Od prvog briefa do završnog izvještaja, svaki korak ima odgovornu osobu, rok i način mjerenja.</p><Link className="button button-primary" href="/usluge/aktivacije-i-eventi/">Kako radimo aktivacije</Link></div><div className="step-list">
        {[['01','Cilj i mehanika','Definišemo radnju koju publika treba da uradi i način na koji je bilježimo.'],['02','Tim i operativna mapa','Lokacije, smjene, oprema, odgovornosti, zamjene i plan B.'],['03','Priprema i realizacija','Ljudi znaju poruku, proces i standard prije nego što izađu na teren.'],['04','Sadržaj i mjerenje','Prikupljamo podatke, foto/video dokaz i nalaze za digitalni nastavak.'],['05','Izvještaj i naredni potez','Klijent dobija šta je urađeno, šta smo naučili i gdje postoji prostor za rast.']].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}
      </div></div></section>

      <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Radovi i sistemi" title="Dokaz prije obećanja." text="Prikazujemo projekte za koje imamo konkretan obim, proces i potvrđene podatke." /><div className="case-grid">{cases.slice(0, 2).map((item) => <CaseCard key={item.slug} item={item} />)}</div><div className="button-row" style={{ marginTop: 28 }}><Link className="button button-ghost" href="/radovi/">Svi projekti</Link></div></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Industrije" title="Najviše vrijedimo tamo gdje su digital i lokalna realizacija povezani." text="Ne pokušavamo da budemo specijalisti za svaku industriju. Fokus je na sektorima u kojima naš operativni model ima stvarnu prednost." /><div className="industry-grid">{industries.map((item) => <IndustryCard key={item.slug} item={item} />)}</div></div></section>

      <section className="section"><div className="container pricing-panel"><div><span className="eyebrow">Modeli saradnje</span><h2>Jasan okvir prije početka.</h2><p>Raspon služi da znaš red veličine. Konačna ponuda zavisi od obima, rokova, produkcije, lokacija i potrebnog tima.</p></div><div className="pricing-list"><div className="price-card"><div><h3>Strategija i sprint</h3><p>Analiza, plan, jedna jasna isporuka i definisani sljedeći koraci.</p></div><strong>od 190 €</strong></div><div className="price-card"><div><h3>Mjesečna saradnja</h3><p>Kampanje, mjerenje, optimizacija i dogovoreni mjesečni ritam.</p></div><strong>od 600 € / mj.</strong></div><div className="price-card"><div><h3>Kampanja + teren</h3><p>Digitalna distribucija, produkcija, ljudi, aktivacija i izvještaj.</p></div><strong>po ponudi</strong></div></div></div></section>

      <section className="section section-dark"><div className="container faq-layout"><div><span className="eyebrow">FAQ</span><h2>Prije prvog poziva.</h2><p>Najvažnije stvari treba da budu jasne prije nego što uđemo u detalje projekta.</p></div><FaqList items={faqs} /></div></section>
      <FinalCta />
    </>
  )
}
