'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}

type Choice = 'accepted' | 'rejected'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const choice = localStorage.getItem('sindikat_cookie_choice') as Choice | null
    if (!choice) setVisible(true)

    const openSettings = () => setVisible(true)
    window.addEventListener('sindikat:open-cookie-settings', openSettings)
    return () => window.removeEventListener('sindikat:open-cookie-settings', openSettings)
  }, [])

  const setConsent = (choice: Choice) => {
    localStorage.setItem('sindikat_cookie_choice', choice)
    window.gtag?.('consent', 'update', {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_user_data: choice === 'accepted' ? 'granted' : 'denied',
      ad_personalization: choice === 'accepted' ? 'granted' : 'denied',
    })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'consent_update', consent_choice: choice })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Podešavanja kolačića">
      <div><strong>Kolačići i analitika</strong><p>Koristimo analitiku da razumijemo kako sajt radi. Izbor možeš kasnije promijeniti kroz link u dnu sajta.</p></div>
      <div className="cookie-actions">
        <button className="button button-ghost button-small" type="button" onClick={() => setConsent('rejected')}>Odbij</button>
        <button className="button button-primary button-small" type="button" onClick={() => setConsent('accepted')}>Prihvati</button>
      </div>
    </div>
  )
}

export function CookieSettingsButton() {
  return (
    <button
      className="footer-cookie-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event('sindikat:open-cookie-settings'))}
    >
      Podešavanja kolačića
    </button>
  )
}
