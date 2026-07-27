import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { cases, caseBySlug } from '@/data/cases'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return cases.map((item) => ({ slug: item.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = caseBySlug[slug]
  if (!item) return {}
  return createMetadata({ title: item.title, description: item.summary, path: `/radovi/${item.slug}/` })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = caseBySlug[slug]
  if (!item) notFound()
  const crumbs = [{ label: 'Radovi', href: '/radovi/' }, { label: item.title, href: `/radovi/${item.slug}/` }]
  return <>
    <JsonLd data={[breadcrumbSchema(crumbs), { '@context': 'https://schema.org', '@type': 'CreativeWork', name: item.title, description: item.summary, creator: { '@id': `${site.domain}/#organization` }, url: `${site.domain}/radovi/${item.slug}/` }]} />
    <section className="page-hero">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className="page-hero-grid">
          <div>
            <span className="eyebrow">{item.type}</span>
            <h1>{item.title}</h1>
            <p className="lead">{item.summary}</p>
            <div className="case-hero-metrics">
              {item.metrics.map(([value, label]) => (
                <div key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
          </div>
          <div className={`case-visual case-visual-${item.slug}`} style={{ minHeight: 460, borderRadius: 26, border: '1px solid var(--line)' }}>
            <span>{item.type}</span><div className="case-orbit" />
          </div>
        </div>
      </div>
    </section>
    <section className="section"><div className="container case-story"><article className="story-card"><span>01 - Izazov</span><h2>Šta je trebalo riješiti</h2><p>{item.challenge}</p></article><article className="story-card"><span>02 - Sistem</span><h2>Kako je postavljeno</h2><p>{item.solution}</p></article><article className="story-card"><span>03 - Ishod</span><h2>Šta je omogućeno</h2><p>{item.result}</p></article></div></section>
    <section className="section section-dark"><div className="container"><span className="eyebrow">Obuhvaćene usluge</span><h2>Više disciplina, jedan odgovoran sistem.</h2><div className="case-service-tags">{item.services.map((service) => <span key={service}>{service}</span>)}</div></div></section>
    <FinalCta title="Imaš projekat sa više pokretnih djelova?" text="Pošalji osnovni brief. Prvo ćemo razdvojiti šta je cilj, šta je operativa, a šta stvarno mora da bude u prvoj fazi." />
  </>
}
