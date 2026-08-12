'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { site } from '@/data/site'
import { getFirstTouchData, getStoredCampaignData, trackEvent } from '@/lib/tracking'

const requestTimeoutMs = 15000

type FormState = 'idle' | 'loading' | 'error' | 'success'

type QueryContext = {
  service: string
  industry: string
  source: string
  collaborationModel: string
  recommendation: string
  product: string
}

const goalOptions = [
  'Više prodaje ili upita',
  'Novi sajt ili platforma',
  'Promocija ili događaj',
  'Ljudi i angažmani',
  'Kompleksan projekat',
  'Nijesam siguran - treba mi preporuka',
]

const budgetOptions = ['Do 500 €', '500 - 1.500 €', '1.500 - 5.000 €', '5.000 €+']

export function LeadForm({ compact = false, source = 'contact-page' }: { compact?: boolean; source?: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const startedRef = useRef(false)
  const [status, setStatus] = useState('')
  const [goal, setGoal] = useState('')
  const [budget, setBudget] = useState('')
  const [queryContext, setQueryContext] = useState<QueryContext>({ service: '', industry: '', source, collaborationModel: '', recommendation: '', product: '' })
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
    }
    setQueryContext(nextContext)
    if (goalOptions.includes(goalParam)) setGoal(goalParam)
    if (budgetOptions.includes(budgetParam)) setBudget(budgetParam)

    if (nextContext.product) {
      setStatus(`Izabrani proizvod: ${nextContext.product}. Dodaj kontakt, rok i kratak kontekst projekta.`)
    } else if (nextContext.recommendation) {
      setStatus(`Prenijeli smo tvoj izbor. Preporučeni proizvod: ${nextContext.recommendation}. Dodaj kontakt, rok i kratak kontekst.`)
    } else if (nextContext.service || nextContext.industry) {
      setStatus('Prepoznali smo stranicu sa koje dolaziš. Dodaj kontakt, rok i najvažniji kontekst.')
    }
  }, [source])

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
      form.reportValidity(); setStatus('Provjeri označena obavezna polja.'); setState('error')
      trackEvent('form_error', { form_name: 'lead_form', reason: 'validation', form_source: sourceParam }); return
    }

    const email = String(fd.get('email') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const payload = {
      name: String(fd.get('name') || '').trim(), email, phone, contact: [email, phone].filter(Boolean).join(' / '),
      goal: String(fd.get('goal') || '').trim(), budget: String(fd.get('budget') || '').trim(), deadline: String(fd.get('deadline') || '').trim(),
      projectState: String(fd.get('projectState') || '').trim(), message: String(fd.get('message') || '').trim(),
      collaborationModel: queryContext.collaborationModel, recommendation: queryContext.recommendation, product: queryContext.product,
      service: selectedService, industry: selectedIndustry, url: window.location.href,
      landingPage: sessionStorage.getItem('sindikat_landing_page') || '', referrer: document.referrer, source: sourceParam,
      consentChoice: localStorage.getItem('sindikat_cookie_consent') || '', submittedAt: new Date().toISOString(),
      ...getStoredCampaignData(), ...getFirstTouchData(),
    }

    setState('loading'); setStatus('Šaljemo brief...')
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs)

    try {
      const response = await fetch(site.integrations.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller.signal })
      const responseText = await response.text(); let result: { ok?: boolean; error?: string } = {}
      try { result = responseText ? JSON.parse(responseText) as typeof result : {} } catch { result = {} }
      if (!response.ok || result.ok === false) throw new Error(result.error || `HTTP ${response.status}`)

      trackEvent('generate_lead', { form_name: 'lead_form', goal: payload.goal, budget: payload.budget, form_source: sourceParam, service: selectedService, industry: selectedIndustry, recommendation: queryContext.recommendation, product: queryContext.product })
      form.reset(); setGoal(''); setBudget(''); setStatus(`Hvala. Upit je poslat. ${site.responseTime}`); setState('success')
      window.setTimeout(() => router.push(`/hvala/?source=${encodeURIComponent(sourceParam)}`), 800)
    } catch (error) {
      const reason = error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'network'
      console.error(error); setStatus(`Slanje nije potvrđeno. Probaj ponovo ili piši direktno na ${site.email}.`); setState('error')
      trackEvent('form_error', { form_name: 'lead_form', reason, form_source: sourceParam })
    } finally { window.clearTimeout(timeout) }
  }

  const contextTitle = queryContext.product || queryContext.recommendation

  return (
    <form ref={formRef} className={`lead-form${compact ? ' lead-form-compact' : ''}`} onInput={startTracking} onSubmit={submit} noValidate aria-busy={state === 'loading'}>
      {contextTitle ? <div className="brief-context"><span>{queryContext.product ? 'Izabrani proizvod' : 'Preporučeni proizvod'}</span><strong>{contextTitle}</strong>{queryContext.collaborationModel ? <small>{queryContext.collaborationModel}</small> : null}</div> : null}
      <div className="form-grid">
        <label><span>Ime i firma *</span><input name="name" autoComplete="name" required maxLength={120} placeholder="Ime / Naziv firme ili projekta" /></label>
        <label><span>Email *</span><input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="marko@email.com" /></label>
        <label><span>Telefon</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="+382..." /></label>
        <label><span>Šta želiš da postigneš? *</span><select name="goal" required value={goal} onChange={(event) => setGoal(event.target.value)}><option value="">Izaberi cilj</option>{goalOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>Okvirni budžet</span><select name="budget" value={budget} onChange={(event) => setBudget(event.target.value)}><option value="">Još nije definisan</option>{budgetOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>Kada projekat treba da krene?</span><select name="deadline" defaultValue=""><option value="">Rok još nije zaključan</option><option>Što prije</option><option>U narednih 30 dana</option><option>Za 1-3 mjeseca</option><option>Kasnije / priprema unaprijed</option></select></label>
        <label className="form-span"><span>Šta već postoji?</span><select name="projectState" defaultValue=""><option value="">Izaberi najbliže</option><option>Imamo samo ideju i cilj</option><option>Imamo postojeći sajt ili digitalni proizvod</option><option>Imamo aktivne kampanje i materijale</option><option>Imamo interni tim ili druge partnere</option><option>Imamo sistem koji treba unaprijediti</option><option>Drugo / kombinacija</option></select></label>
        <label className="form-span"><span>Kratak opis projekta</span><textarea name="message" rows={6} maxLength={3000} placeholder="Napiši najvažniji problem, lokaciju, šta već postoji i gdje trenutno zapinje." /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-submit"><button className="button button-primary" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Šaljem...' : 'Pošalji brief'}</button><p>Slanjem briefa prihvataš <Link href="/privatnost/">pravila privatnosti</Link>. {site.responseTime}</p></div>
      <div className={`form-status${state === 'error' ? ' is-error' : state === 'success' ? ' is-success' : ''}`} role="status" aria-live="polite">{status}</div>
    </form>
  )
}
