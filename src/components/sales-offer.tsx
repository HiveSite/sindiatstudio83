'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { serviceProducts } from '@/data/service-products'

const priceFor = (slug: string, index: number) => serviceProducts[slug]?.[index]?.price || 'po ponudi'

const categories = [
  {
    index: '01', title: 'Kampanje i rast', short: 'Kampanje',
    text: 'Za više prodaje, kvalitetnijih upita i vidljivosti koja vodi do konkretne radnje.',
    items: [
      { title: 'Digitalno oglašavanje', price: priceFor('performance-marketing', 1), text: 'Meta, Google, mjerenje i optimizacija prema poslovnom rezultatu.', href: '/usluge/performance-marketing/' },
      { title: 'Sadržaj za kampanje', price: priceFor('sadrzaj-za-kampanje', 0), text: 'Kreativni pravci, video, foto, UGC i varijante spremne za testiranje.', href: '/usluge/sadrzaj-za-kampanje/' },
      { title: 'Odredišne stranice i upiti', price: priceFor('web-i-konverzije', 0), text: 'Odredišne stranice i korisnički tok koji kampanji daju gdje da konvertuje.', href: '/usluge/web-i-konverzije/' },
    ],
  },
  {
    index: '02', title: 'Sajtovi i digitalni proizvodi', short: 'Sajtovi',
    text: 'Od fokusirane odredišne stranice do kompleksnije platforme sa jasnim korisničkim tokom i integracijama.',
    items: [
      { title: 'Odredišna stranica', price: priceFor('web-i-konverzije', 0), text: 'Jedna jasna ponuda, jedan cilj i minimum trenja do kontakta ili prijave.', href: '/usluge/web-i-konverzije/' },
      { title: 'Napredni mini-sajt', price: priceFor('web-i-konverzije', 1), text: 'Ozbiljnija digitalna prezentacija sa više sadržaja, stranica i integracija.', href: '/usluge/web-i-konverzije/' },
      { title: 'Digitalni proizvod', price: priceFor('web-i-konverzije', 2), text: 'Platforme, prijavni sistemi i proizvodi sa posebnom poslovnom logikom.', href: '/usluge/web-i-konverzije/' },
    ],
  },
  {
    index: '03', title: 'Aktivacije i eventi', short: 'Aktivacije',
    text: 'Koncept, produkcija, ljudi, lokacije, logistika i izvještaj kroz jednu odgovornu realizaciju.',
    items: [
      { title: 'Plan aktivacije', price: priceFor('aktivacije-i-eventi', 0), text: 'Koncept, mehanika, operativna mapa i budžetska struktura.', href: '/usluge/aktivacije-i-eventi/' },
      { title: 'Produkcija i koordinacija', price: priceFor('aktivacije-i-eventi', 1), text: 'Tim, lokacije, smjene, logistika, supervizija i izvještaj.', href: '/usluge/aktivacije-i-eventi/' },
      { title: 'Kompletna kampanja', price: priceFor('aktivacije-i-eventi', 2), text: 'Digital, produkcija, ljudi, teren i sadržaj povezani kroz isti cilj.', href: '/usluge/aktivacije-i-eventi/' },
    ],
  },
  {
    index: '04', title: 'Timovi i angažmani', short: 'Timovi',
    text: 'Pronalazak i organizacija ljudi za promocije, događaje, sezonske potrebe i kampanje zapošljavanja.',
    items: [
      { title: 'Kampanja za jednu poziciju', price: priceFor('recruitment-kampanje', 0), text: 'Oglas, ponuda poslodavca, put do prijave, kampanjska postavka i distribucija.', href: '/usluge/recruitment-kampanje/' },
      { title: 'Sezonska kampanja', price: priceFor('recruitment-kampanje', 1), text: 'Više pozicija, kreativni paket, distribucija i kontinuirana optimizacija.', href: '/usluge/recruitment-kampanje/' },
      { title: 'Sistem zapošljavanja', price: priceFor('recruitment-kampanje', 2), text: 'Kontinuirano zapošljavanje i predstavljanje poslodavca kroz više kanala.', href: '/usluge/recruitment-kampanje/' },
      { title: 'Promo i event timovi', price: 'po obimu', text: 'Odabir ljudi, priprema, rasporedi, zamjene i operativna kontrola na terenu.', href: '/usluge/aktivacije-i-eventi/' },
    ],
  },
] as const

