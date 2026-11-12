'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/data/site'
import { CookieBanner } from './cookie-banner'
import { CookieSettingsButton } from './cookie-settings-button'

export function Footer() {
  const pathname = usePathname()
  const english = pathname === '/en' || pathname.startsWith('/en/')
  const localized = (href: string) => english ? '/en' + href : href
  const tr = (me: string, en: string) => english ? en : me
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Image src="/images/brand/logo.png" width={180} height={180} alt="Sindikat Studio 83" />
            <p>{tr('Digitalni proizvodi, kampanje, sadržaj, ljudi i teren povezani kroz jedan cilj i jednu odgovornu realizaciju.', 'Digital products, campaigns, content, people and on-site delivery, connected by one responsible team.')}</p>
            <div className="footer-socials">
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" data-track="instagram_click">Instagram</a>
              <a href={`mailto:${site.email}`} data-track="email_click">Email</a>
            </div>
          </div>
          <div>
            <h2>{tr('Usluge','Services')}</h2>
            <Link href={localized('/usluge/performance-marketing/')}>{tr('Digitalno oglašavanje','Digital advertising')}</Link>
            <Link href={localized('/usluge/aktivacije-i-eventi/')}>{tr('Aktivacije i događaji','Events & activations')}</Link>
            <Link href={localized('/usluge/web-i-konverzije/')}>{tr('Sajtovi i digitalni proizvodi','Websites & digital products')}</Link>
            <Link href={localized('/usluge/sadrzaj-za-kampanje/')}>{tr('Sadržaj za kampanje','Content production')}</Link>
            <Link href={localized('/usluge/recruitment-kampanje/')}>{tr('Kampanje za zapošljavanje','Recruitment campaigns')}</Link>
          </div>
          <div>
            <h2>{tr('Studio','Studio')}</h2>
            <Link href={localized('/radovi/')}>{tr('Radovi','Projects')}</Link>
            <Link href={localized('/cijene/')}>{tr('Cijene i saradnja','Pricing & collaboration')}</Link>
            <Link href={localized('/industrije/')}>{tr('Industrije','Industries')}</Link>
            <Link href={localized('/o-nama/')}>{tr('O nama','About us')}</Link>
            <Link href={localized('/blog/')}>{tr('Resursi','Resources')}</Link>
            <a href={site.imaposla} data-track="imaposla_team_click">{tr('Postani dio tima','Join our team')}</a>
          </div>
          <div>
            <h2>{tr('Kontakt','Contact')}</h2>
            <p>{tr(site.location, 'Podgorica, Montenegro')}</p>
            <a href={`mailto:${site.email}`} data-track="email_click">{site.email}</a>
            <p>{tr(site.responseTime, 'We aim to reply within one business day.')}</p>
            <Link href={localized('/kontakt/?izvor=footer')} data-track="footer_lead">{tr('Pošalji upit','Send enquiry')}</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Sindikat Studio 83</span>
          <div><Link href={localized('/privatnost/')}>{tr('Privatnost','Privacy')}</Link><Link href={localized('/kolacici/')}>{tr('Kolačići','Cookies')}</Link><CookieSettingsButton /><Link href={localized('/uslovi-koriscenja/')}>{tr('Uslovi','Terms')}</Link></div>
        </div>
      </footer>
      <div className="mobile-cta"><Link className="button button-primary" href={localized('/kontakt/?izvor=mobile-sticky')} data-track="mobile_sticky_lead">{tr('Pošalji upit','Send enquiry')}</Link></div>
      <CookieBanner />
    </>
  )
}
