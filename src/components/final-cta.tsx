import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import Link from 'next/link'

export function FinalCta({
  title = 'Imaš projekat koji traži više od jednog dobavljača?',
  text = 'Pošalji cilj, rok, lokaciju i ono što već postoji. Dobićeš preporučeni prvi korak, ključne zavisnosti i pitanja koja treba zatvoriti prije ponude.',
  label = 'Pošalji početni brief',
  locale = 'sr',
}: { title?: string; text?: string; label?: string; locale?: SiteLocale }) {
  return (
    <section className="final-cta section"><div className="container final-cta-panel">
      <span className="eyebrow">{translate(locale,'Sljedeći korak','Next step')}</span>
      <h2>{locale === 'en' && title === 'Imaš projekat koji traži više od jednog dobavljača?' ? 'Have a project that needs more than one supplier?' : title}</h2><p>{locale === 'en' && text.startsWith('Pošalji cilj, rok, lokaciju') ? 'Send your goal, timeline, location and existing materials. We will recommend a realistic first step and a clear plan.' : text}</p>
      <div className="button-row"><Link className="button button-primary" href={localeHref(locale,"/kontakt/")} data-track="final_lead">{translate(locale,label,label === 'Pošalji početni brief' ? 'Send a brief' : label)}</Link><Link className="button button-ghost" href={localeHref(locale,"/radovi/")}>{translate(locale,'Pogledaj projekte','View projects')}</Link></div>
    </div></section>
  )
}
