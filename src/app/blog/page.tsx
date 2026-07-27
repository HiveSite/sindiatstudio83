import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BlogExplorer } from '@/components/blog-explorer'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { blogPosts } from '@/data/blog'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({
  title: 'Blog i vodiči',
  description: 'Praktični vodiči o Meta i Google kampanjama, eventima, aktivacijama, sadržaju, SEO-u i konverzijama u Crnoj Gori.',
  path: '/blog/',
})

export default function BlogPage() {
  const crumbs = [{ label: 'Resursi', href: '/blog/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Resursi</span><h1>Praktični vodiči za kampanje, aktivacije i lokalni rast.</h1><p className="lead">Tekstovi su namijenjeni vlasnicima i timovima koji žele da razumiju šta se stvarno radi, koliko djelova sistem ima i gdje najčešće nastaje problem.</p></div><aside className="page-hero-aside"><strong>Teme</strong><ul><li>Meta i Google kampanje</li><li>produkcija događaja i budžeti</li><li>aktivacije i mjerenje</li><li>landing, SEO i konverzije</li></ul></aside></div></div></section>
    <section className="section"><div className="container"><BlogExplorer initialPosts={blogPosts} /></div></section>
    <FinalCta title="Treba ti primjena, ne još jedan tekst?" text="Pošalji konkretnu situaciju i cilj. Pretvorićemo temu u prioritetni plan za tvoj biznis." />
  </>
}
