import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JobsBoard, OpenApplicationButton } from '@/components/jobs-board'
import { JsonLd } from '@/components/json-ld'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({ title: 'Postani dio tima - angažmani i roster', description: 'Prijavi se za promotivne, event i terenske angažmane Sindikat Studio 83 u Podgorici i širom Crne Gore.', path: '/postani-dio-tima/' })

export default function JobsPage() {
  const crumbs = [{ label: 'Postani dio tima', href: '/postani-dio-tima/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Roster i angažmani</span><h1>Radi na promocijama, događajima i terenskim projektima.</h1><p className="lead">Ova stranica koristi postojeći Sindikat backend za aktivne angažmane i prijave. Za šire oglase za posao posjeti ImaPosla.me.</p><div className="button-row" style={{ marginTop: 30 }}><OpenApplicationButton /><a className="button button-ghost" href={site.imaposla} target="_blank" rel="noopener noreferrer" data-track="imaposla_click">ImaPosla.me</a></div></div><aside className="page-hero-aside"><strong>Prije prijave</strong><ul><li>unesi tačan kontakt</li><li>navedi grad i dostupnost u poruci</li><li>prijava ne garantuje angažman</li><li>uslovi se potvrđuju za svaku smjenu</li></ul></aside></div></div></section>
    <JobsBoard />
  </>
}
