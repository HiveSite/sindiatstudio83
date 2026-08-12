'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const categories = [
  {
    index: '01', title: 'Kampanje i rast', short: 'Kampanje',
    text: 'Za više prodaje, kvalitetnijih upita i vidljivosti koja vodi do konkretne radnje.',
    items: [
      { title: 'Performance marketing', price: 'od 300 €', text: 'Meta, Google, mjerenje i optimizacija prema poslovnom rezultatu.', href: '/usluge/performance-marketing/' },
      { title: 'Sadržaj za kampanje', price: 'od 250 €', text: 'Kreativni pravci, video, foto, UGC i varijante spremne za testiranje.', href: '/usluge/sadrzaj-za-kampanje/' },
      { title: 'Landing i konverzije', price: 'od 550 €', text: 'Odredišne stranice i korisnički tok koji kampanji daju gdje da konvertuje.', href: '/usluge/web-i-konverzije/' },
    ],
  },
  {
    index: '02', title: 'Web i digitalni proizvodi', short: 'Web',
    text: 'Od fokusirane landing stranice do kompleksnije platforme sa jasnim korisničkim tokom i integracijama.',
    items: [
      { title: 'Landing stranica', price: 'od 550 €', text: 'Jedna jasna ponuda, jedan cilj i minimum trenja do kontakta ili prijave.', href: '/usluge/web-i-konverzije/' },
      { title: 'Premium mini-sajt', price: 'od 900 €', text: 'Ozbiljnija digitalna prezentacija sa više sadržaja, stranica i integracija.', href: '/usluge/web-i-konverzije/' },
      { title: 'Digitalni proizvod', price: 'po specifikaciji', text: 'Platforme, prijavni sistemi i proizvodi sa posebnom poslovnom logikom.', href: '/usluge/web-i-konverzije/' },
    ],
  },
  {
    index: '03', title: 'Aktivacije i eventi', short: 'Aktivacije',
    text: 'Koncept, produkcija, ljudi, lokacije, logistika i izvještaj kroz jednu odgovornu realizaciju.',
    items: [
      { title: 'Plan aktivacije', price: 'od 500 €', text: 'Koncept, mehanika, operativna mapa i budžetska struktura.', href: '/usluge/aktivacije-i-eventi/' },
      { title: 'Produkcija i koordinacija', price: 'od 1.500 €', text: 'Tim, lokacije, smjene, logistika, supervizija i izvještaj.', href: '/usluge/aktivacije-i-eventi/' },
      { title: 'Kompletna kampanja', price: 'po ponudi', text: 'Digital, produkcija, ljudi, teren i sadržaj povezani kroz isti cilj.', href: '/usluge/aktivacije-i-eventi/' },
    ],
  },
  {
    index: '04', title: 'Timovi i angažmani', short: 'Timovi',
    text: 'Pronalazak i organizacija ljudi za promocije, događaje, sezonske potrebe i kampanje zapošljavanja.',
    items: [
      { title: 'Recruitment sprint', price: 'od 400 €', text: 'Oglas, employer ponuda, prijavni flow, kampanjska postavka i distribucija.', href: '/usluge/recruitment-kampanje/' },
      { title: 'Sezonska kampanja', price: 'od 800 €', text: 'Više pozicija, kreativni paket, distribucija i kontinuirana optimizacija.', href: '/usluge/recruitment-kampanje/' },
      { title: 'Promo i event timovi', price: 'po obimu', text: 'Sourcing, briefing, rasporedi, zamjene i operativna kontrola na terenu.', href: '/usluge/aktivacije-i-eventi/' },
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
const budgetLabels: Record<string, string> = { under500: 'Do 500 €', '500-1500': '500 - 1.500 €', '1500-5000': '1.500 - 5.000 €', '5000plus': '5.000 €+' }

function recommendationFor(state: ChoiceState) {
  if (!state.goal || !state.mode || !state.budget) return null
  if (state.goal === 'web') {
    if (state.budget === 'under500') return { title: 'Web dijagnostika i struktura', text: 'Prvo zaključavamo sadržaj, korisnički tok i prioritetne funkcionalnosti prije produkcije.', href: '/usluge/web-i-konverzije/' }
    if (state.budget === '500-1500') return { title: 'Landing ili premium mini-sajt', text: 'Najrealniji prvi proizvod je fokusirana landing stranica ili manji premium sajt.', href: '/usluge/web-i-konverzije/' }
    return { title: 'Digitalni proizvod', text: 'Budžetski okvir dozvoljava ozbiljniji web sistem, integracije i širi korisnički flow.', href: '/usluge/web-i-konverzije/' }
  }
  if (state.goal === 'event' || state.goal === 'complex') {
    if (state.budget === 'under500') return { title: 'Plan aktivacije', text: 'Najpametnije je prvo zaključati koncept, logistiku i budžetsku strukturu.', href: '/usluge/aktivacije-i-eventi/' }
    return { title: 'Produkcija i koordinacija', text: 'Za ovaj tip projekta treba jedna odgovorna tačka za ljude, lokacije, produkciju i teren.', href: '/usluge/aktivacije-i-eventi/' }
  }
  if (state.goal === 'people') {
    if (state.budget === 'under500') return { title: 'Recruitment sprint', text: 'Fokusirana kampanja za jednu poziciju ili jasno definisan hiring cilj.', href: '/usluge/recruitment-kampanje/' }
    return { title: 'Sezonska recruitment kampanja', text: 'Više pozicija, veći broj kandidata i kontinuirana distribucija traže širi proizvod.', href: '/usluge/recruitment-kampanje/' }
  }
  if (state.mode === 'ongoing') return { title: 'Mjesečno vođenje kampanja', text: 'Kontinuirano testiranje, optimizacija i razvoj kreativa oko istog poslovnog cilja.', href: '/usluge/performance-marketing/' }
  if (state.budget === 'under500') return { title: 'Dijagnostika i plan', text: 'Prvo preciziramo ponudu, mjerenje i prioritete prije većeg medijskog ulaganja.', href: '/usluge/performance-marketing/' }
  return { title: 'Postavka kampanje', text: 'Kampanjska struktura, tracking, oglasi i kontrolisano pokretanje.', href: '/usluge/performance-marketing/' }
}

export function OfferChooser() {
  const [state, setState] = useState<ChoiceState>({ goal: '', mode: '', budget: '' })
  const recommendation = useMemo(() => recommendationFor(state), [state])
  const briefHref = useMemo(() => {
    if (!recommendation) return '/kontakt/?izvor=chooser'
    const params = new URLSearchParams({ izvor: 'chooser', cilj: goalLabels[state.goal], model: modeLabels[state.mode], budzet: budgetLabels[state.budget], preporuka: recommendation.title })
    return `/kontakt/?${params.toString()}`
  }, [recommendation, state])

  const choice = (group: keyof ChoiceState, value: string, label: string) => <button type="button" className={`sales-choice${state[group] === value ? ' is-selected' : ''}`} aria-pressed={state[group] === value} onClick={() => setState((current) => ({ ...current, [group]: value }))}>{label}</button>

  return (
    <section className="sales-chooser section" id="pronadji-model"><div className="container"><div className="sales-chooser-shell">
      <div className="sales-chooser-head"><div><span className="eyebrow">Brza preporuka</span><h2>3 pitanja. Konkretan proizvod.</h2></div><p>Odgovor ne određuje finalni scope, ali vas odmah vodi ka najbližoj opciji i prenosi kontekst u brief.</p></div>
      <div className="sales-chooser-grid">
        <div className="sales-chooser-step"><small>01 - cilj</small><h3>Šta želite da postignete?</h3><div className="sales-choice-list">{choice('goal','growth','Više prodaje ili upita')}{choice('goal','web','Novi sajt ili platformu')}{choice('goal','event','Promociju ili događaj')}{choice('goal','people','Pronaći i organizovati ljude')}{choice('goal','complex','Kompleksan projekat')}</div></div>
        <div className="sales-chooser-step"><small>02 - potreba</small><h3>Da li je potreba jednokratna?</h3><div className="sales-choice-list">{choice('mode','one','Da, jedan projekat')}{choice('mode','ongoing','Treba nam kontinuirano')}{choice('mode','unsure','Još nijesmo sigurni')}</div></div>
        <div className="sales-chooser-step"><small>03 - okvir</small><h3>Koji je okvirni budžet?</h3><div className="sales-choice-list">{choice('budget','under500','Do 500 €')}{choice('budget','500-1500','500 - 1.500 €')}{choice('budget','1500-5000','1.500 - 5.000 €')}{choice('budget','5000plus','5.000 €+')}</div></div>
      </div>
      <div className="sales-recommendation"><div className="sales-recommendation-copy"><span>{recommendation ? 'Preporučeni proizvod' : 'Preporuka'}</span><strong>{recommendation?.title || 'Izaberite tri odgovora iznad.'}</strong><p>{recommendation?.text || 'Ne morate pogoditi savršeno - finalni obim zaključavamo tek nakon briefa.'}</p></div><div className="sales-recommendation-actions">{recommendation ? <Link className="button button-ghost" href={recommendation.href}>Pogledaj proizvod</Link> : null}<Link className="button button-primary" href={briefHref}>Pošalji brief</Link></div></div>
    </div></div></section>
  )
}
