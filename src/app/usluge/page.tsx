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
  title: 'Usluge - kampanje, aktivacije, web, sadržaj i recruitment',
  description: 'Usluge Sindikat Studio 83: performance kampanje, aktivacije i događaji, web i digitalni proizvodi, sadržaj i kampanje za zapošljavanje.',
  path: '/usluge/',
})

export default function ServicesPage() {
  const crumbs = [{ label: 'Usluge', href: '/usluge/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Usluge</span><h1>Pet disciplina koje mogu raditi odvojeno, ali najveću vrijednost daju kada su povezane.</h1><p className="lead">Ne krećemo od pitanja da li ti treba kampanja, sajt ili događaj. Krećemo od toga šta korisnik, gost, kandidat ili tim treba da uradi i šta mora biti spremno da bi taj korak stvarno bio moguć.</p></div><aside className="page-hero-aside"><strong>Prije preporuke provjeravamo</strong><ul><li>cilj i stvarni poslovni prioritet</li><li>ponudu, kapacitet i rok</li><li>šta već postoji i gdje proces puca</li><li>ko donosi odluke i ko obrađuje rezultat</li></ul></aside></div></div></section>

    <section className="section section-light"><div className="container"><div className="service-grid service-grid-five">{services.map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div></div></section>

    <section className="section"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Kako biramo obim</span><h2>Prvo problem. Onda najkraći sistem koji ga može riješiti.</h2><p className="lead">Full-service pristup ima smisla samo kada više blokova zaista zavise jedan od drugog. U suprotnom preporučujemo manji i precizniji početak.</p><Link className="button button-primary" href="/kontakt/">Opiši trenutnu situaciju</Link></div><div className="step-list">{[
      ['01','Ishod','Upit, rezervacija, prijava, registracija, posjeta, prodaja, sadržaj ili uredna terenska realizacija.'],
      ['02','Ograničenja','Rok, tržište, lokacije, kapacitet tima, dostupni materijali, budžet i regulisana pravila komunikacije.'],
      ['03','Zavisnosti','Provjeravamo šta mora biti spremno prije kampanje, produkcije, prijave kandidata ili izlaska tima na teren.'],
      ['04','Prva faza','Biramo najmanji obim koji može dati koristan rezultat ili pouzdanu informaciju za narednu odluku.'],
      ['05','Širenje','Dodajemo kanale, funkcionalnosti, sadržaj ili lokacije tek kada osnovni tok radi i odgovornosti su stabilne.'],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

    <section className="section section-dark"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">Dobar fit</span><h2>Projekti u kojima možemo preuzeti stvarnu odgovornost.</h2><ul><li>postoji jasan cilj ili problem koji treba precizirati</li><li>klijent može obezbijediti informacije i pravovremena odobrenja</li><li>postoji kapacitet da se rezultat kampanje, prijave ili događaja obradi</li><li>spremni smo da razdvojimo prioritete od želja koje mogu čekati</li></ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">Nije dobar fit</span><h2>Kada je bolje ne širiti projekat.</h2><ul><li>traži se samo velika količina zadataka bez jednog vlasnika i cilja</li><li>očekuje se garantovan rezultat bez pristupa podacima i procesu</li><li>rok ne ostavlja vrijeme za osnovnu pripremu i kontrolu kvaliteta</li><li>odgovornosti, budžet i odobrenja ostaju namjerno nejasni</li></ul></article></div></section>

    <FinalCta title="Ne znaš koja usluga ti treba? To je normalan početak." text="Pošalji cilj, rok, lokaciju i ono što već postoji. Vratićemo se sa preporučenom prvom fazom, uključujući mogućnost da je manji korak pametniji od velike kampanje." />
  </>
}
