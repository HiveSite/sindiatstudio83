import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { industries, industryBySlug } from '@/data/industries'
import { serviceBySlug } from '@/data/services'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return industries.map((item) => ({ slug: item.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = industryBySlug[slug]
  if (!item) return {}
  return createMetadata({ title: `${item.title} - marketing i aktivacije`, description: item.summary, path: `/industrije/${item.slug}/` })
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = industryBySlug[slug]
  if (!item) notFound()
  const crumbs = [{ label: 'Industrije', href: '/industrije/' }, { label: item.title, href: `/industrije/${item.slug}/` }]
  const relatedSlugs = item.slug === 'poslodavci-i-zaposljavanje'
    ? ['recruitment-kampanje', 'performance-marketing', 'web-i-konverzije']
    : item.slug === 'retail-i-fmcg' || item.slug === 'eventi-i-venue'
      ? ['aktivacije-i-eventi', 'sadrzaj-za-kampanje', 'performance-marketing']
      : ['performance-marketing', 'web-i-konverzije', 'sadrzaj-za-kampanje']
  const related = relatedSlugs.map((value) => serviceBySlug[value]).filter(Boolean)
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Industrija</span><h1>{item.title}</h1><p className="lead">{item.summary}</p><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-primary" href={`/kontakt/?industrija=${item.slug}`}>{item.cta}</Link></div></div><aside className="page-hero-aside"><strong>Najčešći problemi</strong><ul>{item.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></aside></div></div></section>
    <section className="section"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">Problem</span><h2>Gdje sistem najčešće puca.</h2><ul>{item.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">Rješenje</span><h2>Šta povezujemo.</h2><ul>{item.solutions.map((solution) => <li key={solution}>{solution}</li>)}</ul></article></div></section>
    <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Preporučeni blokovi" title="Usluge koje najčešće imaju smisla za ovu industriju." /><div className="related-grid">{related.map((service) => <article className="related-card" key={service.slug}><h3>{service.shortTitle}</h3><p>{service.summary}</p><Link href={`/usluge/${service.slug}/`}>Pogledaj uslugu ↗</Link></article>)}</div></div></section>
    <FinalCta title={`${item.cta} bez nepotrebnog full-service paketa.`} text="Pošalji cilj, sezonu ili rok i ono što već postoji. Predložićemo najkraći obim koji može da napravi razliku." />
  </>
}
