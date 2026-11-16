'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { serviceProducts } from '@/data/service-products'
import { enProducts } from '@/data/en-products'
import { localeHref, type SiteLocale } from '@/lib/locale'

const salesEn: Record<string,string> = {
  "Kampanje i razvoj": "Campaigns and growth",
  "Kampanje": "Campaigns",
  "Za više prodaje, kvalitetnijih upita i vidljivosti koja vodi do konkretne radnje.": "For more sales, better enquiries and visibility that leads to meaningful action.",
  "Digitalno oglašavanje": "Digital advertising",
  "Meta, Google, mjerenje i optimizacija prema broju i kvalitetu upita.": "Meta and Google campaigns, tracking and optimization focused on the number and quality of enquiries.",
  "Sadržaj za kampanje": "Campaign content",
  "Kreativni pravci, video, foto, autentičan sadržaj i varijante spremne za testiranje.": "Creative concepts, video, photography, authentic content and test-ready variations.",
  "Odredišne stranice i upiti": "Landing pages and enquiries",
  "Odredišne stranice i korisnički tok koji kampanji daju gdje da konvertuje.": "Landing pages and user journeys that turn campaign clicks into enquiries.",
  "Sajtovi i digitalni proizvodi": "Websites and digital products",
  "Sajtovi": "Websites",
  "Od fokusirane odredišne stranice do kompleksnije platforme sa jasnim korisničkim tokom i integracijama.": "From a focused landing page to a complex platform with clear user journeys and integrations.",
  "Odredišna stranica": "Landing page",
  "Jedna jasna ponuda, jedan cilj i minimum trenja do kontakta ili prijave.": "One clear offer, one goal and minimal friction before an enquiry or application.",
  "Napredni mini-sajt": "Advanced microsite",
  "Ozbiljnija digitalna prezentacija sa više sadržaja, stranica i integracija.": "A more complete digital presence with additional content, pages and integrations.",
  "Digitalni proizvod": "Digital product",
  "Platforme, prijavni sistemi i proizvodi sa posebnom poslovnom logikom.": "Platforms, application systems and products with dedicated business logic.",
  "Aktivacije i događaji": "Activations and events",
  "Aktivacije": "Activations",
  "Koncept, produkcija, ljudi, lokacije, logistika i izvještaj kroz jednu odgovornu realizaciju.": "Concept, production, teams, locations, logistics and reporting under one accountable operation.",
  "Plan aktivacije": "Activation plan",
  "Koncept, mehanika, operativna mapa i budžetska struktura.": "Concept, activation mechanics, operational plan and budget framework.",
  "Produkcija i koordinacija": "Production and coordination",
  "Tim, lokacije, smjene, logistika, supervizija i izvještaj.": "Teams, locations, shifts, logistics, supervision and reporting.",
  "Kompletna kampanja": "Full campaign",
  "Digital, produkcija, ljudi, teren i sadržaj povezani kroz isti cilj.": "Digital, production, people, field execution and content aligned behind one goal.",
  "Timovi i angažmani": "Teams and assignments",
  "Timovi": "Teams",
  "Pronalazak i organizacija ljudi za promocije, događaje, sezonske potrebe i kampanje zapošljavanja.": "Finding and coordinating people for promotions, events, seasonal needs and recruitment campaigns.",
  "Kampanja za jednu poziciju": "Single-vacancy campaign",
  "Oglas, ponuda poslodavca, put do prijave, kampanjska postavka i distribucija.": "Job listing, employer offer, application journey, campaign setup and distribution.",
  "Sezonska kampanja": "Seasonal campaign",
  "Više pozicija, kreativni paket, distribucija i kontinuirana optimizacija.": "Multiple vacancies, creative assets, distribution and ongoing optimization.",
  "Sistem zapošljavanja": "Recruitment system",
  "Kontinuirano zapošljavanje i predstavljanje poslodavca kroz više kanala.": "Ongoing recruitment and employer branding across multiple channels.",
  "Promotivni timovi za događaje": "Event promotional teams",
  "Odabir ljudi, priprema, rasporedi, zamjene i operativna kontrola na terenu.": "Team selection, preparation, schedules, replacements and operational field supervision.",
  "po obimu": "by scope",
  "Šta vam treba?": "What do you need?",
  "Prođite kroz kategorije. Otvorite konkretan proizvod.": "Browse the categories. Choose a specific service.",
  "Bez kataloga od dvadeset usluga. Izaberite oblast koja je najbliža problemu i odmah vidite konkretne opcije i početni cjenovni okvir.": "No endless service catalogue. Choose the area closest to your challenge and see specific options and starting prices.",
  "Kategorije usluga": "Service categories",
  "Nijeste sigurni gdje pripada vaš projekat?": "Not sure which category fits your project?",
  "Tri kratka pitanja su dovoljna da dobijete preporučeni proizvod.": "Three quick questions are enough for an initial recommendation.",
  "Pronađi šta mi treba": "Find what I need",
  "Više prodaje ili upita": "More sales or enquiries",
  "Novi sajt ili platforma": "A new website or platform",
  "Promocija ili događaj": "A promotion or event",
  "Ljudi i angažmani": "People and assignments",
  "Kompleksan projekat": "A complex project",
  "Jednokratan projekat": "One-off project",
  "Kontinuirana potreba": "Ongoing need",
  "Još nije definisano": "Not decided yet",
  "Kratka procjena izvodljivosti": "Quick feasibility assessment",
  "Za izabrani budžet nema potvrđenog standardnog paketa u ovoj oblasti. Pošaljite cilj i okvir, pa ćemo realno procijeniti mogućnosti bez obećavanja isporuke po preniskoj cijeni.": "There is no confirmed standard package in this category at your selected budget. Send us your goal and budget range, and we will assess the options realistically.",
  "Početna cijena:": "Starting price:",
  "Konačna ponuda zavisi od dogovorenog obima i uslova.": "The final quote depends on the agreed scope and terms.",
  "Brza preporuka": "Quick recommendation",
  "3 pitanja. Konkretan proizvod.": "3 questions. One specific service.",
  "Odgovor ne određuje konačan obim, ali vas odmah vodi ka najbližoj opciji i prenosi kontekst u opis upita.": "Your answers do not determine the final scope, but they lead to the closest option and carry context into your enquiry.",
  "01 - cilj": "01 - goal",
  "Šta želite da postignete?": "What would you like to achieve?",
  "Novi sajt ili platformu": "A new website or platform",
  "Promociju ili događaj": "A promotion or event",
  "Pronaći i organizovati ljude": "Find and coordinate people",
  "02 - potreba": "02 - project type",
  "Da li je potreba jednokratna?": "Is this a one-off need?",
  "Da, jedan projekat": "Yes, one project",
  "Treba nam kontinuirano": "We need ongoing support",
  "Još nijesmo sigurni": "We are not sure yet",
  "03 - okvir": "03 - budget",
  "Koji je okvirni budžet?": "What is the budget range?",
  "Do 150 €": "Up to €150",
  "150 - 500 €": "€150 - €500",
  "500 - 1.500 €": "€500 - €1,500",
  "1.500 €+": "€1,500+",
  "Preporučeni proizvod": "Recommended service",
  "Preporuka": "Recommendation",
  "Izaberite odgovore na sva tri pitanja iznad.": "Select an answer for all three questions above.",
  "Ne morate pogoditi savršeno - konačan obim zaključavamo tek nakon razgovora.": "Your answers do not need to be perfect - we confirm the final scope after our discussion.",
  "Pogledaj proizvod": "View service",
  "Pošalji upit": "Send enquiry"
}
const localize=(locale:SiteLocale,value:string)=>locale==='en' ? (salesEn[value] || value.replace(/^od ([\d.,]+) €(?: \/ mj\.)?$/,(all,n)=>'from €'+n+(all.includes('mj.')?' / month':''))) : value


