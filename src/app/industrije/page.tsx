import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { IndustryCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { industries } from '@/data/industries'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Digitalni marketing i realizacija po industrijama u Crnoj Gori'
const seoDescription = 'Marketing, web, aktivacije i operativna realizacija za turizam, ugostiteljstvo, retail, događaje, premium usluge i poslodavce u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/industrije/',
})

export default function IndustriesPage() {
  const crumbs = [{ label: 'Industrije', href: '/industrije/' }]
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: seoTitle, description: seoDescription, path: '/industrije/', type: 'CollectionPage' }),
      itemListSchema({
        name: 'Industrije koje pokriva Sindikat Studio 83',
        path: '/industrije/',
        items: industries.map((item) => ({ name: item.title, href: `/industrije/${item.slug}/` })),
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Industrije</span><h1>Isti kanal ne radi isto u svakoj industriji.</h1><p className="lead">Sezona, lokacija, vrijednost ponude, brzina odgovora, regulisana komunikacija i operativni kapacitet mijenjaju način na koji se kampanja, sajt ili aktivacija moraju postaviti.</p></div><aside className="page-hero-aside"><strong>Industrijski kontekst utiče na</strong><ul><li>trenutak pokretanja i trajanje kampanje</li><li>poruku, ponudu i nivo povjerenja</li><li>način mjerenja i obrade kontakta</li><li>ljude, lokacije i logistiku realizacije</li></ul></aside></div></div></section>

    <section className="section"><div className="container"><div className="industry-grid">{industries.map((item) => <IndustryCard key={item.slug} item={item} />)}</div></div></section>

    <section className="section section-dark"><div className="container manifesto"><div><span className="eyebrow">Naš princip</span><h2>Ne prodajemo industrijsku ekspertizu samo kroz terminologiju.</h2></div><div className="manifesto-copy">Vrijednost postoji kada razumijemo realan tok: ko donosi odluku, gdje korisnik odustaje, koliko brzo tim odgovara, šta se dešava na lokaciji i koji rezultat klijent zaista može da obradi. <strong>Ako nemamo praktičnu prednost u tom procesu, to kažemo prije ponude.</strong></div></div></section>

    <FinalCta title="Tvoja industrija nije na listi?" text="Pošalji problem, cilj i način na koji danas dolaziš do kupca, gosta ili kandidata. Reći ćemo gdje možemo preuzeti stvarnu odgovornost, a gdje bi drugi partner bio bolji izbor." />
  </>
}
