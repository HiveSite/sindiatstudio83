import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CaseCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { cases } from '@/data/cases'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'Radovi - digitalni proizvodi, događaji i terenske operacije',
  description: 'Odabrani projekti Sindikat Studio 83: digitalne platforme, STEAM programi, mini-sajtovi, promo timovi, aktivacije i event produkcija.',
  path: '/radovi/',
})

export default function WorksPage() {
  const crumbs = [{ label: 'Radovi', href: '/radovi/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Radovi</span><h1>Digitalni proizvodi, ljudi i događaji u stvarnoj realizaciji.</h1><p className="lead">Od razvoja platforme i mini-sajta do višemjesečnog programa, promo operacije ili privatnog događaja - prikazujemo šta je bio problem, kako je postavljen sistem i šta je projekat omogućio.</p></div><aside className="page-hero-aside"><strong>Šta je obuhvaćeno</strong><ul><li>digitalni proizvodi i web alati</li><li>projektna i event produkcija</li><li>promo timovi i logistika</li><li>aktivacije i koordinacija na terenu</li></ul></aside></div></div></section>
    <section className="section section-dark"><div className="container"><div className="case-grid">{cases.map((item) => <CaseCard key={item.slug} item={item} />)}</div></div></section>
    <FinalCta title="Treba ti sličan sistem?" text="Ne kopiramo projekat jedan na jedan. Uzimamo logiku koja radi i prilagođavamo je tvom cilju, timu, budžetu i tržištu." />
  </>
}
