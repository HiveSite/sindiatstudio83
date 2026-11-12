import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, serviceSchema, webPageSchema } from '@/lib/schema'
import { serviceProducts } from '@/data/service-products'

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

export function FocusedServiceLanding({ data }: { data: FocusedServiceData }) {
  const products = serviceProducts['performance-marketing'] || []
  const planningProduct = products.find((item) => item.name === 'Dijagnostika i plan') || products[0]
  const crumbs = [
    { label: 'Usluge', href: '/usluge/' },
    { label: 'Performance marketing', href: '/usluge/performance-marketing/' },
    { label: data.eyebrow, href: data.path },
  ]
  return <div className="focused-service">
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: data.title, description: data.description, path: data.path }),
      serviceSchema({ name: data.title, description: data.description, path: data.path, serviceType: data.eyebrow }),
    ]} />
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={crumbs}/>
      <div className="page-hero-grid">
        <div><span className="eyebrow">{data.eyebrow} / Podgorica + Crna Gora</span><h1>{data.title}</h1>
        <p className="lead">{data.intro}</p>
        <div className="button-row" style={{marginTop:26}}>
          <Link className="button button-primary" href={`/kontakt/?usluga=performance-marketing&cilj=${encodeURIComponent(data.eyebrow)}&izvor=seo-usluga`}>Zatraži ponudu</Link>
          <a className="button button-ghost" href="#sta-dobijate">Šta dobijate</a>
        </div></div>
        <aside className="service-price-anchor"><span>Prvi korak - {planningProduct?.name || 'Procjena'}</span><strong>{planningProduct?.price || 'Po ponudi'}</strong><p>Ovo je cijena početne analize, a ne vođenja oglasa. Postavku kampanje, mjesečni rad i budžet za reklame dogovaramo odvojeno.</p><Link href="/cijene/#performance-marketing" className="text-link">Vidi sve opcije i cijene ↗</Link></aside>
      </div>
    </div></section>
    <section className="section section-dark"><div className="container focused-columns">
      <div><span className="eyebrow">Zašto ova usluga</span><h2>Gdje najčešće nastaje problem?</h2></div>
      <ul>{data.problems.map(t=><li key={t}>{t}</li>)}</ul>
    </div></section>
    <section className="section section-light" id="sta-dobijate"><div className="container">
      <span className="eyebrow">Obim saradnje</span><h2>Šta konkretno radimo?</h2>
      <div className="focused-deliverables">{data.deliverables.map((t,i)=><article key={t}><span>{String(i+1).padStart(2,'0')}</span><h3>{t}</h3></article>)}</div>
      <p className="focused-disclaimer">Dogovaramo šta je uključeno i koliko košta prije nego što počnemo.</p>
    </div></section>
    <section className="section section-dark"><div className="container">
      <span className="eyebrow">Kako radimo</span><h2>Od prvog razgovora do rezultata.</h2>
      <div className="focused-steps">{data.stages.map((step,i)=><article key={step.name}><span>0{i+1}</span><h3>{step.name}</h3><p>{step.text}</p></article>)}</div>
    </div></section>
    <section className="section"><div className="container focused-columns">
      <div><span className="eyebrow">Najčešća pitanja</span><h2>Prije saradnje.</h2><Link className="text-link" href="/usluge/performance-marketing/">Sve performance usluge ↗</Link></div>
      <div className="focused-faq">{data.faq.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
    </div></section>
    <FinalCta title="Treba ti oglašavanje koje ima jasan cilj?" text="Napiši šta želiš da promovišeš, kome se obraćaš i kada želiš da počneš. Predložićemo ti prvi korak i realan obim." label="Pošalji brief"/>
  </div>
}
