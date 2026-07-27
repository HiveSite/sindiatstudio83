'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/data/site'
import { trackEvent } from '@/lib/tracking'

type Choice = 'accepted' | 'rejected'
const storageKey = 'sindikat_cookie_consent'

export function CookieBanner() {
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
    localStorage.setItem(storageKey, JSON.stringify({ choice, version: site.consentVersion, updatedAt: new Date().toISOString() }))
    const granted = choice === 'accepted'
    window.gtag?.('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    })
    trackEvent('consent_update', { consent_choice: choice, consent_version: site.consentVersion })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-description">
      <div><strong id="cookie-title">Kolačići i analitika</strong><p id="cookie-description">Neophodna memorija radi uvijek. Analitiku i oglasne oznake aktiviramo prema tvom izboru, koji kasnije možeš promijeniti u footeru.</p></div>
      <div className="cookie-actions">
        <button ref={firstButtonRef} className="button button-ghost button-small" type="button" onClick={() => setConsent('rejected')}>Samo neophodno</button>
        <button className="button button-primary button-small" type="button" onClick={() => setConsent('accepted')}>Prihvati analitiku</button>
      </div>
    </div>
  )
}
