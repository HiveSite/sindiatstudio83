import type { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({ title: 'Hvala - upit je poslat', description: 'Hvala na upitu za Sindikat Studio 83. Pregledaćemo podatke i javiti se sa konkretnim sljedećim korakom.', path: '/hvala/', noIndex: true })

export default function ThankYouPage() {
  return <section className="section"><div className="container final-cta-panel center" style={{ marginTop: 40 }}><span className="eyebrow">Upit je primljen</span><h1 style={{ fontSize: 'clamp(48px,7vw,82px)', marginTop: 25 }}>Hvala. Sljedeći potez je na nama.</h1><p className="lead" style={{ marginInline: 'auto' }}>Pregledaćemo cilj, okvir i kontakt. Ako nedostaje važna informacija, prvo ćemo postaviti kratko pitanje prije nego što predložimo obim.</p><div className="button-row" style={{ justifyContent: 'center', marginTop: 30 }}><Link className="button button-primary" href="/">Nazad na početnu</Link><Link className="button button-ghost" href="/radovi/">Pogledaj radove</Link></div></div></section>
}
