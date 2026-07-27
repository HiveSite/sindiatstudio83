import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CaseCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { cases } from '@/data/cases'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'Radovi i case studies',
  description: 'Odabrani projekti Sindikat Studio 83: terenski angažmani, event produkcija i razvoj lokalnih digitalnih proizvoda.',
  path: '/radovi/',
})

export default function WorksPage() {
  const crumbs = [{ label: 'Radovi', href: '/radovi/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Radovi</span><h1>Projekti sa konkretnim obimom, procesom i dokazom.</h1><p className="lead">Ne predstavljamo zamišljene rezultate kao case study. Ovdje su projekti za koje možemo jasno objasniti problem, sistem i ishod.</p></div><aside className="page-hero-aside"><strong>Šta prikazujemo</strong><ul><li>stvarni obim projekta</li><li>potvrđene javne brojke</li><li>ulogu Sindikata</li><li>šta je sistem omogućio</li></ul></aside></div></div></section>
    <section className="section section-dark"><div className="container"><div className="case-grid">{cases.map((item) => <CaseCard key={item.slug} item={item} />)}</div></div></section>
    <FinalCta title="Treba ti sličan sistem?" text="Nećemo kopirati projekat jedan na jedan. Uzećemo logiku koja radi i prilagoditi je tvom cilju, timu i tržištu." />
  </>
}
