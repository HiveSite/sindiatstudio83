'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const areas = [
  {
    index: '01',
    title: 'Kampanje i rast',
    text: 'Za više prodaje, kvalitetnijih upita i vidljivosti koja vodi do konkretne radnje.',
    tags: ['Meta i Google', 'kreativa', 'landing', 'tracking'],
    href: '/usluge/performance-marketing/',
    accent: 'pink',
  },
  {
    index: '02',
    title: 'Web i digitalni proizvodi',
    text: 'Od landing stranice do kompleksnije platforme - jasno, brzo, mobilno i mjerljivo.',
    tags: ['web sajtovi', 'landing', 'UX/UI', 'platforme'],
    href: '/usluge/web-i-konverzije/',
    accent: 'yellow',
  },
  {
    index: '03',
    title: 'Aktivacije i eventi',
    text: 'Od koncepta do kompletne realizacije - produkcija, logistika, tim i dokaz sa terena.',
    tags: ['koncept', 'produkcija', 'logistika', 'teren'],
    href: '/usluge/aktivacije-i-eventi/',
    accent: 'cyan',
  },
  {
    index: '04',
    title: 'Timovi i angažmani',
    text: 'Ljudi za promocije, događaje i operativne potrebe - sourcing, briefing i organizacija.',
    tags: ['hostese', 'promoteri', 'staffing', 'recruitment'],
    href: '/usluge/recruitment-kampanje/',
    accent: 'green',
  },
] as const

