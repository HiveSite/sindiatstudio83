import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { serviceProducts } from '@/data/service-products'
import { enProducts } from '@/data/en-products'
import { enServices } from '@/data/en'
import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { services } from '@/data/services'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'


const title = 'Cijene i modeli saradnje za marketing, web i događaje'
const description = 'Pregled početnih cijena i modela saradnje Sindikat Studio 83: marketing kampanje, web, kreativni sadržaj, događaji i zapošljavanje u Crnoj Gori.'
export function PricingPageContent({locale='sr'}:{locale?:SiteLocale}) {
  const en=locale==='en'
  const t=(sr:string,english:string)=>translate(locale,sr,english)
  const href=(value:string)=>localeHref(locale,value)
  const crumbs = [{label:t('Cijene i saradnja','Pricing and collaboration'),href:href('/cijene/')}]
  return <div className="demo-pricing">
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({name:t(title,'Pricing and ways of working'),description:t(description,'Starting prices for campaigns, websites, content, events and recruitment in Montenegro.'),path:en?'/en/cijene/':'/cijene/',type:'CollectionPage'}),
      itemListSchema({name:t('Usluge i modeli saradnje','Services and ways of working'),path:en?'/en/cijene/':'/cijene/',items:services.map((s,i)=>({name:en?enServices[i].title:s.shortTitle,href:href(`/usluge/${s.slug}/`)}))})
    ]}/>
    <section className="page-hero demo-pricing-hero"><div className="container">
      <Breadcrumbs items={crumbs} locale={locale}/>
      <span className="eyebrow">{t("Jasno od početka","Clear from the start")}</span>
      <h1>{t("Jasne početne cijene. Tačno dogovoren obim.","Clear starting prices. Agreed deliverables.")}</h1>
      <p className="lead">{t("Pronađi okvirnu cijenu, uporedi uključene stavke i pošalji upit. Ne nudimo neograničeni rad po fiksnoj početnoj cijeni - svaka saradnja ima definisane isporuke, rok i odgovornosti.","Find a starting price, compare included deliverables and send an enquiry. A starting price does not mean unlimited work - every engagement has agreed deliverables, deadlines and responsibilities.")}</p>
      <div className="button-row"><Link className="button button-primary" href={href('/kontakt/?izvor=cijene-hero')}>{t("Zatraži ponudu","Request a proposal")}</Link><a className="button button-ghost" href="#pregled-cijena">{t("Pregledaj opcije","Browse options")}</a></div>
    </div></section>

    <section className="section demo-pricing-section" id="pregled-cijena"><div className="container">
      <div className="demo-pricing-index" aria-label={t('Pređi na oblast','Jump to service')}>{services.map(s=><a href={`#${s.slug}`} key={s.slug}>{en ? enServices.find(item=>item.slug===s.slug)?.title || s.shortTitle : s.shortTitle} <span aria-hidden="true">↓</span></a>)}</div>
      {services.map((s,index)=>{
        const products = (en ? enProducts : serviceProducts)[s.slug] || []
        return <section className="demo-pricing-category" id={s.slug} key={s.slug} aria-labelledby={`pricing-${s.slug}`}>
          <div className="demo-pricing-heading"><div><span className="eyebrow">0{index+1} / {t('Ponuda','Offer')}</span><h2 id={`pricing-${s.slug}`}>{en ? enServices.find(item=>item.slug===s.slug)?.title || s.shortTitle : s.shortTitle}</h2><p>{en ? enServices.find(item=>item.slug===s.slug)?.summary || s.summary : s.summary}</p></div><Link href={href(`/usluge/${s.slug}/`)}>{t("Detalji usluge ↗","Service details ↗")}</Link></div>
          <div className="demo-pricing-grid">{products.map((product,index)=><article className={`demo-pricing-card${product.featured?' is-featured':''}`} key={product.name}>
            <div><span>{t(product.featured?'Izdvojena opcija':'Mogućnost saradnje',product.featured?'Featured option':'Available option')}</span><h3>{product.name}</h3><strong>{product.price}</strong><p>{product.description}</p></div>
            <ul>{product.includes.map(part=><li key={part}>{part}</li>)}</ul>
            <Link href={href(`/kontakt/?usluga=${s.slug}&proizvod=${encodeURIComponent(serviceProducts[s.slug]?.[index]?.name || product.name)}&izvor=cijene`)} className="button button-primary">{t("Zatraži ovu opciju","Request this option")}</Link>
          </article>)}</div>
        </section>
      })}
      <div className="pricing-trust-note"><strong>{t('Kako čitati ove cijene','How to read these prices')}</strong><p>{t('Početna cijena odnosi se na opisani osnovni obim. Tačan broj materijala, revizija, rokovi i eventualni dodatni troškovi potvrđuju se pisanom ponudom prije početka rada. Ako ti treba širi obim, ne moraš kupovati više malih paketa - pripremićemo jednu objedinjenu ponudu.','Each starting price covers the basic scope described. Exact asset quantities, revisions, deadlines and additional costs are confirmed in a written proposal before work begins. For broader needs, we can prepare one consolidated proposal instead of several small packages.')}</p></div><p className="demo-pricing-fineprint">{t("Navedene cijene predstavljaju početne okvire iz aktuelnog kataloga, ne konačnu obavezujuću ponudu. Troškovi oglašavanja, spoljašnjih dobavljača, transporta i dodatne produkcije definišu se zasebno kada su primjenjivi.","The listed amounts are starting prices from the current service catalogue, not binding quotations. Advertising spend, external suppliers, transport and additional production are quoted separately where applicable.")}</p>
    </div></section>
    <section className="section section-dark"><div className="container demo-pricing-models"><div><span className="eyebrow">{t("Kako se dogovaramo","Working together")}</span><h2>{t("Tri načina da krenemo.","Three ways to get started.")}</h2></div><div className="demo-pricing-model-grid">
      <div><span>01</span><h3>{t("Jedan zadatak","One assignment")}</h3><p>{t("Jasno definisana isporuka sa konkretnim rokom.","A clearly defined deliverable with a firm deadline.")}</p></div>
      <div><span>02</span><h3>{t("Mjesečna saradnja","Monthly partnership")}</h3><p>{t("Kontinuirani rad uz dogovoreni obim i ritam izvještavanja.","Ongoing work with an agreed scope and reporting cadence.")}</p></div>
      <div><span>03</span><h3>{t("Kompletan projekat","Full project")}</h3><p>{t("Strategija, kreativa, web, ljudi i teren povezani kroz zajednički plan.","Strategy, creative work, web, people and on-site delivery aligned in one plan.")}</p></div>
    </div></div></section>
    <FinalCta locale={locale} title={t('Nijesi siguran koju uslugu da izabereš?','Not sure which service to choose?')} text={t('Napiši šta želiš da postigneš i koliko vremena imaš. Predložićemo odgovarajuću uslugu i jasnu ponudu.','Tell us your goal and timeline. We will recommend a suitable service and a clear proposal.')} label={t('Pošalji brief','Send a brief')}/>
  </div>
}

