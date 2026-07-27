import Link from 'next/link'

export default function NotFound() {
  return <section className="section"><div className="container final-cta-panel center"><span className="eyebrow">404</span><h1 style={{ fontSize: 'clamp(58px,10vw,110px)', marginTop: 25 }}>Ova stranica nije pronađena.</h1><p className="lead" style={{ marginInline: 'auto' }}>Link je možda promijenjen tokom nove strukture. Stari važni URL-ovi imaju redirect, a odavde možeš nastaviti na glavne sekcije.</p><div className="button-row" style={{ justifyContent: 'center', marginTop: 30 }}><Link className="button button-primary" href="/">Početna</Link><Link className="button button-ghost" href="/usluge/">Usluge</Link></div></div></section>
}
