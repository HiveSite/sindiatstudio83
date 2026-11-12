'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { site } from '@/data/site'
import { getFirstTouchData, getStoredCampaignData, trackEvent } from '@/lib/tracking'

function safeStorageValue(storage: 'local' | 'session', key: string): string {
  try {
    return (storage === 'local' ? window.localStorage : window.sessionStorage).getItem(key) || ''
  } catch {
    return ''
  }
}

const requestTimeoutMs = 15000

type FormState = 'idle' | 'loading' | 'error' | 'success'

type QueryContext = {
  service: string
  industry: string
  source: string
  collaborationModel: string
  recommendation: string
  product: string
  focus: string
}

const goalOptions = [
  'Više prodaje ili upita',
  'Novi sajt ili platforma',
  'Promocija ili događaj',
  'Ljudi i angažmani',
  'Kompleksan projekat',
  'Nijesam siguran - treba mi preporuka',
]

const budgetOptions = ['Do 150 €', '150 - 500 €', '500 - 1.500 €', '1.500 €+']
const enGoalOptions = ['More sales or enquiries', 'A new website or platform', 'A promotion or event', 'Recruitment or field teams', 'A complex project', 'I need a recommendation']
const enBudgetOptions = ['Up to €150', '€150 - €500', '€500 - €1,500', '€1,500+']

