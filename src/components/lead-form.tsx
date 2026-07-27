'use client'

import Link from 'next/link'
import { FormEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { site } from '@/data/site'

function getCampaignData() {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
  return Object.fromEntries(keys.map((key) => [key, new URLSearchParams(window.location.search).get(key) || sessionStorage.getItem(`sindikat_${key}`) || '']))
}

export function LeadForm({ compact = false, source = 'contact-page' }: { compact?: boolean; source?: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const startedRef = useRef(false)
  const [status, setStatus] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')

  const startTracking = () => {
    if (startedRef.current) return
    startedRef.current = true
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'form_start', form_name: 'lead_form', form_source: source })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = formRef.current
    if (!form) return
    const fd = new FormData(form)
    if (fd.get('website')) return
    if (!form.checkValidity()) {
      form.reportValidity()
      setStatus('Popuni obavezna polja.')
      setState('error')
      window.dataLayer.push({ event: 'form_error', form_name: 'lead_form', reason: 'validation' })
      return
    }

    const payload = {
      name: String(fd.get('name') || '').trim(),
      contact: String(fd.get('contact') || '').trim(),
      goal: String(fd.get('goal') || '').trim(),
      budget: String(fd.get('budget') || '').trim(),
      deadline: String(fd.get('deadline') || '').trim(),
      message: String(fd.get('message') || '').trim(),
      url: window.location.href,
      referrer: document.referrer,
      source,
      ...getCampaignData(),
    }

    setState('loading')
    setStatus('Slanje u toku...')
    try {
      const response = await fetch(site.integrations.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({} as { ok?: boolean; error?: string }))
      if (!response.ok || result.ok === false) throw new Error(result.error || `HTTP ${response.status}`)
      window.dataLayer.push({ event: 'generate_lead', form_name: 'lead_form', goal: payload.goal, budget: payload.budget, form_source: source })
      form.reset()
      setStatus('Hvala. Upit je poslat i javićemo se uskoro.')
      setState('success')
      window.setTimeout(() => router.push('/hvala/?source=contact'), 700)
    } catch (error) {
      console.error(error)
      setStatus(`Slanje nije prošlo. Probaj ponovo ili piši direktno na ${site.email}.`)
      setState('error')
      window.dataLayer.push({ event: 'form_error', form_name: 'lead_form', reason: 'network' })
    }
  }

  return (
    <form ref={formRef} className={`lead-form${compact ? ' lead-form-compact' : ''}`} onInput={startTracking} onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>Ime i firma *</span><input name="name" autoComplete="name" required placeholder="Marko / Naziv firme" /></label>
        <label><span>Email ili telefon *</span><input name="contact" autoComplete="email" required placeholder="marko@email.com / +382..." /></label>
        <label><span>Šta želiš da postigneš? *</span><select name="goal" required defaultValue=""><option value="">Izaberi cilj</option><option>Više upita ili prodaje</option><option>Aktivacija ili događaj</option><option>Novi sajt ili landing</option><option>Recruitment i kandidati</option><option>Sezonska kampanja</option><option>Drugo</option></select></label>
        <label><span>Okvirni budžet</span><select name="budget" defaultValue=""><option value="">Još nije definisan</option><option>do 500 €</option><option>500-1.500 €</option><option>1.500-5.000 €</option><option>5.000 €+</option></select></label>
        <label><span>Kada želiš da kreneš?</span><select name="deadline" defaultValue=""><option value="">Izaberi okvir</option><option>Što prije</option><option>U narednih 30 dana</option><option>Za 1-3 mjeseca</option><option>Kasnije / planiranje</option></select></label>
        <label className="form-span"><span>Kratak opis projekta</span><textarea name="message" rows={5} placeholder="Napiši šta već postoji, rok, lokaciju i najvažniji problem." /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-submit"><button className="button button-primary" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Šaljem...' : 'Pošalji upit'}</button><p>Slanjem forme prihvataš <Link href="/privatnost/">pravila privatnosti</Link>.</p></div>
      <div className={`form-status${state === 'error' ? ' is-error' : state === 'success' ? ' is-success' : ''}`} role="status" aria-live="polite">{status}</div>
    </form>
  )
}
