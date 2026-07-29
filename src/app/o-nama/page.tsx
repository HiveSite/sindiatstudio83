import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'O nama - studio za digital, ljude i teren',
  description: 'Sindikat Studio 83 je operativni studio iz Podgorice koji povezuje digitalne proizvode, kampanje, sadržaj, promo timove, aktivacije i događaje.',
  path: '/o-nama/',
})

export default function AboutPage() {
  const crumbs = [{ label: 'O nama', href: '/o-nama/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">O Sindikatu</span><h1>Nastali smo na terenu, a digital razvili da rezultat ne zavisi od improvizacije.</h1><p className="lead">Sindikat Studio 83 je operativni studio iz Podgorice. Razvijamo digitalne proizvode i kampanje, organizujemo ljude i vodimo realizaciju na lokaciji kada projekat traži više od jedne discipline.</p></div><aside className="page-hero-aside"><strong>Naš fokus</strong><ul><li>jedan cilj i jedna operativna mapa</li><li>jasan obim, vlasnici i rokovi</li><li>realna lokalna izvedba u Crnoj Gori</li><li>mjerenje i izvještavanje bez uljepšavanja</li></ul></aside></div></div></section>

    <section className="section"><div className="container manifesto"><div><span className="eyebrow">Zašto postojimo</span><h2>Između dobre ideje i dobrog rezultata postoji veliki operativni prostor.</h2></div><div className="manifesto-copy">Dobar oglas ne može spasiti nejasnu ponudu. Dobar sajt ne pomaže ako niko ne obrađuje upit. Dobar event ne ostavlja dovoljno vrijednosti ako marketing, produkcija, ljudi i sadržaj nijesu povezani. <strong>Naš posao je da te djelove pretvorimo u sistem koji se može razumjeti, izvesti i unaprijediti.</strong></div></div></section>

    <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Način rada" title="Četiri pravila koja čuvaju projekat od široke, ali neusklađene realizacije." text="Širina usluga nije vrijednost sama po sebi. Vrijednost postoji samo kada je jasno ko vodi cjelinu, šta se isporučuje i zašto je svaki blok uključen." /><div className="value-grid"><article className="value-card"><span>01</span><h3>Jedan vlasnik cjeline</h3><p>Klijent zna ko vodi projekat, gdje se donose odluke i ko je odgovoran za sljedeći potez.</p></article><article className="value-card"><span>02</span><h3>Zaključan obim</h3><p>Isporuke, rokovi, odobrenja, revizije i zavisnosti nijesu otvorena lista koja raste bez kontrole.</p></article><article className="value-card"><span>03</span><h3>Dokaz prije priče</h3><p>Rezultate, reference i brojke prikazujemo samo kada možemo objasniti izvor, period i našu stvarnu ulogu.</p></article><article className="value-card"><span>04</span><h3>Operativa je dio proizvoda</h3><p>Raspored, forma, mjerenje, transport, evidencija dolazaka, plan B i izvještaj nijesu sitnice koje se rješavaju na kraju.</p></article></div></div></section>

    <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Kako smo se razvijali</span><h2>Od ljudi i događaja do povezanog sistema za digitalnu i lokalnu realizaciju.</h2><p className="lead">Nijesmo prvo napravili listu usluga pa tražili projekte. Svaki novi blok nastao je zato što je prethodnom nedostajao važan nastavak.</p></div><div className="step-list">{[
      ['01','Event i promo operativa','Počeli smo sa sourcingom ljudi, rosterom, smjenama, koordinacijom i događajima u Crnoj Gori.'],
      ['02','Sadržaj i distribucija','Terenu je bio potreban bolji način da se predstavi, dokumentuje i nastavi kroz digitalne kanale.'],
      ['03','Kampanje i mjerenje','Distribucija je zahtijevala pouzdano mjerenje, kreativne testove i jasnu vezu sa upitom, prijavom ili posjetom.'],
      ['04','Web i digitalni proizvodi','Kampanje i programi su tražili landing stranice, prijavne tokove i platforme koje mogu nositi stvarni proces.'],
      ['05','Jedinstven operativni model','Danas biramo samo blokove koji zajedno imaju smisla za konkretan cilj i odgovornost koju preuzimamo.'],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

    <section className="section section-light"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">Šta jesmo</span><h2>Operativni partner za složene lokalne projekte.</h2><ul><li>tim koji može povezati digitalni proizvod, kampanju, sadržaj i teren</li><li>jedna tačka komunikacije za više usklađenih disciplina</li><li>lokalna mreža ljudi, dobavljača i praktičnog iskustva u realizaciji</li><li>partner koji može predložiti manji obim kada je to pametniji početak</li></ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">Šta nijesmo</span><h2>Ne pokušavamo biti sve za svakoga.</h2><ul><li>fabrika objava, oglasa ili vizuala bez cilja i povratne informacije</li><li>spisak promotera koji klijent mora sam da koordinira</li><li>event posrednik bez produkcijske mape i odgovornosti</li><li>tim koji obećava rezultat koji zavisi od dijelova kojima nema pristup</li></ul></article></div></section>

    <section className="section"><div className="container center"><span className="eyebrow">Pogledaj kroz projekte</span><h2>Način rada je najlakše razumjeti kroz stvarne sisteme.</h2><p className="lead" style={{ marginInline: 'auto' }}>ImaPosla.me, BattleBots Arena, promo operativa, aktivacije, događaji i mini-sajtovi pokazuju različite obime, ali isti princip: cilj, vlasnik, proces i dokaz realizacije.</p><div className="button-row" style={{ justifyContent: 'center', marginTop: 28 }}><Link className="button button-dark" href="/radovi/">Pogledaj radove</Link></div></div></section>
    <FinalCta />
  </>
}
