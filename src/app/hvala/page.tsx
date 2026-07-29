import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Upit je poslat',
  description: 'Potvrda slanja upita Sindikat Studio 83.',
  path: '/hvala/',
  noIndex: true,
})

export default function ThankYouPage() {
  return <section className="section"><div className="container center"><span className="eyebrow">Upit je evidentiran</span><h1>Hvala. Sada pregledamo kontekst, ne samo poruku.</h1><p className="lead">Provjerićemo cilj, rok, lokaciju, postojeće materijale i uslugu ili industriju iz koje je upit poslat. {site.responseTime}</p><div className="button-row" style={{ justifyContent: 'center', marginTop: 28 }}><Link className="button button-primary" href="/radovi/">Pogledaj projekte</Link><Link className="button button-ghost" href="/usluge/">Pregled usluga</Link></div></div></section>
}
