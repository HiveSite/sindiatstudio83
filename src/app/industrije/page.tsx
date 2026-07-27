import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { IndustryCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { industries } from '@/data/industries'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'Industrije - turizam, retail, eventi i zapošljavanje',
  description: 'Marketing i aktivacije za ugostiteljstvo, turizam, retail, FMCG, evente, nekretnine i poslodavce u Crnoj Gori.',
  path: '/industrije/',
})

export default function IndustriesPage() {
  const crumbs = [{ label: 'Industrije', href: '/industrije/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Industrije</span><h1>Fokus na tržišta gdje lokalna realizacija pravi razliku.</h1><p className="lead">Naša prednost nije samo digitalna distribucija. Vrijednost raste kada kampanju treba povezati sa lokacijom, sezonom, osobljem, događajem ili procesom zapošljavanja.</p></div><aside className="page-hero-aside"><strong>Najčešći ciljevi</strong><ul><li>više rezervacija i posjeta</li><li>lansiranje proizvoda ili lokacije</li><li>mjerljive aktivacije</li><li>više kvalitetnih kandidata</li></ul></aside></div></div></section>
    <section className="section"><div className="container"><div className="industry-grid">{industries.map((item) => <IndustryCard key={item.slug} item={item} />)}</div></div></section>
    <FinalCta title="Tvoja industrija nije na listi?" text="To ne znači automatski da ne možemo pomoći. Pošalji problem i cilj, pa ćemo reći da li imamo realnu prednost ili ne." />
  </>
}
