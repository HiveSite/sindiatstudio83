import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { IndustryCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { industries } from '@/data/industries'
import { enIndustries } from '@/data/en'
import { localizedIndustry } from '@/lib/localized-data'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Digitalni marketing i realizacija po industrijama u Crnoj Gori'
const seoDescription = 'Marketing, web, aktivacije i operativna realizacija za turizam, ugostiteljstvo, retail, događaje, premium usluge i poslodavce u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/industrije/',
})

export function IndustriesPageContent({locale='sr'}:{locale?:SiteLocale}) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(value:string)=>localeHref(locale,value)
  const displayIndustries=industries.map(i=>localizedIndustry(i.slug,locale)!)
  const crumbs = [{ label: t('Industrije','Industries'), href: href('/industrije/') }]
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: t(seoTitle,'Industry-specific marketing and execution in Montenegro'), description: t(seoDescription,'Marketing, websites, events and activation campaigns for hospitality, retail, premium services and employers.'), path: en?'/en/industrije/':'/industrije/', type: 'CollectionPage' }),
      itemListSchema({
        name: t('Industrije koje pokriva Sindikat Studio 83','Industries served by Sindikat Studio 83'),
        path: en?'/en/industrije/':'/industrije/',
        items: displayIndustries.map((item) => ({ name: item.title, href: href(`/industrije/${item.slug}/`) })),
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Industrije","Industries")}</span><h1>{t("Isti kanal ne radi isto u svakoj industriji.","The same channel works differently across industries.")}</h1><p className="lead">{t("Sezona, lokacija, vrijednost ponude, brzina odgovora, regulisana komunikacija i operativni kapacitet mijenjaju način na koji se kampanja, sajt ili aktivacija moraju postaviti.","Seasonality, location, offer value, response time, regulatory context and operational capacity change how a campaign, website or activation should be planned.")}</p></div><aside className="page-hero-aside"><strong>{t("Industrijski kontekst utiče na","Industry context affects")}</strong><ul><li>{t("trenutak pokretanja i trajanje kampanje","campaign timing and duration")}</li><li>{t("poruku, ponudu i nivo povjerenja","messaging, offers and trust")}</li><li>{t("način mjerenja i obrade kontakta","tracking and lead handling")}</li><li>{t("ljude, lokacije i logistiku realizacije","teams, locations and execution logistics")}</li></ul></aside></div></div></section>

    <section className="section"><div className="container"><div className="industry-grid">{displayIndustries.map((item) => <IndustryCard key={item.slug} item={item} locale={locale} />)}</div></div></section>

    <section className="section section-dark"><div className="container manifesto"><div><span className="eyebrow">{t("Naš princip","Our principle")}</span><h2>{t("Ne prodajemo industrijsku ekspertizu samo kroz terminologiju.","Industry expertise takes more than terminology.")}</h2></div><div className="manifesto-copy">{t('Vrijednost postoji kada razumijemo realan tok: ko donosi odluku, gdje korisnik odustaje, koliko brzo tim odgovara, šta se dešava na lokaciji i koji rezultat klijent zaista može da obradi. ','Value comes from understanding the real journey: who makes decisions, where customers drop off, how fast teams respond, what happens on-site and which results the client can actually handle. ')}<strong>{t('Ako nemamo praktičnu prednost u tom procesu, to kažemo prije ponude.','If we cannot offer a practical advantage, we say so before proposing a project.')}</strong></div></div></section>

    <FinalCta locale={locale} title={t('Tvoja industrija nije na listi?','Your industry is not listed?')} text={t('Pošalji problem, cilj i način na koji danas dolaziš do kupca, gosta ili kandidata. Reći ćemo gdje možemo preuzeti stvarnu odgovornost, a gdje bi drugi partner bio bolji izbor.','Tell us the challenge, objective and how you currently reach customers, guests or candidates. We will explain where we can take responsibility and where another partner may be better.')} />
  </>
}

export default function IndustriesPage(){return <IndustriesPageContent locale="sr" />}