export function OfferAreas() {
  return (
    <section className="sales-solutions section" id="izaberi-rjesenje">
      <div className="container">
        <div className="sales-section-head">
          <div>
            <span className="eyebrow">Šta vam treba?</span>
            <h2>Izaberite cilj. Ne morate znati naziv usluge.</h2>
          </div>
          <p>Mi slažemo kanale, produkciju i ljude iza cilja. Vi samo treba da znate šta želite da promijenite.</p>
        </div>
        <div className="sales-area-grid">
          {areas.map((area) => (
            <Link key={area.href} href={area.href} className={`sales-area-card sales-area-${area.accent}`}>
              <span className="sales-area-index">{area.index}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
              <div className="sales-area-tags">{area.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <span className="sales-area-link">Pogledaj rješenje <b>↗</b></span>
            </Link>
          ))}
        </div>
        <div className="sales-unsure">
          <div><strong>Nijeste sigurni gdje pripada vaš projekat?</strong><span>Opišite problem, a mi ćemo složiti pravi prvi korak.</span></div>
          <Link className="button button-ghost" href="#pronadji-model">Pronađi šta mi treba</Link>
        </div>
      </div>
    </section>
  )
}

export function EngagementModels() {
  return (
    <section className="sales-models section" id="saradnja">
      <div className="container">
        <div className="sales-section-head">
          <div><span className="eyebrow">Kako sarađujemo</span><h2>Tri jasna načina da radimo zajedno.</h2></div>
          <p>Ne kupujete listu zadataka. Birate nivo odgovornosti koji treba da preuzmemo.</p>
        </div>
        <div className="sales-model-grid">
          <article className="sales-model-card">
            <span className="sales-model-kicker">Jedan konkretan problem</span>
            <h3>Sprint</h3>
            <p>Za projekat sa jasnim početkom, isporukom i rokom.</p>
            <ul><li>definisan cilj i obim</li><li>jedna odgovorna osoba</li><li>jasan rok i predaja</li><li>bez otvorene liste zahtjeva</li></ul>
            <div className="sales-model-price"><strong>od 500 €</strong><span>jednokratno</span></div>
          </article>
          <article className="sales-model-card is-featured">
            <span className="sales-model-kicker">Kontinuirani rast</span>
            <h3>Partnerstvo</h3>
            <p>Za firme kojima treba stalni digitalni i marketinški partner.</p>
            <ul><li>kampanje i optimizacija</li><li>kreativa i sadržaj</li><li>web podrška po prioritetu</li><li>redovan pregled rezultata</li></ul>
            <div className="sales-model-price"><strong>od 600 € / mj.</strong><span>kontinuirano</span></div>
          </article>
          <article className="sales-model-card">
            <span className="sales-model-kicker">Jedna tačka odgovornosti</span>
            <h3>Full execution</h3>
            <p>Za projekte gdje digital, produkcija, ljudi i teren moraju da rade kao jedan sistem.</p>
            <ul><li>plan i project management</li><li>digital i kreativna produkcija</li><li>timovi, logistika i teren</li><li>izvještaj i naredni potez</li></ul>
            <div className="sales-model-price"><strong>od 1.500 €</strong><span>prema obimu</span></div>
          </article>
        </div>
        <p className="sales-model-note">Medijski budžet, zakup, transport, osoblje i eksterni produkcijski troškovi odvajaju se kada su potrebni.</p>
      </div>
    </section>
  )
}

type ChoiceState = {
  goal: string
  mode: string
  budget: string
}

const goalLabels: Record<string, string> = {
  growth: 'Više prodaje ili upita',
  web: 'Novi sajt ili platforma',
  event: 'Promocija ili događaj',
  people: 'Ljudi i angažmani',
  complex: 'Kompleksan projekat',
}

const modeLabels: Record<string, string> = {
  one: 'Jednokratan projekat',
  ongoing: 'Kontinuirana saradnja',
  unsure: 'Model još nije definisan',
}

const budgetLabels: Record<string, string> = {
  under500: 'Do 500 €',
  '500-1500': '500 - 1.500 €',
  '1500-5000': '1.500 - 5.000 €',
  '5000plus': '5.000 €+',
}

function recommendationFor(state: ChoiceState) {
  if (!state.goal || !state.mode || !state.budget) return null
  if (state.budget === 'under500') return { title: 'Početna dijagnostika', text: 'Sa ovim okvirom prvo preciziramo problem i biramo mali, kontrolisan prvi korak prije većeg projekta.' }
  if (state.goal === 'complex' || state.goal === 'event') return { title: 'Full execution', text: 'Preuzimamo koordinaciju digitala, produkcije, ljudi i realizacije kao jednog sistema.' }
  if (state.mode === 'ongoing') return { title: 'Partnerstvo', text: 'Kontinuirano vodimo prioritete, kampanje, sadržaj i optimizaciju oko istog poslovnog cilja.' }
  if (state.goal === 'web') return { title: 'Web & Digital Sprint', text: 'Struktura, UX/UI, razvoj, integracije i objava u jasno zaključanom projektu.' }
  if (state.goal === 'people') return { title: 'Timovi i angažmani', text: 'Sourcing, organizacija, briefing i operativa prema potrebnom broju ljudi i lokacija.' }
  return { title: 'Campaign Sprint', text: 'Jedan jasno definisan cilj, kampanjska postavka, kreativa, mjerenje i jasan rok za prvi ciklus.' }
}

export function OfferChooser() {
  const [state, setState] = useState<ChoiceState>({ goal: '', mode: '', budget: '' })
  const recommendation = useMemo(() => recommendationFor(state), [state])

  const briefHref = useMemo(() => {
    if (!recommendation) return '/kontakt/?izvor=chooser'
    const params = new URLSearchParams({
      izvor: 'chooser',
      cilj: goalLabels[state.goal],
      model: modeLabels[state.mode],
      budzet: budgetLabels[state.budget],
      preporuka: recommendation.title,
    })
    return `/kontakt/?${params.toString()}`
  }, [recommendation, state])

  const choice = (group: keyof ChoiceState, value: string, label: string) => (
    <button
      type="button"
      className={`sales-choice${state[group] === value ? ' is-selected' : ''}`}
      aria-pressed={state[group] === value}
      onClick={() => setState((current) => ({ ...current, [group]: value }))}
    >{label}</button>
  )

  return (
    <section className="sales-chooser section" id="pronadji-model">
      <div className="container">
        <div className="sales-chooser-shell">
          <div className="sales-chooser-head">
            <div><span className="eyebrow">Pronađi pravi model</span><h2>3 pitanja. Jedna preporuka.</h2></div>
            <p>Izaberite ono što je najbliže vašoj situaciji. Na kraju dobijate preporučeni pravac i brief sa već popunjenim kontekstom.</p>
          </div>
          <div className="sales-chooser-grid">
            <div className="sales-chooser-step"><small>01 - cilj</small><h3>Šta želite da postignete?</h3><div className="sales-choice-list">
              {choice('goal', 'growth', 'Više prodaje ili upita')}
              {choice('goal', 'web', 'Novi sajt ili platformu')}
              {choice('goal', 'event', 'Promociju ili događaj')}
              {choice('goal', 'people', 'Pronaći i organizovati ljude')}
              {choice('goal', 'complex', 'Kompleksan projekat')}
            </div></div>
            <div className="sales-chooser-step"><small>02 - ritam</small><h3>Kako projekat izgleda?</h3><div className="sales-choice-list">
              {choice('mode', 'one', 'Jednokratan projekat')}
              {choice('mode', 'ongoing', 'Treba nam kontinuirana podrška')}
              {choice('mode', 'unsure', 'Još nijesmo sigurni')}
            </div></div>
            <div className="sales-chooser-step"><small>03 - okvir</small><h3>Koji je okvirni budžet?</h3><div className="sales-choice-list">
              {choice('budget', 'under500', 'Do 500 €')}
              {choice('budget', '500-1500', '500 - 1.500 €')}
              {choice('budget', '1500-5000', '1.500 - 5.000 €')}
              {choice('budget', '5000plus', '5.000 €+')}
            </div></div>
          </div>
          <div className="sales-recommendation">
            <div className="sales-recommendation-copy">
              <span>{recommendation ? 'Preporuka za vas' : 'Preporuka'}</span>
              <strong>{recommendation?.title || 'Izaberite tri odgovora iznad.'}</strong>
              <p>{recommendation?.text || 'Ne morate pogoditi savršeno - brief ćemo finalno složiti zajedno.'}</p>
            </div>
            <div className="sales-recommendation-actions">
              <Link className="button button-primary" href={briefHref}>Pošalji brief</Link>
              <Link className="button button-ghost" href="/radovi/">Pogledaj radove</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
