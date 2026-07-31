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
  return createMetadata({
    title: item.title,
    description: item.summary,
    path: `/radovi/${item.slug}/`,
    image: item.socialImage?.src,
    imageAlt: item.socialImage?.alt,
  })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = caseBySlug[slug]
  if (!item) notFound()
  const crumbs = [{ label: 'Radovi', href: '/radovi/' }, { label: item.title, href: `/radovi/${item.slug}/` }]
  const metrics = item.metrics || []

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
        image: item.socialImage ? `${site.domain}${item.socialImage.src}` : undefined,
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
            {metrics.length ? <div className="case-hero-metrics">
              {metrics.map(([value, label]) => <div key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>)}
            </div> : null}
            {item.links?.length ? <div className="case-project-links">
              {item.links.map((link) => <a key={link.href} className="button button-ghost button-small" href={link.href} target="_blank" rel="noreferrer" data-track="case_external_project">{link.label} ↗</a>)}
            </div> : null}
          </div>
          <CaseCoverPlaceholder item={item} large />
        </div>
      </div>
    </section>

    <section className="section"><div className="container manifesto"><div><span className="eyebrow">Naša uloga</span><h2>Šta je Sindikat držao pod direktnom odgovornošću.</h2></div><div className="manifesto-copy">{item.role}</div></div></section>

    <section className="section"><div className="container case-story"><article className="story-card"><span>01 - Kontekst</span><h2>Šta je trebalo riješiti</h2><p>{item.challenge}</p></article><article className="story-card"><span>02 - Sistem</span><h2>Kako smo postavili realizaciju</h2><p>{item.solution}</p></article><article className="story-card"><span>03 - Ishod</span><h2>Šta je projekat omogućio</h2><p>{item.result}</p></article></div></section>

    <section className="section section-light"><div className="container"><div className="section-heading"><div><span className="eyebrow">Obim projekta</span><h2>Konkretne odgovornosti i isporuke.</h2></div><p>Ovaj pregled jasno odvaja našu odgovornost od ukupnog projekta i pokazuje koje smo konkretne blokove držali pod direktnom kontrolom.</p></div><div className="case-scope-grid">{item.scope.map((scope, index) => <article key={scope}><span>{String(index + 1).padStart(2, '0')}</span><strong>{scope}</strong></article>)}</div></div></section>

    {item.subprojects?.length ? <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Primjene i podprojekti</span><h2>Jedan operativni princip, više konkretnih realizacija.</h2></div><p>Tim, komunikacija, funkcionalnosti i tok prilagođavaju se svakoj situaciji, dok standard odgovornosti ostaje isti.</p></div><div className="case-subproject-grid">{item.subprojects.map((subproject) => <article key={subproject.title}><span className="case-subproject-mark" /><h3>{subproject.title}</h3><p>{subproject.summary}</p>{subproject.link ? <a href={subproject.link.href} target="_blank" rel="noreferrer" data-track="case_subproject_click">{subproject.link.label} ↗</a> : null}</article>)}</div></div></section> : null}

    <section className="section section-dark"><div className="container"><div className="section-heading"><div><span className="eyebrow">Vizuelni pregled</span><h2>Ključni momenti, ekrani i detalji koji najbolje objašnjavaju projekat.</h2></div><p>Galerija prikazuje sve dostavljene materijale za projekat, uz SEO nazive, optimizovane formate i jasan opis uloge svakog kadra ili ekrana.</p></div><div className="case-media-grid">{item.gallery.map((media) => <CaseMediaPlaceholder key={`${media.kind}-${media.label}`} item={media} />)}</div></div></section>

    <section className="section"><div className="container"><span className="eyebrow">Obuhvaćene discipline</span><h2>Više vrsta rada, ali jedna odgovorna cjelina.</h2><p className="lead">Oznake ispod ne predstavljaju katalog dodatnih usluga, već discipline koje su u ovom projektu morale biti međusobno usklađene.</p><div className="case-service-tags">{item.services.map((service) => <span key={service}>{service}</span>)}</div><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-dark" href="/radovi/">Pogledaj sve projekte</Link></div></div></section>

    <FinalCta title="Imaš projekat sa više pokretnih djelova?" text="Pošalji osnovni kontekst, rok, učesnike i ono što je već dogovoreno. Prvo ćemo razdvojiti cilj, odgovornosti, zavisnosti i realan obim prve faze." />
  </>
}
