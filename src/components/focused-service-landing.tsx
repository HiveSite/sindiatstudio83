import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, serviceSchema, webPageSchema } from '@/lib/schema'
import { serviceProducts } from '@/data/service-products'
import { enProducts } from '@/data/en-products'
import {localeHref,translate,type SiteLocale} from '@/lib/locale'

export type FocusedServiceData = {
  path: string
  eyebrow: string
  title: string
  description: string
  intro: string
  problems: readonly string[]
  deliverables: readonly string[]
  stages: readonly { name: string; text: string }[]
  faq: readonly { question: string; answer: string }[]
}

export function FocusedServiceLanding({ data,locale='sr' }: { data: FocusedServiceData;locale?:SiteLocale }) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(v:string)=>localeHref(locale,v)
  const products = (en?enProducts:serviceProducts)['performance-marketing'] || []
  const planningProduct = products[0]
  const crumbs = [
    { label: t('Usluge','Services'), href: href('/usluge/') },
    { label: 'Performance marketing', href: href('/usluge/performance-marketing/') },
    { label: data.eyebrow, href: href(data.path) },
  ]
  return <div className="focused-service">
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: data.title, description: data.description, path: href(data.path) }),
      serviceSchema({ name: data.title, description: data.description, path: href(data.path), serviceType: data.eyebrow }),
    ]} />
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={crumbs} locale={locale}/>
      <div className="page-hero-grid">
        <div><span className="eyebrow">{data.eyebrow} / {t('Podgorica + Crna Gora','Podgorica + Montenegro')}</span><h1>{data.title}</h1>
        <p className="lead">{data.intro}</p>
        <div className="button-row" style={{marginTop:26}}>
          <Link className="button button-primary" href={href(`/kontakt/?usluga=performance-marketing&cilj=${encodeURIComponent(data.eyebrow)}&izvor=seo-usluga`)}>{t("Zatraži ponudu","Request a proposal")}</Link>
          <a className="button button-ghost" href="#sta-dobijate">{t("Šta dobijate","What you get")}</a>
        </div></div>
        <aside className="service-price-anchor"><span>{t('Prvi korak','First step')} - {planningProduct?.name || t('Procjena','Assessment')}</span><strong>{planningProduct?.price || t('Po ponudi','On request')}</strong><p>{t("Ovo je cijena početne analize, a ne vođenja oglasa. Postavku kampanje, mjesečni rad i budžet za reklame dogovaramo odvojeno.","This is the starting price for an initial review, not ongoing advertising management. Campaign setup, monthly management and media spend are agreed separately.")}</p><Link href={href("/cijene/#performance-marketing")} className="text-link">{t("Vidi sve opcije i cijene ↗","See all options and prices ↗")}</Link></aside>
      </div>
    </div></section>
    <section className="section section-dark"><div className="container focused-columns">
      <div><span className="eyebrow">{t("Zašto ova usluga","Why this service")}</span><h2>{t("Gdje najčešće nastaje problem?","Where do problems usually begin?")}</h2></div>
      <ul>{data.problems.map(t=><li key={t}>{t}</li>)}</ul>
    </div></section>
    <section className="section section-light" id="sta-dobijate"><div className="container">
      <span className="eyebrow">{t("Obim saradnje","Scope of work")}</span><h2>{t("Šta konkretno radimo?","What do we deliver?")}</h2>
      <div className="focused-deliverables">{data.deliverables.map((t,i)=><article key={t}><span>{String(i+1).padStart(2,'0')}</span><h3>{t}</h3></article>)}</div>
      <p className="focused-disclaimer">{t("Dogovaramo šta je uključeno i koliko košta prije nego što počnemo.","We agree what is included and how much it costs before work begins.")}</p>
    </div></section>
    <section className="section section-dark"><div className="container">
      <span className="eyebrow">{t("Kako radimo","How we work")}</span><h2>{t("Od prvog razgovora do rezultata.","From the first conversation to measurable results.")}</h2>
      <div className="focused-steps">{data.stages.map((step,i)=><article key={step.name}><span>0{i+1}</span><h3>{step.name}</h3><p>{step.text}</p></article>)}</div>
    </div></section>
    <section className="section"><div className="container focused-columns">
      <div><span className="eyebrow">{t("Najčešća pitanja","Frequently asked questions")}</span><h2>{t("Prije saradnje.","Before we work together.")}</h2><Link className="text-link" href={href("/usluge/performance-marketing/")}>{t("Sve performance usluge ↗","All performance services ↗")}</Link></div>
      <div className="focused-faq">{data.faq.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
    </div></section>
    <FinalCta locale={locale} title={t('Treba ti oglašavanje koje ima jasan cilj?','Need advertising with a clear objective?')} text={t('Napiši šta želiš da promovišeš, kome se obraćaš i kada želiš da počneš. Predložićemo ti prvi korak i realan obim.','Tell us what you want to promote, who you want to reach and when you want to start. We will recommend a realistic first step and scope.')} label={t('Pošalji brief','Send a brief')}/>
  </div>
}
