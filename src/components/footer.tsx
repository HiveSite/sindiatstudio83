import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/data/site'
import { CookieBanner, CookieSettingsButton } from './cookie-banner'

export function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Image src="/images/brand/logo.png" width={180} height={180} alt="Sindikat Studio 83" />
            <p>Kampanje, sadržaj, ljudi i teren povezani kroz isti cilj.</p>
            <div className="footer-socials">
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" data-track="instagram_click">Instagram</a>
              <a href={`mailto:${site.email}`} data-track="email_click">Email</a>
            </div>
          </div>
          <div>
            <h2>Usluge</h2>
            <Link href="/usluge/performance-marketing/">Performance marketing</Link>
            <Link href="/usluge/aktivacije-i-eventi/">Aktivacije i eventi</Link>
            <Link href="/usluge/web-i-konverzije/">Web i konverzije</Link>
            <Link href="/usluge/recruitment-kampanje/">Recruitment kampanje</Link>
          </div>
          <div>
            <h2>Studio</h2>
            <Link href="/radovi/">Radovi</Link>
            <Link href="/industrije/">Industrije</Link>
            <Link href="/o-nama/">O nama</Link>
            <Link href="/blog/">Resursi</Link>
            <Link href="/postani-dio-tima/">Postani dio tima</Link>
          </div>
          <div>
            <h2>Kontakt</h2>
            <p>{site.location}</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <Link href="/kontakt/">Pošalji upit</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Sindikat Studio 83</span>
          <div><Link href="/privatnost/">Privatnost</Link><Link href="/kolacici/">Kolačići</Link><Link href="/uslovi-koriscenja/">Uslovi</Link><CookieSettingsButton /></div>
        </div>
      </footer>
      <div className="mobile-cta"><Link className="button button-primary" href="/kontakt/" data-track="mobile_sticky_lead">Zatraži plan</Link></div>
      <CookieBanner />
    </>
  )
}
