import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { legalPages } from '@/data/legal'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return Object.keys(legalPages).map((legal) => ({ legal })) }

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> {
  const { legal } = await params
  const page = legalPages[legal as keyof typeof legalPages]
  if (!page) return {}
  return createMetadata({ title: page.title, description: page.description, path: `/${legal}/` })
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params
  const page = legalPages[legal as keyof typeof legalPages]
  if (!page) notFound()
  const route = `/${legal}/`
  const crumbs = [{ label: page.title, href: route }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="section"><div className="container legal"><Breadcrumbs items={crumbs} /><span className="eyebrow" style={{ marginTop: 42 }}>Pravni dokument</span><h1>{page.title}</h1><p className="lead">{page.description}</p>{page.sections.map(([title, text], index) => <div key={title}>{index > 0 ? <h2>{title}</h2> : null}<p>{text}{title === 'Čuvanje i prava' || title === 'Kontakt' ? <> <a href={`mailto:${site.email}`}>{site.email}</a></> : null}</p></div>)}<p className="notice">Posljednja interna revizija: jul 2026. Prije produkcijske objave uskladiti sa stvarnim pravnim podacima firme.</p></div></section>
  </>
}
