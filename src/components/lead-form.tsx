'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { site } from '@/data/site'
import { getFirstTouchData, getStoredCampaignData, trackEvent } from '@/lib/tracking'

const requestTimeoutMs = 15000

type FormState = 'idle' | 'loading' | 'error' | 'success'

export function LeadForm({ compact = false, source = 'contact-page' }: { compact?: boolean; source?: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const startedRef = useRef(false)
  const [status, setStatus] = useState('')
  const [queryContext, setQueryContext] = useState({ service: '', industry: '', source: source })
  const [state, setState] = useState<FormState>('idle')

  const selectedService = queryContext.service
  const selectedIndustry = queryContext.industry
  const sourceParam = queryContext.source

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextContext = { service: params.get('usluga') || '', industry: params.get('industrija') || '', source: params.get('izvor') || source }
    setQueryContext(nextContext)
    if (nextContext.service || nextContext.industry) setStatus('Prepoznali smo stranicu sa koje dolaziš. Dodaj kontakt, rok i najvažniji kontekst.')
  }, [source])

  const startTracking = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('form_start', {
      form_name: 'lead_form',
      form_source: sourceParam,
      service: selectedService,
      industry: selectedIndustry,
    })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = formRef.current
    if (!form || state === 'loading') return
    const fd = new FormData(form)
    if (fd.get('website')) return

    if (!form.checkValidity()) {
      form.reportValidity()
      setStatus('Provjeri označena obavezna polja.')
      setState('error')
      trackEvent('form_error', { form_name: 'lead_form', reason: 'validation', form_source: sourceParam })
      return
    }

    const email = String(fd.get('email') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const payload = {
      name: String(fd.get('name') || '').trim(),
      email,
      phone,
      contact: [email, phone].filter(Boolean).join(' / '),
      goal: String(fd.get('goal') || '').trim(),
      budget: String(fd.get('budget') || '').trim(),
      deadline: String(fd.get('deadline') || '').trim(),
      message: String(fd.get('message') || '').trim(),
      service: selectedService,
      industry: selectedIndustry,
      url: window.location.href,
      landingPage: sessionStorage.getItem('sindikat_landing_page') || '',
      referrer: document.referrer,
      source: sourceParam,
      consentChoice: localStorage.getItem('sindikat_cookie_consent') || '',
      submittedAt: new Date().toISOString(),
      ...getStoredCampaignData(),
      ...getFirstTouchData(),
    }

    setState('loading')
    setStatus('Šaljemo brief...')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs)

    try {
      const response = await fetch(site.integrations.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      const responseText = await response.text()
      let result: { ok?: boolean; error?: string } = {}
      try { result = responseText ? JSON.parse(responseText) as typeof result : {} } catch { result = {} }
      if (!response.ok || result.ok === false) throw new Error(result.error || `HTTP ${response.status}`)

      trackEvent('generate_lead', {
        form_name: 'lead_form',
        goal: payload.goal,
        budget: payload.budget,
        form_source: sourceParam,
        service: selectedService,
        industry: selectedIndustry,
      })
      form.reset()
      setStatus(`Hvala. Upit je poslat. ${site.responseTime}`)
      setState('success')
      window.setTimeout(() => router.push(`/hvala/?source=${encodeURIComponent(sourceParam)}`), 800)
    } catch (error) {
      const reason = error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'network'
      console.error(error)
      setStatus(`Slanje nije potvrđeno. Probaj ponovo ili piši direktno na ${site.email}.`)
      setState('error')
      trackEvent('form_error', { form_name: 'lead_form', reason, form_source: sourceParam })
    } finally {
      window.clearTimeout(timeout)
    }
  }

  return (
    <form ref={formRef} className={`lead-form${compact ? ' lead-form-compact' : ''}`} onInput={startTracking} onSubmit={submit} noValidate aria-busy={state === 'loading'}>
      <div className="form-grid">
        <label><span>Ime i firma *</span><input name="name" autoComplete="name" required maxLength={120} placeholder="Ime / Naziv firme ili projekta" /></label>
        <label><span>Email *</span><input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="marko@email.com" /></label>
        <label><span>Telefon</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="+382..." /></label>
        <label><span>Koji je glavni cilj? *</span><select name="goal" required defaultValue=""><option value="">Izaberi najbližu opciju</option><option>Novi digitalni proizvod ili sajt</option><option>Više kvalitetnih upita ili prodaje</option><option>Aktivacija, promo tim ili događaj</option><option>Sadržaj i kampanjska produkcija</option><option>Zapošljavanje i kandidati</option><option>Audit, plan ili druga situacija</option></select></label>
        <label><span>Status projekta</span><select name="budget" defaultValue=""><option value="">Tek istražujemo mogućnosti</option><option>Treba nam okvir i procjena</option><option>Imamo odobren okvir i tražimo partnera</option><option>Projekat treba podijeliti u faze</option></select></label>
        <label><span>Kada projekat treba da krene?</span><select name="deadline" defaultValue=""><option value="">Rok još nije zaključan</option><option>Što prije</option><option>U narednih 30 dana</option><option>Za 1-3 mjeseca</option><option>Kasnije / priprema unaprijed</option></select></label>
        <label className="form-span"><span>Kontekst projekta</span><textarea name="message" rows={6} maxLength={3000} placeholder="Šta želiš da promijeniš? Napiši rok, lokaciju, šta već postoji, ko je uključen i gdje trenutno zapinje." /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-submit"><button className="button button-primary" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Šaljem...' : 'Pošalji brief'}</button><p>Slanjem briefa prihvataš <Link href="/privatnost/">pravila privatnosti</Link>. {site.responseTime}</p></div>
      <div className={`form-status${state === 'error' ? ' is-error' : state === 'success' ? ' is-success' : ''}`} role="status" aria-live="polite">{status}</div>
    </form>
  )
}
