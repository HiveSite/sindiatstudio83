'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { site } from '@/data/site'
import { trackEvent } from '@/lib/tracking'

type Choice = 'accepted' | 'analytics' | 'rejected'
const storageKey = 'sindikat_cookie_consent'

export function CookieBanner() {
  const english = usePathname().startsWith('/en')
  const [visible, setVisible] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      const stored = raw ? JSON.parse(raw) as { choice?: Choice; version?: string } : null
      if (!stored?.choice || stored.version !== site.consentVersion) setVisible(true)
    } catch {
      setVisible(true)
    }

    const reopen = () => setVisible(true)
    window.addEventListener('sindikat:open-cookie-settings', reopen)
    return () => window.removeEventListener('sindikat:open-cookie-settings', reopen)
  }, [])

  useEffect(() => {
    if (visible) window.requestAnimationFrame(() => firstButtonRef.current?.focus())
  }, [visible])

  const setConsent = (choice: Choice) => {
    try { localStorage.setItem(storageKey, JSON.stringify({ choice, version: site.consentVersion, updatedAt: new Date().toISOString() })) } catch { /* Storage can be blocked; consent still applies for this visit. */ }
    const analyticsGranted = choice === 'accepted' || choice === 'analytics'
    const adsGranted = choice === 'accepted'
    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function (..._args: unknown[]) { window.dataLayer.push(arguments) }
    }
    window.gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: adsGranted ? 'granted' : 'denied',
      ad_user_data: adsGranted ? 'granted' : 'denied',
      ad_personalization: adsGranted ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    })
    trackEvent('consent_update', { consent_choice: choice, consent_version: site.consentVersion })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-description">
      <div><strong id="cookie-title">{english ? "Cookies and analytics" : "Kolačići i analitika"}</strong><p id="cookie-description">{english ? "Choose whether to allow analytics and advertising storage. The website works without either. You can change your choice in the footer." : "Izaberi da li dozvoljavaš mjerenje posjeta i posebne oglasne kolačiće. Sajt radi i bez njih. Izbor možeš promijeniti u footeru."}</p></div>
      <div className="cookie-actions">
        <button ref={firstButtonRef} className="button button-ghost button-small" type="button" onClick={() => setConsent('rejected')}>{english ? "Essential only" : "Samo neophodno"}</button>
        <button className="button button-ghost button-small" type="button" onClick={() => setConsent('analytics')}>{english ? "Analytics only" : "Samo analitika"}</button>
        <button className="button button-primary button-small" type="button" onClick={() => setConsent('accepted')}>{english ? "Accept all" : "Prihvati sve"}</button>
      </div>
    </div>
  )
}