export function OfferAreas() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = categories[activeIndex]

  return (
    <section className="sales-solutions section" id="izaberi-rjesenje">
      <div className="container">
        <div className="sales-section-head">
          <div><span className="eyebrow">Šta vam treba?</span><h2>Prođite kroz kategorije. Otvorite konkretan proizvod.</h2></div>
          <p>Bez kataloga od dvadeset usluga. Izaberite oblast koja je najbliža problemu i odmah vidite konkretne opcije i početni cjenovni okvir.</p>
        </div>

        <div className="sales-category-rail" role="tablist" aria-label="Kategorije usluga">
          {categories.map((category, index) => (
            <button key={category.title} type="button" role="tab" aria-selected={activeIndex === index} className={`sales-category-tab${activeIndex === index ? ' is-active' : ''}`} onClick={() => setActiveIndex(index)}>
              <span>{category.index}</span><strong>{category.short}</strong>
            </button>
          ))}
        </div>

        <div className="sales-category-panel" role="tabpanel">
          <div className="sales-category-copy"><span className="sales-category-count">{active.index}</span><h3>{active.title}</h3><p>{active.text}</p></div>
          <div className="sales-item-list">
            {active.items.map((item, index) => (
              <Link className="sales-item-link" href={item.href} key={`${active.title}-${item.title}-${index}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.title}</strong><p>{item.text}</p><em>{item.price}</em></div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>

        <div className="sales-unsure"><div><strong>Nijeste sigurni gdje pripada vaš projekat?</strong><span>Tri kratka pitanja su dovoljna da dobijete preporučeni proizvod.</span></div><Link className="button button-ghost" href="#pronadji-model">Pronađi šta mi treba</Link></div>
      </div>
    </section>
  )
}

type ChoiceState = { goal: string; mode: string; budget: string }

const goalLabels: Record<string, string> = { growth: 'Više prodaje ili upita', web: 'Novi sajt ili platforma', event: 'Promocija ili događaj', people: 'Ljudi i angažmani', complex: 'Kompleksan projekat' }
const modeLabels: Record<string, string> = { one: 'Jednokratan projekat', ongoing: 'Kontinuirana potreba', unsure: 'Još nije definisano' }
const budgetLabels: Record<string, string> = { under150: 'Do 150 €', '150-500': '150 - 500 €', '500-1500': '500 - 1.500 €', '1500plus': '1.500 €+' }

type Recommendation = { title: string; text: string; href: string; product: string }
const budgetMaximum: Record<string, number> = {
  under150: 150,
  '150-500': 500,
  '500-1500': 1500,
  '1500plus': Number.POSITIVE_INFINITY,
}

// The chooser must not promise a deliverable below its published starting price.
function productStartingPrice(price: string): number | null {
  const match = price.match(/\d[\d.,]*/)
  if (!match) return null
  const value = Number(match[0].replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(value) ? value : null
}

function recommendationFor(state: ChoiceState): Recommendation | null {
  if (!state.goal || !state.mode || !state.budget) return null

  const preferredSlug =
    state.goal === 'web' ? 'web-i-konverzije' :
    state.goal === 'event' || state.goal === 'complex' ? 'aktivacije-i-eventi' :
    state.goal === 'people' ? 'recruitment-kampanje' :
    'performance-marketing'

  const products = serviceProducts[preferredSlug] || []
  const maxBudget = budgetMaximum[state.budget]
  const fit = products.filter((product) => {
    const minimum = productStartingPrice(product.price)
    return minimum !== null && minimum <= maxBudget
  })
  const selected = state.mode === 'ongoing' && state.goal === 'growth'
    ? fit.find((product) => /mjesečn/i.test(product.name)) || fit[fit.length - 1]
    : fit[fit.length - 1]

  if (!selected) {
    return {
      title: 'Kratka procjena izvodljivosti',
      text: 'Za izabrani budžet nema potvrđenog standardnog paketa u ovoj oblasti. Pošaljite cilj i okvir, pa ćemo realno procijeniti mogućnosti bez obećavanja isporuke po preniskoj cijeni.',
      href: `/usluge/${preferredSlug}/`,
      product: '',
    }
  }

  return {
    title: selected.name,
    text: `${selected.description} Početna cijena: ${selected.price}. Konačna ponuda zavisi od dogovorenog obima i uslova.`,
    href: `/usluge/${preferredSlug}/#proizvodi`,
    product: selected.name,
  }
}

export function OfferChooser() {
  const [state, setState] = useState<ChoiceState>({ goal: '', mode: '', budget: '' })
  const recommendation = useMemo(() => recommendationFor(state), [state])
  const briefHref = useMemo(() => {
    if (!recommendation) return '/kontakt/?izvor=chooser'
    const params = new URLSearchParams({ izvor: 'izbor-usluge', cilj: goalLabels[state.goal], model: modeLabels[state.mode], budzet: budgetLabels[state.budget], preporuka: recommendation.title })
    if (recommendation.product) params.set('proizvod', recommendation.product)
    return `/kontakt/?${params.toString()}`
  }, [recommendation, state])

  const choice = (group: keyof ChoiceState, value: string, label: string) => <button type="button" className={`sales-choice${state[group] === value ? ' is-selected' : ''}`} aria-pressed={state[group] === value} onClick={() => setState((current) => ({ ...current, [group]: value }))}>{label}</button>

  return (
    <section className="sales-chooser section" id="pronadji-model"><div className="container"><div className="sales-chooser-shell">
      <div className="sales-chooser-head"><div><span className="eyebrow">Brza preporuka</span><h2>3 pitanja. Konkretan proizvod.</h2></div><p>Odgovor ne određuje konačan obim, ali vas odmah vodi ka najbližoj opciji i prenosi kontekst u brief.</p></div>
      <div className="sales-chooser-grid">
        <div className="sales-chooser-step"><small>01 - cilj</small><h3>Šta želite da postignete?</h3><div className="sales-choice-list">{choice('goal','growth','Više prodaje ili upita')}{choice('goal','web','Novi sajt ili platformu')}{choice('goal','event','Promociju ili događaj')}{choice('goal','people','Pronaći i organizovati ljude')}{choice('goal','complex','Kompleksan projekat')}</div></div>
        <div className="sales-chooser-step"><small>02 - potreba</small><h3>Da li je potreba jednokratna?</h3><div className="sales-choice-list">{choice('mode','one','Da, jedan projekat')}{choice('mode','ongoing','Treba nam kontinuirano')}{choice('mode','unsure','Još nijesmo sigurni')}</div></div>
        <div className="sales-chooser-step"><small>03 - okvir</small><h3>Koji je okvirni budžet?</h3><div className="sales-choice-list">{choice('budget','under150','Do 150 €')}{choice('budget','150-500','150 - 500 €')}{choice('budget','500-1500','500 - 1.500 €')}{choice('budget','1500plus','1.500 €+')}</div></div>
      </div>
      <div className="sales-recommendation"><div className="sales-recommendation-copy"><span>{recommendation ? 'Preporučeni proizvod' : 'Preporuka'}</span><strong>{recommendation?.title || 'Izaberite odgovore na sva tri pitanja odgovora iznad.'}</strong><p>{recommendation?.text || 'Ne morate pogoditi savršeno - finalni obim zaključavamo tek nakon briefa.'}</p></div><div className="sales-recommendation-actions">{recommendation ? <Link className="button button-ghost" href={recommendation.href}>Pogledaj proizvod</Link> : null}<Link className="button button-primary" href={briefHref}>Pošalji brief</Link></div></div>
    </div></div></section>
  )
}