export function LeadForm({ compact = false, source = 'contact-page', locale = 'me' }: { compact?: boolean; source?: string; locale?: 'me' | 'en' }) {
  const router = useRouter()
  const english = locale === 'en'
  const formGoals = english ? enGoalOptions : goalOptions
  const formBudgets = english ? enBudgetOptions : budgetOptions
  const formRef = useRef<HTMLFormElement | null>(null)
  const startedRef = useRef(false)
  const [status, setStatus] = useState('')
  const [goal, setGoal] = useState('')
  const [budget, setBudget] = useState('')
  const [queryContext, setQueryContext] = useState<QueryContext>({ service: '', industry: '', source, collaborationModel: '', recommendation: '', product: '', focus: '' })
  const [state, setState] = useState<FormState>('idle')

  const selectedService = queryContext.service
  const selectedIndustry = queryContext.industry
  const sourceParam = queryContext.source

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const goalParam = params.get('cilj') || ''
    const budgetParam = params.get('budzet') || ''
    const nextContext = {
      service: params.get('usluga') || '',
      industry: params.get('industrija') || '',
      source: params.get('izvor') || source,
      collaborationModel: params.get('model') || '',
      recommendation: params.get('preporuka') || '',
      product: params.get('proizvod') || '',
      focus: goalParam && !formGoals.includes(goalParam) ? goalParam : '',
    }
    setQueryContext(nextContext)
    if (formGoals.includes(goalParam)) setGoal(goalParam)
    if (formBudgets.includes(budgetParam)) setBudget(budgetParam)

    if (nextContext.product) {
      setStatus(english ? `Selected service: ${nextContext.product}. Add your contact details and a short description.` : `Izabrani proizvod: ${nextContext.product}. Dodaj kontakt, rok i kratak kontekst projekta.`)
    } else if (nextContext.recommendation) {
      setStatus(english ? `Recommended option: ${nextContext.recommendation}. Tell us about your project.` : `Prenijeli smo tvoj izbor. Preporučeni proizvod: ${nextContext.recommendation}. Dodaj kontakt, rok i kratak kontekst.`)
    } else if (nextContext.focus) {
      setStatus(english ? `Enquiry topic: ${nextContext.focus}. Please add your details.` : `Tema upita: ${nextContext.focus}. Izaberi cilj i dodaj kontakt kako bismo znali šta ti treba.`)
    } else if (nextContext.service || nextContext.industry) {
      setStatus(english ? 'Your chosen service has been saved. Please tell us about the project.' : 'Prepoznali smo stranicu sa koje dolaziš. Dodaj kontakt, rok i najvažniji kontekst.')
    }
  }, [source, locale])

  const startTracking = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('form_start', {
      form_name: 'lead_form', form_source: sourceParam, service: selectedService, industry: selectedIndustry,
      recommendation: queryContext.recommendation, product: queryContext.product,
    })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = formRef.current
    if (!form || state === 'loading') return
    const fd = new FormData(form)
    if (fd.get('website')) return

    if (!form.checkValidity()) {
      form.reportValidity(); setStatus(english ? 'Please complete the required fields.' : 'Provjeri označena obavezna polja.'); setState('error')
      trackEvent('form_error', { form_name: 'lead_form', reason: 'validation', form_source: sourceParam }); return
    }

    const email = String(fd.get('email') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const payload = {
      name: String(fd.get('name') || '').trim(), email, phone, contact: [email, phone].filter(Boolean).join(' / '),
      goal: String(fd.get('goal') || '').trim(), budget: String(fd.get('budget') || '').trim(), deadline: String(fd.get('deadline') || '').trim(),
      projectState: String(fd.get('projectState') || '').trim(), message: String(fd.get('message') || '').trim(),
      collaborationModel: queryContext.collaborationModel, recommendation: queryContext.recommendation, product: queryContext.product, focus: queryContext.focus,
      service: selectedService, industry: selectedIndustry, url: window.location.href,
      landingPage: safeStorageValue('session', 'sindikat_landing_page'), referrer: document.referrer, source: sourceParam,
      consentChoice: safeStorageValue('local', 'sindikat_cookie_consent'), submittedAt: new Date().toISOString(),
      ...getStoredCampaignData(), ...getFirstTouchData(),
    }

    setState('loading'); setStatus(english ? 'Sending your enquiry...' : 'Šaljemo upit...')
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs)

    try {
      const response = await fetch(site.integrations.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller.signal })
      const responseText = await response.text(); let result: { ok?: boolean; error?: string } = {}
      try { result = responseText ? JSON.parse(responseText) as typeof result : {} } catch { result = {} }
      if (!response.ok || result.ok !== true) throw new Error(result.error || `HTTP ${response.status}`)

      trackEvent('generate_lead', { form_name: 'lead_form', goal: payload.goal, budget: payload.budget, form_source: sourceParam, service: selectedService, industry: selectedIndustry, recommendation: queryContext.recommendation, product: queryContext.product })
      form.reset(); setGoal(''); setBudget(''); setStatus(english ? 'Thank you. Your enquiry has been sent. We aim to reply within one business day.' : `Hvala. Upit je poslat. ${site.responseTime}`); setState('success')
      window.setTimeout(() => router.push(`${english ? '/en/hvala/' : '/hvala/'}?source=${encodeURIComponent(sourceParam)}`), 800)
    } catch (error) {
      const reason = error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'network'
      if (process.env.NODE_ENV === 'development') console.error(error); setStatus(english ? `We could not confirm delivery. Please try again or email ${site.email}.` : `Slanje nije potvrđeno. Probaj ponovo ili piši direktno na ${site.email}.`); setState('error')
      trackEvent('form_error', { form_name: 'lead_form', reason, form_source: sourceParam })
    } finally { window.clearTimeout(timeout) }
  }

  const contextTitle = queryContext.product || queryContext.recommendation || queryContext.focus

  return (
    <form ref={formRef} className={`lead-form${compact ? ' lead-form-compact' : ''}`} onInput={startTracking} onSubmit={submit} noValidate aria-busy={state === 'loading'}>
      {contextTitle ? <div className="brief-context"><span>{queryContext.product ? (english ? 'Selected option' : 'Izabrani proizvod') : queryContext.recommendation ? (english ? 'Recommended option' : 'Preporučeni proizvod') : (english ? 'Enquiry topic' : 'Tema upita')}</span><strong>{contextTitle}</strong>{queryContext.collaborationModel ? <small>{queryContext.collaborationModel}</small> : null}</div> : null}
      <div className="form-grid">
        <label><span>{english ? 'Name and company *' : 'Ime i firma *'}</span><input name="name" autoComplete="name" required maxLength={120} placeholder={english ? 'Your name / Company or project' : 'Ime / Naziv firme ili projekta'} /></label>
        <label><span>Email *</span><input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="marko@email.com" /></label>
        <label><span>{english ? 'Phone' : 'Telefon'}</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="+382..." /></label>
        <label><span>{english ? 'What do you want to achieve? *' : 'Šta želiš da postigneš? *'}</span><select name="goal" required value={goal} onChange={(event) => setGoal(event.target.value)}><option value="">{english ? 'Choose a goal' : 'Izaberi cilj'}</option>{formGoals.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>{english ? 'Indicative budget' : 'Okvirni budžet'}</span><select name="budget" value={budget} onChange={(event) => setBudget(event.target.value)}><option value="">{english ? 'Not decided yet' : 'Još nije definisan'}</option>{formBudgets.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>{english ? 'When would you like to start?' : 'Kada projekat treba da krene?'}</span><select name="deadline" defaultValue=""><option value="">{english ? 'Timing not fixed yet' : 'Rok još nije zaključan'}</option>{(english ? ['As soon as possible', 'Within 30 days', 'In 1-3 months', 'Later / planning ahead'] : ['Što prije', 'U narednih 30 dana', 'Za 1-3 mjeseca', 'Kasnije / priprema unaprijed']).map(x=><option key={x}>{x}</option>)</select></label>
        <label className="form-span"><span>{english ? 'What do you already have?' : 'Šta već postoji?'}</span><select name="projectState" defaultValue=""><option value="">{english ? 'Select an option' : 'Izaberi najbliže'}</option>{(english ? ['An idea and a goal', 'An existing website or product', 'Active campaigns and materials', 'An in-house team or other partners', 'An existing system that needs improving', 'Other / a combination'] : ['Imamo samo ideju i cilj', 'Imamo postojeći sajt ili digitalni proizvod', 'Imamo aktivne kampanje i materijale', 'Imamo interni tim ili druge partnere', 'Imamo sistem koji treba unaprijediti', 'Drugo / kombinacija']).map(x=><option key={x}>{x}</option>)</select></label>
        <label className="form-span"><span>{english ? 'Brief project description' : 'Kratak opis projekta'}</span><textarea name="message" rows={6} maxLength={3000} placeholder={english ? 'What do you need, where is the project and what is the main challenge?' : 'Napiši najvažniji problem, lokaciju, šta već postoji i gdje trenutno zapinje.'} /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-submit"><button className="button button-primary" type="submit" disabled={state === 'loading'}>{state === 'loading' ? (english ? 'Sending...' : 'Šaljem...') : (english ? 'Send enquiry' : 'Pošalji upit')}</button><p>{english ? <>By sending this enquiry, you agree to our <Link href="/en/privatnost/">privacy policy</Link>. We aim to reply within one business day.</> : <>Slanjem upita prihvataš <Link href="/privatnost/">pravila privatnosti</Link>. {site.responseTime}</>}</p></div>
      <div className={`form-status${state === 'error' ? ' is-error' : state === 'success' ? ' is-success' : ''}`} role="status" aria-live="polite" aria-atomic="true">{status}</div>
    </form>
  )
}
