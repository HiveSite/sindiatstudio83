import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { WorkFilter } from '@/components/work-filter'
import { cases } from '@/data/cases'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'Radovi - digitalni proizvodi, promo operacije i događaji',
  description: 'Projekti Sindikat Studio 83: digitalne platforme, STEAM i community programi, promo timovi, aktivacije, mini-sajtovi i event produkcija.',
  path: '/radovi/',
})

export default function WorksPage() {
  const crumbs = [{ label: 'Radovi', href: '/radovi/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Radovi</span><h1>Projekti u kojima je ideja morala postati sistem koji stvarno radi.</h1><p className="lead">Portfolio je organizovan prema vrsti problema, a ne samo prema industriji. Svaki projekat objašnjava kontekst, našu ulogu, postavljeni proces, konkretne isporuke i ono što je realizacija omogućila.</p></div><aside className="page-hero-aside"><strong>Šta tražiti u case studyju</strong><ul><li>koji problem je projekat rješavao</li><li>šta je Sindikat konkretno preuzeo</li><li>koje discipline su morale raditi zajedno</li><li>šta je ostalo upotrebljivo nakon realizacije</li></ul></aside></div></div></section>

    <section className="section"><div className="container manifesto"><div><span className="eyebrow">Hijerarhija portfolija</span><h2>Prvo prikazujemo sisteme sa najvećim obimom odgovornosti.</h2></div><div className="manifesto-copy">Digitalni proizvodi, višemjesečni programi i operativni sistemi dolaze prvi jer najbolje pokazuju način rada. Pojedinačne aktivacije, događaji i mini-sajtovi zatim pokazuju kako se isti standard primjenjuje na kraće i specifičnije formate. <strong>Filter mijenja temu, ali ne mijenja osnovni redosljed projekata.</strong></div></div></section>

    <section className="section section-dark" id="projekti"><div className="container"><WorkFilter items={cases} /></div></section>
    <FinalCta title="Treba ti sličan nivo koordinacije, ali ne isti projekat?" text="Pošalji cilj, rok, lokacije i timove koji su već uključeni. Izdvojićemo logiku koja se može prenijeti i jasno označiti šta mora biti prilagođeno tvojoj situaciji." />
  </>
}
