import Link from 'next/link'
import { cases } from '@/data/cases'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { FinalCta } from '@/components/final-cta'
import { HeroShowcase } from '@/components/hero-showcase'
import { HomeServiceDirectory, HomeProjectHighlights, HomeProcessAndFaq } from '@/components/home-sales-sections'
import { JsonLd } from '@/components/json-ld'
import { OfferChooser } from '@/components/sales-offer'
import { HomeQuickChoices, HomeIndustriesPreview } from '@/components/demo-home-choices'
import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { enServices } from '@/data/en'
import { itemListSchema, webPageSchema } from '@/lib/schema'


const seoTitle = 'Marketing agencija Podgorica - kampanje, web i događaji'
const seoDescription = 'Sindikat Studio 83 iz Podgorice kreira sadržaj, vodi digitalne kampanje, pravi sajtove i organizuje događaje i promocije širom Crne Gore.'

export function HomePageContent({locale = 'sr'}: {locale?: SiteLocale}) {
  const t = (sr: string, en: string) => translate(locale, sr, en)
  const href = (value: string) => localeHref(locale, value)
  const english = locale === 'en'
  return (
    <div className="sales-home" lang={english ? "en" : undefined}>
      <JsonLd data={[
        webPageSchema({ name: t(seoTitle,'Creative and production studio in Podgorica'), description: t(seoDescription,'Sindikat Studio 83 creates content, runs digital campaigns, builds websites and delivers events across Montenegro.'), path: english ? '/en/' : '/', image: '/images/brand/og-cover.png' }),
        itemListSchema({
          name: t('Usluge Sindikat Studio 83','Sindikat Studio 83 services'),
          path: english ? '/en/' : '/',
          items: services.map((service, i) => ({ name: english ? enServices[i]?.title || service.shortTitle : service.shortTitle, href: href(`/usluge/${service.slug}/`) })),
        }),
      ]} />

      <section className="demo-hero" aria-label={t("Sindikat Studio 83 - kreativni i produkcijski studio","Sindikat Studio 83 - creative and production studio")}>
        <div className="demo-hero-photo"><HeroShowcase /></div>
        <div className="container demo-hero-content">
          <div className="demo-hero-copy">
            <span className="eyebrow">{t('Nezavisni kreativni i produkcijski studio / Podgorica','Independent creative and production studio / Podgorica')}</span>
            <h1><span>{t('IDEJE.','IDEAS.')}</span><span>{t('LJUDI.','PEOPLE.')}</span><span className="demo-hero-accent">{t('REALIZACIJA.','EXECUTION.')}</span></h1>
            <p className="lead">{t('Vodimo kampanje, snimamo sadržaj, pravimo sajtove i organizujemo događaje. Od prve ideje do posljednjeg detalja - sve drži jedan tim.','We run campaigns, produce content, build websites and organize events. From the first idea to the final detail, one team takes responsibility for delivery.')}</p>
            <div className="button-row demo-hero-actions">
              <Link className="button button-primary" href={href("/kontakt/?izvor=hero")} data-track="hero_contact">{t('Hajde da radimo ↗','Let’s work together ↗')}</Link>
              <Link className="button button-ghost" href={href("/radovi/")} data-track="hero_work">{t('Pogledaj naše radove ↗','Explore our work ↗')}</Link>
            </div>
            <div className="demo-hero-subline">{t('Podgorica · cijela Crna Gora / Jedan tim, više disciplina.','Podgorica · all of Montenegro / One team, multiple disciplines.')}</div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">{t('Ne ostajemo na lijepoj prezentaciji.','More than just a presentation.')}</div>{site.proof.map((item,i) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{english ? ['projects showcased in our portfolio','partners and collaborators','people in our event and field network'][i] || item.label : item.label}</span></div>)}</div></section>

      <HomeQuickChoices locale={locale} />

      <HomeServiceDirectory locale={locale} />

      <HomeProjectHighlights locale={locale} />

      <OfferChooser locale={locale} />

      <HomeProcessAndFaq locale={locale} />

      <HomeIndustriesPreview locale={locale} />

      <FinalCta locale={locale} title={t("Imaš ideju ili problem koji treba riješiti?","Have an idea or a challenge to solve?")} text={t("Napiši nam šta želiš da postigneš i kada ti treba. Predložićemo konkretnu uslugu, obim posla i sljedeći korak.","Tell us what you want to achieve and your timeline. We will recommend the right service, scope and next step.")} label={t("Pošalji brief","Send a brief")} />
    </div>
  )
}

