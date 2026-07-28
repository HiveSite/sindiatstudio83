import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CaseCoverPlaceholder, CaseMediaPlaceholder } from '@/components/case-media'
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
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: item.title,
        description: item.summary,
        creator: { '@id': `${site.domain}/#organization` },
        url: `${site.domain}/radovi/${item.slug}/`,
        inLanguage: site.locale,
      },
    ]} />

    <section className="page-hero">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className="page-hero-grid case-detail-hero">
          <div>
            <span className="eyebrow">{item.type}</span>
            <h1>{item.title}</h1>
            <p className="lead">{item.summary}</p>
            <div className="case-hero-metrics">
              {item.metrics.map(([value, label]) => (
                <div key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
            {item.links?.length ? <div className="case-project-links">
              {item.links.map((link) => <a key={link.href} className="button button-ghost button-small" href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
            </div> : null}
          </div>
          <CaseCoverPlaceholder item={item} large />
        </div>
      </div>
    </section>

    <section className="section"><div className="container case-story"><article className="story-card"><span>01 - Izazov</span><h2>Šta je trebalo riješiti</h2><p>{item.challenge}</p></article><article className="story-card"><span>02 - Sistem</span><h2>Kako je postavljeno</h2><p>{item.solution}</p></article><article className="story-card"><span>03 - Ishod</span><h2>Šta je omogućeno</h2><p>{item.result}</p></article></div></section>

    <section className="section section-light"><div className="container"><div className="section-heading"><div><span className="eyebrow">Obim projekta</span><h2>Šta je Sindikat radio.</h2></div><p>Jasno odvajamo našu ulogu od ukupnog projekta, da bi bilo vidljivo gdje se nalazi stvarna vrijednost i odgovornost.</p></div><div className="case-scope-grid">{item.scope.map((scope, index) => <article key={scope}><span>{String(index + 1).padStart(2, '0')}</span><strong>{scope}</strong></article>)}</div></div></section>

    {item.subprojects?.length ? <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Primjeri i podprojekti</span><h2>Jedan sistem, više konkretnih primjena.</h2></div><p>Svaki podprojekat koristi isti operativni princip, ali je sadržaj i korisnički tok prilagođen konkretnoj potrebi.</p></div><div className="case-subproject-grid">{item.subprojects.map((subproject) => <article key={subproject.title}><span className="case-subproject-mark" /><h3>{subproject.title}</h3><p>{subproject.summary}</p>{subproject.link ? <a href={subproject.link.href} target="_blank" rel="noreferrer">{subproject.link.label} ↗</a> : null}</article>)}</div></div></section> : null}

    <section className="section section-dark"><div className="container"><div className="section-heading"><div><span className="eyebrow">Vizuelni materijal</span><h2>Mjesta pripremljena za stvarne fotografije i screenshotove.</h2></div><p>Placeholderi ostaju u prvoj fazi. Kasnije ih mijenjamo optimizovanim WebP fotografijama i screenshotovima bez promjene strukture stranice.</p></div><div className="case-media-grid">{item.gallery.map((media) => <CaseMediaPlaceholder key={`${media.kind}-${media.label}`} item={media} />)}</div>{item.note ? <p className="case-note">{item.note}</p> : null}</div></section>

    <section className="section"><div className="container"><span className="eyebrow">Obuhvaćene usluge</span><h2>Više disciplina, jedan odgovoran sistem.</h2><div className="case-service-tags">{item.services.map((service) => <span key={service}>{service}</span>)}</div><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-dark" href="/radovi/">Pogledaj sve projekte</Link></div></div></section>

    <FinalCta title="Imaš projekat sa više pokretnih djelova?" text="Pošalji osnovni brief. Prvo ćemo razdvojiti cilj, operativu i ono što stvarno mora biti u prvoj fazi." />
  </>
}
