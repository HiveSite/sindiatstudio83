import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CaseCoverPlaceholder, CaseMediaPlaceholder } from '@/components/case-media'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { caseGalleryOverrides } from '@/data/case-gallery-overrides'
import { cases, caseBySlug } from '@/data/cases'
import { serviceBySlug } from '@/data/services'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { getPublicCaseStudy } from '@/lib/public-case'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'
import { managedThumbnail } from '@/lib/studio83-media'

export const dynamicParams = false
export function generateStaticParams() { return cases.map((item) => ({ slug: item.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const baseItem = caseBySlug[slug]
  if (!baseItem) return {}
  const item = getPublicCaseStudy(baseItem)
  return createMetadata({
    title: `${item.title} - case study`,
    description: item.summary,
    path: `/radovi/${item.slug}/`,
    image: item.socialImage?.src,
    imageAlt: item.socialImage?.alt,
  })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const baseItem = caseBySlug[slug]
  if (!baseItem) notFound()
  const galleryItem = caseGalleryOverrides[slug]
    ? { ...baseItem, gallery: caseGalleryOverrides[slug] }
    : baseItem
  const publicItem = getPublicCaseStudy(galleryItem)
  const managedCover = managedThumbnail(publicItem.slug, publicItem.coverImage)
  const item = managedCover === publicItem.coverImage ? publicItem : { ...publicItem, coverImage: managedCover }
  const path = `/radovi/${item.slug}/`
  const crumbs = [{ label: 'Radovi', href: '/radovi/' }, { label: item.title, href: path }]
  const metrics = item.metrics || []
  const linkedServices = item.serviceSlugs.map((serviceSlug) => serviceBySlug[serviceSlug]).filter(Boolean)

  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({
        name: `${item.title} - case study`,
        description: item.summary,
        path,
        image: item.socialImage?.src || item.coverImage?.src,
        about: linkedServices.map((service) => ({ name: service.shortTitle, url: `/usluge/${service.slug}/` })),
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${site.domain}${path}#case-study`,
        name: item.title,
        description: item.summary,
        creator: { '@id': `${site.domain}/#organization` },
        publisher: { '@id': `${site.domain}/#organization` },
        url: `${site.domain}${path}`,
        inLanguage: site.locale,
        image: item.socialImage ? `${site.domain}${item.socialImage.src}` : item.coverImage ? `${site.domain}${item.coverImage.src}` : undefined,
        about: linkedServices.map((service) => ({ '@type': 'Service', name: service.shortTitle, url: `${site.domain}/usluge/${service.slug}/` })),
        isPartOf: { '@id': `${site.domain}/#website` },
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

    <section className="section"><div className="container"><span className="eyebrow">Obuhvaćene discipline</span><h2>Više vrsta rada, ali jedna odgovorna cjelina.</h2><p className="lead">Oznake ispod pokazuju usluge koje su u projektu morale biti međusobno usklađene.</p><div className="case-service-tags">{linkedServices.map((service) => <Link href={`/usluge/${service.slug}/`} key={service.slug}>{service.shortTitle}</Link>)}</div><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-dark" href="/radovi/">Pogledaj sve projekte</Link></div></div></section>

    <FinalCta title="Imaš projekat sa više pokretnih djelova?" text="Pošalji osnovni kontekst, rok, učesnike i ono što je već dogovoreno. Prvo ćemo razdvojiti cilj, odgovornosti, zavisnosti i realan obim prve faze." />
  </>
}
