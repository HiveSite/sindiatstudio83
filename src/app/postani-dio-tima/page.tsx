import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JobsBoard, OpenApplicationButton } from '@/components/jobs-board'
import { JsonLd } from '@/components/json-ld'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({ title: 'Postani dio tima - promo i event angažmani', description: 'Prijavi se za promotivne, event, hospitality i terenske angažmane Sindikat Studio 83 u Podgorici i širom Crne Gore.', path: '/postani-dio-tima/' })

export default function JobsPage() {
  const crumbs = [{ label: 'Postani dio tima', href: '/postani-dio-tima/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Roster i angažmani</span><h1>Radi na promocijama, događajima, hospitality i drugim terenskim projektima.</h1><p className="lead">Pregledaj aktivne angažmane ili pošalji otvorenu prijavu za Sindikat roster. Roster nam pomaže da te kontaktiramo kada profil, grad i dostupnost odgovaraju konkretnom briefu.</p><div className="button-row" style={{ marginTop: 30 }}><OpenApplicationButton /><a className="button button-ghost" href={site.imaposla} target="_blank" rel="noopener noreferrer" data-track="imaposla_click">Ostali poslovi na ImaPosla.me</a></div></div><aside className="page-hero-aside"><strong>Važno prije prijave</strong><ul><li>unesi tačan telefon, grad i dostupnost</li><li>prijava u roster ne garantuje angažman</li><li>uslovi se potvrđuju za svaki projekat posebno</li><li>na smjenu dolaziš tek nakon jasne potvrde</li></ul></aside></div></div></section>

    <section className="section"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">Šta očekujemo</span><h2>Pouzdanost je važnija od samog iskustva.</h2><ul><li>tačne informacije o dostupnosti, gradu i prethodnom iskustvu</li><li>pravovremen odgovor kada se ponudi angažman</li><li>dolazak u dogovoreno vrijeme i poštovanje briefa</li><li>profesionalna komunikacija sa timom, klijentom i posjetiocima</li><li>odmah prijavljen problem, kašnjenje ili promjena dostupnosti</li></ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">Šta dobijaš</span><h2>Jasne informacije prije nego što prihvatiš smjenu.</h2><ul><li>opis uloge, datum, vrijeme, lokaciju i očekivano trajanje</li><li>dogovorenu naknadu i poznate uslove angažmana</li><li>briefing, kontakt odgovorne osobe i potrebne materijale</li><li>informaciju o transportu kada je projekat van Podgorice</li><li>mogućnost budućih angažmana kada je saradnja pouzdana</li></ul></article></div></section>

    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Kako roster funkcioniše</span><h2>Otvorena prijava nije isto što i potvrđena smjena.</h2><p className="lead">Kontaktiramo ljude prema konkretnom briefu, lokaciji, iskustvu, dostupnosti i potrebnom broju članova tima.</p></div><div className="step-list">{[
      ['01','Prijava','Unosiš kontakt, grad, dostupnost, iskustvo i informacije koje pomažu da razumijemo za koje uloge možeš odgovarati.'],
      ['02','Poziv za konkretan projekat','Kada postoji odgovarajući angažman, dobijaš osnovne uslove i rok do kojeg treba da potvrdiš dostupnost.'],
      ['03','Potvrda i briefing','Nakon potvrde dobijaš tačnu lokaciju, vrijeme, ulogu, pravila, kontakt vođe smjene i druge važne informacije.'],
      ['04','Realizacija','Dolazak i odlazak se evidentiraju, a problemi i promjene odmah komuniciraju odgovornoj osobi.'],
      ['05','Naredni angažmani','Pouzdana realizacija, dobra komunikacija i odgovarajući profil povećavaju vjerovatnoću narednog poziva, ali ne predstavljaju garanciju.'],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

    <JobsBoard />
  </>
}
