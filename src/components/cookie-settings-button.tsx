'use client'

export function CookieSettingsButton() {
  return <button className="footer-link-button" type="button" onClick={() => window.dispatchEvent(new Event('sindikat:open-cookie-settings'))}>Podešavanja kolačića</button>
}
