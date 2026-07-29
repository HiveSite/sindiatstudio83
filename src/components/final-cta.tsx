import Link from 'next/link'

export function FinalCta({
  title = 'Imaš projekat koji traži više od jednog dobavljača?',
  text = 'Pošalji cilj, rok, lokaciju i ono što već postoji. Dobićeš preporučeni prvi korak, ključne zavisnosti i pitanja koja treba zatvoriti prije ponude.',
  label = 'Pošalji početni brief',
}: { title?: string; text?: string; label?: string }) {
  return (
    <section className="final-cta section"><div className="container final-cta-panel">
      <span className="eyebrow">Sljedeći korak</span>
      <h2>{title}</h2><p>{text}</p>
      <div className="button-row"><Link className="button button-primary" href="/kontakt/" data-track="final_lead">{label}</Link><Link className="button button-ghost" href="/radovi/">Pogledaj projekte</Link></div>
    </div></section>
  )
}
