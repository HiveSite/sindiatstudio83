import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ServiceCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { EngagementModels, OfferAreas, OfferChooser } from '@/components/sales-offer'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/data/services'
import { breadcrumbSchema } from '@/lib/schema'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Usluge - kampanje, web, aktivacije i timovi',
  description: 'Izaberite cilj: kampanje i rast, web i digitalni proizvodi, aktivacije i eventi ili timovi i angažmani. Studio 83 slaže pravi sistem iza cilja.',
  path: '/usluge/',
})

export default function ServicesPage() {
  const crumbs = [{ label: 'Usluge', href: '/usluge/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Usluge</span><h1>Ne morate znati koja vam usluga treba. Krenite od cilja.</h1><p className="lead">Studio 83 radi kroz četiri jasne oblasti. Ako projekat traži više njih, povezujemo ih u jedan sistem i jednu odgovornu realizaciju.</p></div><aside className="page-hero-aside"><strong>Najbrži način da izaberete</strong><ul><li>želim više prodaje ili kvalitetnijih upita</li><li>treba mi novi sajt ili digitalni proizvod</li><li>organizujem promociju ili događaj</li><li>trebaju mi ljudi i operativni tim</li></ul></aside></div></div></section>

    <OfferAreas />

    <section className="section section-light"><div className="container"><SectionHeading eyebrow="Detaljno po disciplini" title="Ako već znate šta tražite, uđite direktno u detalje." text="Svaka stranica prikazuje konkretan obim, proces, tipične ishode i orijentacioni cjenovni okvir." /><div className="service-grid service-grid-five">{services.map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 0} />)}</div></div></section>

    <EngagementModels />
    <OfferChooser />

    <FinalCta title="Još nijeste sigurni? Pošaljite problem, ne naziv usluge." text="Dovoljni su cilj, rok, lokacija i okvirni budžet. Vratićemo se sa preporučenim prvim korakom i nivoom saradnje koji ima smisla." label="Pošalji brief" />
  </>
}
