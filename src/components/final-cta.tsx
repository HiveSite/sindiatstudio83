import Link from 'next/link'

export function FinalCta({
  title = 'Imaš cilj. Hajde da složimo sistem koji ga podržava.',
  text = 'Pošalji okvir, rok i budžet. Dobićeš konkretan sljedeći korak, ne generičku prezentaciju.',
  label = 'Zatraži plan i procjenu',
}: { title?: string; text?: string; label?: string }) {
  return (
    <section className="final-cta section"><div className="container final-cta-panel">
      <span className="eyebrow">Sljedeći korak</span>
      <h2>{title}</h2><p>{text}</p>
      <div className="button-row"><Link className="button button-primary" href="/kontakt/" data-track="final_lead">{label}</Link><Link className="button button-ghost" href="/radovi/">Pogledaj radove</Link></div>
    </div></section>
  )
}
