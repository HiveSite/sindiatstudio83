import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { WorkFilter } from '@/components/work-filter'
import { cases } from '@/data/cases'
import { getPublicCaseStudy } from '@/lib/public-case'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'


import { translatedCases } from '@/data/localized-cases'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
const seoTitle = 'Portfolio - digitalni proizvodi, kampanje, eventi i promo timovi'
const seoDescription = 'Case studies Sindikat Studio 83: digitalne platforme, kampanje, aktivacije, promo timovi, događaji, web projekti i operativni sistemi u Crnoj Gori.'

export function WorksPageContent({locale='sr'}:{locale?:SiteLocale}) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(v:string)=>localeHref(locale,v)
  const crumbs = [{ label: t('Radovi','Projects'), href: href('/radovi/') }]
  const publicCases = (en?translatedCases:cases).map(getPublicCaseStudy)
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: t(seoTitle,'Portfolio of digital products, campaigns, events and teams'), description: t(seoDescription,'Case studies featuring digital platforms, events, activations, websites and operational projects in Montenegro.'), path: href('/radovi/'), type: 'CollectionPage' }),
      itemListSchema({
        name: 'Sindikat Studio 83 case studies',
        path: href('/radovi/'),
        items: publicCases.map((item) => ({ name: item.title, href: href(`/radovi/${item.slug}/`) })),
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Radovi","Projects")}</span><h1>{t("Pogledaj šta smo stvarno napravili.","See what we have actually delivered.")}</h1><p className="lead">{t("Digitalne platforme, događaji, promo timovi i kampanje. Fotografije i stvarni primjeri pokazuju našu ulogu, isporuke i potvrđene rezultate, gdje su podaci dostupni.","Digital platforms, events, promotional teams and campaigns. Real images and examples show our role, deliverables and verified results where data is available.")}</p></div><aside className="page-hero-aside"><strong>{t("Šta tražiti u case studyju","What to look for in a case study")}</strong><ul><li>{t("koji problem je projekat rješavao","the problem the project addressed")}</li><li>{t("šta je Sindikat konkretno preuzeo","what Sindikat was responsible for")}</li><li>{t("koje discipline su morale raditi zajedno","which disciplines needed to work together")}</li><li>{t("šta je ostalo upotrebljivo nakon realizacije","what remained useful after delivery")}</li></ul></aside></div></div></section>

    <section className="section section-sm"><div className="container proof-first-portfolio"><strong>{t('Bez generičkih referenci.','No generic references.')}</strong><p>{t('Otvorite projekat i pogledajte kontekst, konkretan rad, galeriju i sve brojke koje možemo odgovorno navesti.','Open a project to explore its context, actual work, gallery and any figures we can responsibly verify.')}</p></div></section>

    <section className="section"><div className="container manifesto"><div><span className="eyebrow">{t("Hijerarhija portfolija","Portfolio structure")}</span><h2>{t("Prvo prikazujemo sisteme sa najvećim obimom odgovornosti.","We showcase the projects with the broadest responsibilities first.")}</h2></div><div className="manifesto-copy">{t("Digitalni proizvodi, višemjesečni programi i operativni sistemi dolaze prvi jer najbolje pokazuju način rada. Pojedinačne aktivacije, događaji i mini-sajtovi zatim pokazuju kako se isti standard primjenjuje na kraće i specifičnije formate. ","Digital products, multi-month programmes and operational systems come first because they best illustrate how we work. Individual activations, events and microsites show how those standards also apply to smaller and more specific projects. ")}<strong>{t("Filter mijenja temu, ali ne mijenja osnovni redosljed projekata.","Filtering changes the topic, but not the underlying order of projects.")}</strong></div></div></section>

    <section className="section section-dark" id="projekti"><div className="container"><WorkFilter items={publicCases} locale={locale} /></div></section>
    <FinalCta locale={locale} title={t('Treba ti sličan nivo koordinacije, ali ne isti projekat?','Need similar coordination for a different project?')} text={t('Pošalji cilj, rok, lokacije i timove koji su već uključeni. Izdvojićemo logiku koja se može prenijeti i jasno označiti šta mora biti prilagođeno tvojoj situaciji.','Share your objective, timeline, locations and involved teams. We will identify what can be reused and what needs to be tailored to your situation.')} />
  </>
}
