import type { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Upit je poslat',
  description: 'Potvrda slanja upita Sindikat Studio 83.',
  path: '/hvala/',
  noIndex: true,
})

export default function ThankYouPage() {
  return <section className="section"><div className="container center"><span className="eyebrow">Upit je evidentiran</span><h1>Hvala na poruci.</h1><p className="lead">Pregledaćemo cilj, rok i okvir koji si poslao. Odgovaramo u roku od jednog radnog dana.</p><div className="button-row" style={{ justifyContent: 'center', marginTop: 28 }}><Link className="button button-primary" href="/">Nazad na početnu</Link><Link className="button button-ghost" href="/usluge/">Pregled usluga</Link></div></div></section>
}