const priceFor = (slug: string, index: number) => serviceProducts[slug]?.[index]?.price || 'po ponudi'

const categories = [
  {
    index: '01', title: 'Kampanje i razvoj', short: 'Kampanje',
    text: 'Za više prodaje, kvalitetnijih upita i vidljivosti koja vodi do konkretne radnje.',
    items: [
      { title: 'Digitalno oglašavanje', price: priceFor('performance-marketing', 1), text: 'Meta, Google, mjerenje i optimizacija prema broju i kvalitetu upita.', href: '/usluge/performance-marketing/' },
      { title: 'Sadržaj za kampanje', price: priceFor('sadrzaj-za-kampanje', 0), text: 'Kreativni pravci, video, foto, autentičan sadržaj i varijante spremne za testiranje.', href: '/usluge/sadrzaj-za-kampanje/' },
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
    index: '03', title: 'Aktivacije i događaji', short: 'Aktivacije',
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
      { title: 'Promotivni timovi za događaje', price: 'po obimu', text: 'Odabir ljudi, priprema, rasporedi, zamjene i operativna kontrola na terenu.', href: '/usluge/aktivacije-i-eventi/' },
    ],
  },
] as const

export function OfferAreas({locale='sr'}:{locale?:SiteLocale}) {
  const t=(value:string)=>localize(locale,value)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = categories[activeIndex]

  return (
    <section className="sales-solutions section" id="izaberi-rjesenje">
      <div className="container">
        <div className="sales-section-head">
          <div><span className="eyebrow">{t("Šta vam treba?")}</span><h2>{t("Prođite kroz kategorije. Otvorite konkretan proizvod.")}</h2></div>
          <p>{t("Bez kataloga od dvadeset usluga. Izaberite oblast koja je najbliža problemu i odmah vidite konkretne opcije i početni cjenovni okvir.")}</p>
        </div>

        <div className="sales-category-rail" role="tablist" aria-label={t("Kategorije usluga")}>
          {categories.map((category, index) => (
            <button key={category.title} type="button" role="tab" aria-selected={activeIndex === index} className={`sales-category-tab${activeIndex === index ? ' is-active' : ''}`} onClick={() => setActiveIndex(index)}>
              <span>{category.index}</span><strong>{t(category.short)}</strong>
            </button>
          ))}
        </div>

        <div className="sales-category-panel" role="tabpanel">
          <div className="sales-category-copy"><span className="sales-category-count">{active.index}</span><h3>{t(active.title)}</h3><p>{t(active.text)}</p></div>
          <div className="sales-item-list">
            {active.items.map((item, index) => (
              <Link className="sales-item-link" href={localeHref(locale,item.href)} key={`${active.title}-${t(item.title)}-${index}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.title}</strong><p>{t(item.text)}</p><em>{t(item.price)}</em></div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>

        <div className="sales-unsure"><div><strong>{t("Nijeste sigurni gdje pripada vaš projekat?")}</strong><span>{t("Tri kratka pitanja su dovoljna da dobijete preporučeni proizvod.")}</span></div><Link className="button button-ghost" href="#pronadji-model">{t("Pronađi šta mi treba")}</Link></div>
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

function recommendationFor(state: ChoiceState,locale:SiteLocale='sr'): Recommendation | null {
  if (!state.goal || !state.mode || !state.budget) return null

  const preferredSlug =
    state.goal === 'web' ? 'web-i-konverzije' :
    state.goal === 'event' || state.goal === 'complex' ? 'aktivacije-i-eventi' :
    state.goal === 'people' ? 'recruitment-kampanje' :
    'performance-marketing'

  const products = (locale==='en' ? enProducts : serviceProducts)[preferredSlug] || []
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
      title: localize(locale,'Kratka procjena izvodljivosti'),
      text: localize(locale,'Za izabrani budžet nema potvrđenog standardnog paketa u ovoj oblasti. Pošaljite cilj i okvir, pa ćemo realno procijeniti mogućnosti bez obećavanja isporuke po preniskoj cijeni.'),
      href: `/usluge/${preferredSlug}/`,
      product: '',
    }
  }

  return {
    title: selected.name,
    text: `${selected.description} ${localize(locale,'Početna cijena:')} ${selected.price}. ${localize(locale,'Konačna ponuda zavisi od dogovorenog obima i uslova.')}`,
    href: `/usluge/${preferredSlug}/#proizvodi`,
    product: selected.name,
  }
}

export function OfferChooser({locale='sr'}:{locale?:SiteLocale}) {
  const t=(value:string)=>localize(locale,value)
  const [state, setState] = useState<ChoiceState>({ goal: '', mode: '', budget: '' })
  const recommendation = useMemo(() => recommendationFor(state,locale), [state,locale])
  const briefHref = useMemo(() => {
    if (!recommendation) return localeHref(locale,'/kontakt/?izvor=chooser')
    const params = new URLSearchParams({ izvor: 'chooser', cilj: t(goalLabels[state.goal]), model: t(modeLabels[state.mode]), budzet: t(budgetLabels[state.budget]), preporuka: recommendation.title })
    if (recommendation.product) params.set('proizvod', recommendation.product)
    return localeHref(locale,`/kontakt/?${params.toString()}`)
  }, [recommendation, state, locale])

  const choice = (group: keyof ChoiceState, value: string, label: string) => <button type="button" className={`sales-choice${state[group] === value ? ' is-selected' : ''}`} aria-pressed={state[group] === value} onClick={() => setState((current) => ({ ...current, [group]: value }))}>{t(label)}</button>

  return (
    <section className="sales-chooser section" id="pronadji-model"><div className="container"><div className="sales-chooser-shell">
      <div className="sales-chooser-head"><div><span className="eyebrow">{t("Brza preporuka")}</span><h2>{t("3 pitanja. Konkretan proizvod.")}</h2></div><p>{t("Odgovor ne određuje konačan obim, ali vas odmah vodi ka najbližoj opciji i prenosi kontekst u opis upita.")}</p></div>
      <div className="sales-chooser-grid">
        <div className="sales-chooser-step"><small>{t("01 - cilj")}</small><h3>{t("Šta želite da postignete?")}</h3><div className="sales-choice-list">{choice('goal','growth','Više prodaje ili upita')}{choice('goal','web','Novi sajt ili platformu')}{choice('goal','event','Promociju ili događaj')}{choice('goal','people','Pronaći i organizovati ljude')}{choice('goal','complex','Kompleksan projekat')}</div></div>
        <div className="sales-chooser-step"><small>{t("02 - potreba")}</small><h3>{t("Da li je potreba jednokratna?")}</h3><div className="sales-choice-list">{choice('mode','one','Da, jedan projekat')}{choice('mode','ongoing','Treba nam kontinuirano')}{choice('mode','unsure','Još nijesmo sigurni')}</div></div>
        <div className="sales-chooser-step"><small>{t("03 - okvir")}</small><h3>{t("Koji je okvirni budžet?")}</h3><div className="sales-choice-list">{choice('budget','under150','Do 150 €')}{choice('budget','150-500','150 - 500 €')}{choice('budget','500-1500','500 - 1.500 €')}{choice('budget','1500plus','1.500 €+')}</div></div>
      </div>
      <div className="sales-recommendation"><div className="sales-recommendation-copy"><span>{t(recommendation ? 'Preporučeni proizvod' : 'Preporuka')}</span><strong>{recommendation?.title || t('Izaberite odgovore na sva tri pitanja iznad.')}</strong><p>{recommendation?.text || t('Ne morate pogoditi savršeno - konačan obim zaključavamo tek nakon razgovora.')}</p></div><div className="sales-recommendation-actions">{recommendation ? <Link className="button button-ghost" href={localeHref(locale,recommendation.href)}>{t("Pogledaj proizvod")}</Link> : null}<Link className="button button-primary" href={briefHref}>{t("Pošalji upit")}</Link></div></div>
    </div></div></section>
  )
}
