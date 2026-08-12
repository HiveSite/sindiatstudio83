import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CasePreviewCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { caseBySlug } from '@/data/cases'
import { industries, industryBySlug } from '@/data/industries'
import { serviceBySlug } from '@/data/services'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return industries.map((industry) => ({ slug: industry.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = industryBySlug[slug]
  if (!item) return {}
  return createMetadata({ title: `${item.title} - marketing i realizacija u Crnoj Gori`, description: item.summary, path: `/industrije/${item.slug}/` })
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = industryBySlug[slug]
  if (!item) notFound()
  const path = `/industrije/${item.slug}/`
  const crumbs = [{ label: 'Industrije', href: '/industrije/' }, { label: item.title, href: path }]
  const relatedSlugs = item.slug === 'poslodavci-i-zaposljavanje'
    ? ['recruitment-kampanje', 'performance-marketing', 'web-i-konverzije']
    : item.slug === 'retail-i-fmcg' || item.slug === 'eventi-i-venue'
      ? ['aktivacije-i-eventi', 'sadrzaj-za-kampanje', 'performance-marketing']
      : ['performance-marketing', 'web-i-konverzije', 'sadrzaj-za-kampanje']
  const relatedServices = relatedSlugs.map((value) => serviceBySlug[value]).filter(Boolean)
  const relatedCases = item.caseSlugs.map((value) => caseBySlug[value]).filter(Boolean)

  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({
        name: `${item.title} - marketing i realizacija u Crnoj Gori`,
        description: item.summary,
        path,
        about: [
          { name: item.title, url: path },
          ...relatedServices.map((service) => ({ name: service.shortTitle, url: `/usluge/${service.slug}/` })),
        ],
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Industrija</span><h1>{item.title}</h1><p className="lead">{item.summary}</p><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-primary" href={`/kontakt/?industrija=${item.slug}`} data-track="industry_lead">{item.cta}</Link></div></div><aside className="page-hero-aside"><strong>Najčešći problemi</strong><ul>{item.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></aside></div></div></section>

    <section className="section"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">Dobar fit</span><h2>Kada naš model najčešće ima smisla.</h2><ul>{item.bestFor.map((value) => <li key={value}>{value}</li>)}</ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">Šta povezujemo</span><h2>Blokovi koji rješavaju stvarni tok, ne samo vidljivost.</h2><ul>{item.solutions.map((solution) => <li key={solution}>{solution}</li>)}</ul></article></div></section>

    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Pravi trenutak</span><h2>Vrijeme pokretanja je dio strategije.</h2><p className="lead">{item.timing}</p></div><div className="step-list">{item.successSignals.map((signal, index) => <div className="step" key={signal}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>Signal uspjeha</h3><p>{signal}</p></div></div>)}</div></div></section>

    <section className="section"><div className="container"><SectionHeading eyebrow="Preporučeni blokovi" title="Usluge koje najčešće imaju smisla za ovu industriju." text="Ovo nije obavezni paket. Konačni obim zavisi od cilja, sezone, kapaciteta, postojećeg sistema i odgovornosti koje klijent želi da zadrži." /><div className="related-grid">{relatedServices.map((service) => <article className="related-card" key={service.slug}><h3>{service.shortTitle}</h3><p>{service.summary}</p><Link href={`/usluge/${service.slug}/`}>Pogledaj uslugu ↗</Link></article>)}</div></div></section>

    {relatedCases.length ? <section className="section section-light"><div className="container"><SectionHeading eyebrow="Povezani projekti" title="Kako se sličan kontekst pojavljuje u stvarnoj realizaciji." text="Projekti nijesu identične šeme, ali pokazuju kako povezujemo digitalni tok, sadržaj, ljude, lokacije i operativnu odgovornost." /><div className="case-preview-grid">{relatedCases.map((project) => <CasePreviewCard key={project.slug} item={project} />)}</div></div></section> : null}

    <FinalCta title={`${item.cta} bez nepotrebnog full-service paketa.`} text="Pošalji cilj, sezonu ili rok, lokacije i ono što već postoji. Predložićemo prvi obim koji može dati stvarnu vrijednost i označiti šta mora biti spremno prije početka." />
  </>
}
