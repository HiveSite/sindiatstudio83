import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { OfferAreas, OfferChooser } from '@/components/sales-offer'
import { services } from '@/data/services'
import { serviceProducts } from '@/data/service-products'
import { enServices } from '@/data/en'
import { enProducts } from '@/data/en-products'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'


const seoTitle = 'Usluge digitalnog marketinga, weba, događaja i promo timova u Crnoj Gori'
const seoDescription = 'Performance marketing, web i digitalni proizvodi, aktivacije, događaji, sadržaj i recruitment kampanje iz Podgorice za klijente širom Crne Gore.'

export function ServicesPageContent({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const href=(value:string)=>localeHref(locale,value)
  const english=locale==='en'
  const crumbs = [{ label: t('Usluge','Services'), href: href('/usluge/') }]
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: t(seoTitle,'Marketing, websites, events and promotional teams in Montenegro'), description: t(seoDescription,'Digital marketing, digital products, activations, events, creative content and recruitment campaigns from Podgorica.'), path: english ? '/en/usluge/' : '/usluge/', type: 'CollectionPage' }),
      itemListSchema({
        name: t('Usluge Sindikat Studio 83','Sindikat Studio 83 services'),
        path: english ? '/en/usluge/' : '/usluge/',
        items: services.map((service,i) => ({ name: english ? enServices[i].title : service.shortTitle, href: href(`/usluge/${service.slug}/`) })),
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Usluge","Services")}</span><h1>{t("Reci nam šta želiš da postigneš. Pronađi pravu uslugu.","Start with your goal. Find the right service.")}</h1><p className="lead">{t("Od Instagram i Google oglasa do video sadržaja, web projekata i događaja: pogledaj šta dobijate, početne cijene i primjere realizacije.","From Instagram and Google ads to video content, websites and events: see what is included, starting prices and examples of our work.")}</p></div><aside className="page-hero-aside"><strong>{t("Kako da koristite ovu stranicu","How to use this page")}</strong><ul><li>{t("izaberite kategoriju najbližu problemu","choose the category closest to your challenge")}</li><li>{t("pogledajte konkretne proizvode i početne cijene","see specific products and starting prices")}</li><li>{t("otvorite detalje proizvoda koji vam odgovara","open details of the right product")}</li><li>{t("pošaljite brief ako obim nije standardan","send a brief if you need a custom scope")}</li></ul></aside></div></div></section>

    <OfferAreas locale={locale} />

    <section className="section section-dark"><div className="container">
      <div className="service-rail-head"><div><span className="eyebrow">{t("Sve glavne usluge","All main services")}</span><h2>{t("Pogledaj šta radimo i koliko košta početak.","See what we do and what it costs to get started.")}</h2></div></div>
      <div className="service-rail services-index-rail" role="region" aria-label={t('Sve usluge','All services')} tabIndex={0}>
        {services.map((service) => {
          const products = (english ? enProducts : serviceProducts)[service.slug] || []
          return <Link className="service-rail-card" key={service.slug} href={href(`/usluge/${service.slug}/`)}>
            <span>{english ? 'OUR SERVICES' : service.eyebrow}</span>
            <h3>{english ? enServices.find(x=>x.slug===service.slug)?.title || service.shortTitle : service.shortTitle}</h3>
            <p>{english ? enServices.find(x=>x.slug===service.slug)?.summary || service.summary : service.summary}</p>
            <div className="service-rail-price"><small>{t("Početni okvir","Starting price")}</small><strong>{products[0]?.price || t('po ponudi','on request')}</strong></div>
            <b>{t("Pogledaj proizvode i cijene ↗","View products and pricing ↗")}</b>
          </Link>
        })}
      </div>
    </div></section>

    <section className="section section-light"><div className="container">
      <div className="service-rail-head"><div><span className="eyebrow">{t("Oglašavanje po kanalu","Advertising by channel")}</span><h2>{t("Treba ti baš Instagram ili Google oglašavanje?","Need specifically Instagram or Google advertising?")}</h2></div></div>
      <div className="channel-links-grid">
        <Link href={href("/usluge/meta-ads/")} className="channel-link-card"><span>META ADS</span><h3>{t("Instagram i Facebook oglasi","Instagram and Facebook advertising")}</h3><p>{t("Strategija, kreative, mjerenje i optimizacija kampanja za relevantne upite.","Strategy, creative assets, tracking and optimization focused on relevant enquiries.")}</p><strong>{t("Detalji Meta Ads usluge ↗","Meta Ads service details ↗")}</strong></Link>
        <Link href={href("/usluge/google-ads/")} className="channel-link-card"><span>GOOGLE ADS</span><h3>{t("Oglasi na Google pretrazi","Google Search ads")}</h3><p>{t("Pretrage sa kupovnom namjerom, relevantne odredišne stranice i praćenje konverzija.","High-intent searches, relevant landing pages and conversion tracking.")}</p><strong>{t("Detalji Google Ads usluge ↗","Google Ads service details ↗")}</strong></Link>
      </div>
    </div></section>

    <section className="section section-light"><div className="container"><div className="service-rail-head"><div><span className="eyebrow">{t('Provjeri kako radimo','See our work')}</span><h2>{t('Prije ponude, pogledaj stvarne projekte.','See real projects before requesting a quote.')}</h2><p>{t('Na svakom projektu prikazujemo našu ulogu, izvedene aktivnosti i rezultat koji možemo potkrijepiti.','Each project shows our actual role, deliverables and outcomes we can substantiate.')}</p></div><Link className="button button-dark" href={href('/radovi/')}>{t('Pogledaj portfolio','Explore projects')}</Link></div></div></section>

    <section className="section local-service-links"><div className="container"><div className="home-sales-heading"><div><span className="eyebrow">{t('Lokalno iskustvo','Local delivery')}</span><h2>{t('Marketing u Podgorici. Projekti širom Crne Gore.','Marketing in Podgorica. Projects across Montenegro.')}</h2></div><p>{t('Za lokalne kampanje važni su stvarna ponuda, publika, dostupnost i operativa. Biramo kanale i obim prema gradu i cilju, ne prema univerzalnom paketu.','Local campaigns depend on the real offer, audience, availability and execution. We adapt channels and scope to the market and goal, rather than using one universal package.')}</p></div><div className="local-service-grid"><Link href={href('/usluge/meta-ads/')}><h3>{t('Instagram i Facebook oglasi u Crnoj Gori','Instagram and Facebook ads in Montenegro')}</h3><p>{t('Publika, kreative, praćenje upita i optimizacija kampanja.','Audience, creatives, lead tracking and campaign optimization.')}</p><span>{t('Meta Ads usluga','Explore Meta Ads')} ↗</span></Link><Link href={href('/usluge/google-ads/')}><h3>{t('Google oglašavanje u Podgorici','Google advertising in Podgorica')}</h3><p>{t('Pretrage sa kupovnom namjerom, odredišne stranice i kontrola troškova.','High-intent searches, landing pages and spend controls.')}</p><span>{t('Google Ads usluga','Explore Google Ads')} ↗</span></Link><Link href={href('/usluge/aktivacije-i-eventi/')}><h3>{t('Događaji i brend aktivacije u Crnoj Gori','Events and brand activations in Montenegro')}</h3><p>{t('Koordinacija ljudi, logistike, produkcije i realizacije na lokaciji.','Coordination of people, logistics, production and on-site delivery.')}</p><span>{t('Aktivacije i događaji','Explore events and activations')} ↗</span></Link></div></div></section>

    <OfferChooser locale={locale} />

    <FinalCta locale={locale} title={t('Ne znaš odakle da kreneš?','Not sure where to start?')} text={t('Napiši šta ti treba, kada bi krenuo i koji budžet imaš na umu. Predložićemo najpraktičnije rješenje ili napraviti ponudu po mjeri.','Tell us what you need, when you would like to start and your approximate budget. We will suggest a practical option or create a tailored proposal.')} label={t('Pošalji upit','Send enquiry')} />
  </>
}

