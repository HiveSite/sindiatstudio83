import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CasePreviewCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { caseBySlug } from '@/data/cases'
import { localizedCase } from '@/data/localized-cases'
import { industries, industryBySlug } from '@/data/industries'
import { serviceBySlug } from '@/data/services'
import { localizedIndustry, localizedService } from '@/lib/localized-data'
import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'


export function IndustryPageContent({slug,locale='sr'}:{slug:string;locale?:SiteLocale}) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(value:string)=>localeHref(locale,value)
  const item=localizedIndustry(slug,locale)
  if (!item) notFound()
  const path = href(`/industrije/${item.slug}/`)
  const crumbs = [{ label: t('Industrije','Industries'), href: href('/industrije/') }, { label: item.title, href: path }]
  const relatedSlugs = item.slug === 'poslodavci-i-zaposljavanje'
    ? ['recruitment-kampanje', 'performance-marketing', 'web-i-konverzije']
    : item.slug === 'retail-i-fmcg' || item.slug === 'eventi-i-venue'
      ? ['aktivacije-i-eventi', 'sadrzaj-za-kampanje', 'performance-marketing']
      : ['performance-marketing', 'web-i-konverzije', 'sadrzaj-za-kampanje']
  const relatedServices = relatedSlugs.map((value) => localizedService(value,locale)).filter((service): service is NonNullable<typeof service> => service !== undefined)
  const relatedCases = item.caseSlugs.map((value) => localizedCase(value,locale)).filter((project):project is NonNullable<typeof project> => project !== undefined)

  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({
        name: `${item.title} - ${t('marketing i realizacija u Crnoj Gori','marketing and delivery in Montenegro')}`,
        description: item.summary,
        path,
        about: [
          { name: item.title, url: path },
          ...relatedServices.map((service) => ({ name: service.shortTitle, url: href(`/usluge/${service.slug}/`) })),
        ],
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Industrija","Industry")}</span><h1>{item.title}</h1><p className="lead">{item.summary}</p><div className="button-row" style={{ marginTop: 30 }}><Link className="button button-primary" href={href(`/kontakt/?industrija=${item.slug}`)} data-track="industry_lead">{item.cta}</Link></div></div><aside className="page-hero-aside"><strong>{t("Najčešći problemi","Common challenges")}</strong><ul>{item.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></aside></div></div></section>

    <section className="section"><div className="container dual-list"><article className="list-panel"><span className="eyebrow">{t("Dobar fit","Best suited for")}</span><h2>{t("Kada naš model najčešće ima smisla.","Where our approach works best.")}</h2><ul>{item.bestFor.map((value) => <li key={value}>{value}</li>)}</ul></article><article className="list-panel list-panel-solutions"><span className="eyebrow">{t("Šta povezujemo","What we connect")}</span><h2>{t("Blokovi koji rješavaju stvarni tok, ne samo vidljivost.","Building blocks that solve real workflows, not just visibility.")}</h2><ul>{item.solutions.map((solution) => <li key={solution}>{solution}</li>)}</ul></article></div></section>

    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">{t("Pravi trenutak","Timing matters")}</span><h2>{t("Vrijeme pokretanja je dio strategije.","Timing is part of the strategy.")}</h2><p className="lead">{item.timing}</p></div><div className="step-list">{item.successSignals.map((signal, index) => <div className="step" key={signal}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{t("Signal uspjeha","Success indicator")}</h3><p>{signal}</p></div></div>)}</div></div></section>

    <section className="section"><div className="container"><SectionHeading eyebrow={t("Preporučeni blokovi","Recommended services")} title={t("Usluge koje najčešće imaju smisla za ovu industriju.","Services usually most relevant to this industry.")} text={t("Ovo nije obavezni paket. Konačni obim zavisi od cilja, sezone, kapaciteta, postojećeg sistema i odgovornosti koje klijent želi da zadrži.","These are not mandatory packages. Scope depends on goals, seasonality, resources, existing systems and responsibilities.")} /><div className="related-grid">{relatedServices.map((service) => <article className="related-card" key={service.slug}><h3>{service.shortTitle}</h3><p>{service.summary}</p><Link href={href(`/usluge/${service.slug}/`)}>{t("Pogledaj uslugu ↗","Explore service ↗")}</Link></article>)}</div></div></section>

    {relatedCases.length ? <section className="section section-light"><div className="container"><SectionHeading eyebrow={t("Povezani projekti","Related projects")} title={t("Kako se sličan kontekst pojavljuje u stvarnoj realizaciji.","How similar challenges appear in real projects.")} text={t("Projekti nijesu identične šeme, ali pokazuju kako povezujemo digitalni tok, sadržaj, ljude, lokacije i operativnu odgovornost.","Projects differ, but demonstrate how we connect digital journeys, content, people, locations and accountability.")} /><div className="case-preview-grid">{relatedCases.map((project) => <CasePreviewCard key={project.slug} item={project} locale={locale} />)}</div></div></section> : null}

    <FinalCta locale={locale} title={en ? item.cta+' without unnecessary full-service packages.' : item.cta+' bez nepotrebnog full-service paketa.'} text={t('Pošalji cilj, sezonu ili rok, lokacije i ono što već postoji. Predložićemo prvi obim koji može dati stvarnu vrijednost i označiti šta mora biti spremno prije početka.','Send your objective, season or timeline, locations and existing resources. We will recommend an achievable initial scope and identify prerequisites.')} />
  </>
}

