import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { WorkFilter } from '@/components/work-filter'
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
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Radovi</span><h1>Digitalni proizvodi, ljudi i događaji u stvarnoj realizaciji.</h1><p className="lead">Prikazujemo šta je bio problem, koju odgovornost smo preuzeli, kako je postavljen sistem i šta je projekat omogućio.</p></div><aside className="page-hero-aside"><strong>Naša glavna prednost</strong><ul><li>digital i teren u istom sistemu</li><li>sopstvena mreža ljudi i lokalna operativa</li><li>jedna odgovorna tačka od briefa do izvještaja</li><li>realizacija prilagođena Crnoj Gori</li></ul></aside></div></div></section>
    <section className="section section-dark"><div className="container"><WorkFilter items={cases} /></div></section>
    <FinalCta title="Treba ti sličan sistem?" text="Ne kopiramo projekat jedan na jedan. Uzimamo logiku koja radi i prilagođavamo je tvom cilju, timu, rokovima i tržištu." />
  </>
}
