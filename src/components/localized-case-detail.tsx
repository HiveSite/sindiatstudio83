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
import { getPublicCaseStudy } from '@/lib/public-case'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'
import { managedThumbnail } from '@/lib/studio83-media'


import { localizedCase } from '@/data/localized-cases'
import { localizedService } from '@/lib/localized-data'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
export function CaseStudyPageContent({slug,locale='sr'}:{slug:string;locale?:SiteLocale}) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(v:string)=>localeHref(locale,v)
  const baseItem = localizedCase(slug,locale)
  if (!baseItem) notFound()
  const galleryItem = caseGalleryOverrides[slug]
    ? { ...baseItem, gallery: caseGalleryOverrides[slug] }
    : baseItem
  const publicBase = getPublicCaseStudy(galleryItem)
  const publicItem=en?{...publicBase,...baseItem,gallery:publicBase.gallery}:publicBase
  const managedCover = managedThumbnail(publicItem.slug, publicItem.coverImage)
  const item = managedCover === publicItem.coverImage ? publicItem : { ...publicItem, coverImage: managedCover }
  const path = href(`/radovi/${item.slug}/`)
  const crumbs = [{ label: t('Radovi','Projects'), href: href('/radovi/') }, { label: item.title, href: path }]
  const metrics = item.metrics || []
  const linkedServices = item.serviceSlugs.map((serviceSlug) => localizedService(serviceSlug,locale)).filter((service): service is NonNullable<typeof service> => service !== undefined)

  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({
        name: `${item.title} - case study`,
        description: item.summary,
        path,
        image: item.socialImage?.src || item.coverImage?.src,
        about: linkedServices.map((service) => ({ name: service.shortTitle, url: href(`/usluge/${service.slug}/`) })),
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
        inLanguage: en?'en':site.locale,
        image: item.socialImage ? `${site.domain}${item.socialImage.src}` : item.coverImage ? `${site.domain}${item.coverImage.src}` : undefined,
        about: linkedServices.map((service) => ({ '@type': 'Service', name: service.shortTitle, url: `${site.domain}${href(`/usluge/${service.slug}/`)}` })),
        isPartOf: { '@id': `${site.domain}/#website` },
      },
    ]} />

    <section className="page-hero">
      <div className="container">
        <Breadcrumbs items={crumbs} locale={locale} />
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

    <section className="section"><div className="container manifesto"><div><span className="eyebrow">{t("Naša uloga","Our role")}</span><h2>{t("Šta je Sindikat držao pod direktnom odgovornošću.","What Sindikat was directly responsible for.")}</h2></div><div className="manifesto-copy">{item.role}</div></div></section>

    <section className="section"><div className="container case-story"><article className="story-card"><span>{t("01 - Kontekst","01 - Context")}</span><h2>{t("Šta je trebalo riješiti","The challenge")}</h2><p>{item.challenge}</p></article><article className="story-card"><span>{t("02 - Sistem","02 - System")}</span><h2>{t("Kako smo postavili realizaciju","Our approach")}</h2><p>{item.solution}</p></article><article className="story-card"><span>{t("03 - Ishod","03 - Outcome")}</span><h2>{t("Šta je projekat omogućio","What the project made possible")}</h2><p>{item.result}</p></article></div></section>

    <section className="section section-light"><div className="container"><div className="section-heading"><div><span className="eyebrow">{t("Obim projekta","Project scope")}</span><h2>{t("Konkretne odgovornosti i isporuke.","Responsibilities and deliverables")}</h2></div><p>{t("Ovaj pregled jasno odvaja našu odgovornost od ukupnog projekta i pokazuje koje smo konkretne blokove držali pod direktnom kontrolom.","This breakdown separates our responsibilities from the overall project and shows what we directly managed.")}</p></div><div className="case-scope-grid">{item.scope.map((scope, index) => <article key={scope}><span>{String(index + 1).padStart(2, '0')}</span><strong>{scope}</strong></article>)}</div></div></section>

    {item.subprojects?.length ? <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">{t("Primjene i podprojekti","Applications and subprojects")}</span><h2>{t("Jedan operativni princip, više konkretnih realizacija.","One operating principle applied across different projects.")}</h2></div><p>{t("Tim, komunikacija, funkcionalnosti i tok prilagođavaju se svakoj situaciji, dok standard odgovornosti ostaje isti.","Teams, communication, functions and workflows adapt to each situation while accountability remains consistent.")}</p></div><div className="case-subproject-grid">{item.subprojects.map((subproject) => <article key={subproject.title}><span className="case-subproject-mark" /><h3>{subproject.title}</h3><p>{subproject.summary}</p>{subproject.link ? <a href={subproject.link.href} target="_blank" rel="noreferrer" data-track="case_subproject_click">{subproject.link.label} ↗</a> : null}</article>)}</div></div></section> : null}

    <section className="section section-dark"><div className="container"><div className="section-heading"><div><span className="eyebrow">{t("Vizuelni pregled","Visual gallery")}</span><h2>{t("Ključni momenti, ekrani i detalji koji najbolje objašnjavaju projekat.","The key moments, screens and details that best explain the project.")}</h2></div><p>{t("Galerija prikazuje sve dostavljene materijale za projekat, uz SEO nazive, optimizovane formate i jasan opis uloge svakog kadra ili ekrana.","The gallery shows available project materials with descriptive image labels, optimized formats and context for each photograph or screen.")}</p></div><div className="case-media-grid">{item.gallery.map((media,index) => <CaseMediaPlaceholder key={`${media.kind}-${media.label}`} item={media} displayLabel={en ? `${item.title} - project image ${index+1}` : undefined} />)}</div></div></section>

    <section className="section"><div className="container"><span className="eyebrow">{t("Obuhvaćene discipline","Services involved")}</span><h2>{t("Više vrsta rada, ali jedna odgovorna cjelina.","Multiple disciplines, one accountable team.")}</h2><p className="lead">{t("Oznake ispod pokazuju usluge koje su u projektu morale biti međusobno usklađene.","The services below had to work together during delivery.")}</p><div className="case-service-tags">{linkedServices.map((service) => <Link href={href(`/usluge/${service.slug}/`)} key={service.slug}>{service.shortTitle}</Link>)}</div><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-dark" href={href("/radovi/")}>{t("Pogledaj sve projekte","View all projects")}</Link></div></div></section>

    <FinalCta locale={locale} title={t('Imaš projekat sa više pokretnih djelova?','Planning a project with many moving parts?')} text={t('Pošalji osnovni kontekst, rok, učesnike i ono što je već dogovoreno. Prvo ćemo razdvojiti cilj, odgovornosti, zavisnosti i realan obim prve faze.','Send the project context, timeline, participants and existing agreements. We will clarify the objective, responsibilities, dependencies and a realistic first-phase scope.')} />
  </>
}
