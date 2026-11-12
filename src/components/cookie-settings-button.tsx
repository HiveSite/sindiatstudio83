'use client'

import { usePathname } from 'next/navigation'

export function CookieSettingsButton() {
  const english = usePathname().startsWith('/en')
  return <button className="footer-link-button" type="button" onClick={() => window.dispatchEvent(new Event('sindikat:open-cookie-settings'))}>{english ? 'Cookie settings' : 'Podešavanja kolačića'}</button>
}
