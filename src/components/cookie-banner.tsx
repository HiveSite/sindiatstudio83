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
    <div className="cookie-banner" data-cookie-banner>
      <div><strong>Kolačići i analitika</strong><p>Koristimo analitiku da razumijemo kako sajt radi. Izbor možeš kasnije promijeniti.</p></div>
      <div className="cookie-actions">
        <button className="button button-ghost button-small" type="button" onClick={() => setConsent('rejected')}>Odbij</button>
        <button className="button button-primary button-small" type="button" onClick={() => setConsent('accepted')}>Prihvati</button>
      </div>
    </div>
  )
}
