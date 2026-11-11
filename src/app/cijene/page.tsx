import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { serviceProducts } from '@/data/service-products'
import { services } from '@/data/services'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'
import { createMetadata } from '@/lib/metadata'

const title = 'Cijene i modeli saradnje za marketing, web i događaje'
const description = 'Pregled početnih cijena i modela saradnje Sindikat Studio 83: marketing kampanje, web, kreativni sadržaj, događaji i zapošljavanje u Crnoj Gori.'
export const metadata: Metadata = createMetadata({ title, description, path: '/cijene/' })

export default function PricingPage() {
  const crumbs = [{label:'Cijene i saradnja',href:'/cijene/'}]
  return <div className="demo-pricing">
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({name:title,description,path:'/cijene/',type:'CollectionPage'}),
      itemListSchema({name:'Usluge i modeli saradnje',path:'/cijene/',items:services.map(s=>({name:s.shortTitle,href:`/usluge/${s.slug}/`}))})
    ]}/>
    <section className="page-hero demo-pricing-hero"><div className="container">
      <Breadcrumbs items={crumbs}/>
      <span className="eyebrow">Saradnja bez nagađanja</span>
      <h1>Jasan početak. Ponuda po stvarnom obimu.</h1>
      <p className="lead">Izaberi oblast i pogledaj šta ulazi u početni okvir. Svaki projekat zaključujemo kroz konkretne isporuke, rok i cijenu prije početka.</p>
      <div className="button-row"><Link className="button button-primary" href="/kontakt/?izvor=cijene-hero">Zatraži ponudu</Link><a className="button button-ghost" href="#pregled-cijena">Pregledaj opcije</a></div>
    </div></section>

    <section className="section demo-pricing-section" id="pregled-cijena"><div className="container">
      <div className="demo-pricing-index" aria-label="Pređi na oblast">{services.map(s=><a href={`#${s.slug}`} key={s.slug}>{s.shortTitle} <span aria-hidden="true">↓</span></a>)}</div>
      {services.map((s,index)=>{
        const products = serviceProducts[s.slug] || []
        return <section className="demo-pricing-category" id={s.slug} key={s.slug} aria-labelledby={`pricing-${s.slug}`}>
          <div className="demo-pricing-heading"><div><span className="eyebrow">0{index+1} / Ponuda</span><h2 id={`pricing-${s.slug}`}>{s.shortTitle}</h2><p>{s.summary}</p></div><Link href={`/usluge/${s.slug}/`}>Detalji usluge ↗</Link></div>
          <div className="demo-pricing-grid">{products.map(product=><article className={`demo-pricing-card${product.featured?' is-featured':''}`} key={product.name}>
            <div><span>{product.featured?'Izdvojena opcija':'Mogućnost saradnje'}</span><h3>{product.name}</h3><strong>{product.price}</strong><p>{product.description}</p></div>
            <ul>{product.includes.map(part=><li key={part}>{part}</li>)}</ul>
            <Link href={`/kontakt/?usluga=${s.slug}&proizvod=${encodeURIComponent(product.name)}&izvor=cijene`} className="button button-primary">Zatraži ovu opciju</Link>
          </article>)}</div>
        </section>
      })}
      <p className="demo-pricing-fineprint">Navedene cijene predstavljaju početne okvire iz aktuelnog kataloga, ne konačnu obavezujuću ponudu. Troškovi oglašavanja, spoljašnjih dobavljača, transporta i dodatne produkcije definišu se zasebno kada su primjenjivi.</p>
    </div></section>
    <section className="section section-dark"><div className="container demo-pricing-models"><div><span className="eyebrow">Kako se dogovaramo</span><h2>Tri načina da krenemo.</h2></div><div className="demo-pricing-model-grid">
      <div><span>01</span><h3>Jedan zadatak</h3><p>Jasno definisana isporuka sa konkretnim rokom.</p></div>
      <div><span>02</span><h3>Mjesečna saradnja</h3><p>Kontinuirani rad uz dogovoreni obim i ritam izvještavanja.</p></div>
      <div><span>03</span><h3>Kompletan projekat</h3><p>Strategija, kreativa, web, ljudi i teren povezani kroz zajednički plan.</p></div>
    </div></div></section>
    <FinalCta title="Nijesi siguran šta ti treba?" text="Pošalji cilj, rok i okvirni budžet. Predložićemo najbližu realnu opciju ili pripremiti ponudu prema obimu." label="Pošalji brief"/>
  </div>
}
