import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BlogExplorer } from '@/components/blog-explorer'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Marketing, web i event vodiči za Crnu Goru'
const seoDescription = 'Praktični vodiči Sindikat Studio 83 o digitalnom marketingu, Meta i Google kampanjama, webu, SEO-u, aktivacijama, događajima i sadržaju u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/blog/',
})

export default function BlogPage() {
  const crumbs = [{ label: 'Resursi', href: '/blog/' }]
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: seoTitle, description: seoDescription, path: '/blog/', type: 'CollectionPage' }),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${site.domain}/blog/#blog`,
        name: 'Resursi Sindikat Studio 83',
        description: seoDescription,
        url: `${site.domain}/blog/`,
        inLanguage: site.locale,
        publisher: { '@id': `${site.domain}/#organization` },
      },
      itemListSchema({
        name: 'Marketing i web vodiči',
        path: '/blog/',
        items: blogPosts.map((post) => ({ name: post.title, href: `/blog/${post.slug}/` })),
      }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Resursi</span><h1>Praktični vodiči za timove koji moraju donijeti stvarnu odluku.</h1><p className="lead">Tekstovi razdvajaju problem, proces, trošak, rizik i mjerenje. Cilj nije da svaka tema završi prodajom usluge, već da lakše procijeniš šta treba raditi, kojim redom i šta može čekati.</p></div><aside className="page-hero-aside"><strong>Glavne teme</strong><ul><li>Meta, Google i mjerenje kampanja</li><li>landing stranice, SEO i konverzije</li><li>aktivacije, promo timovi i događaji</li><li>sadržaj, produkcija i zapošljavanje</li></ul></aside></div></div></section>
    <section className="section"><div className="container"><BlogExplorer initialPosts={blogPosts} /></div></section>
    <FinalCta title="Treba ti primjena na stvarnu situaciju?" text="Pošalji postojeći setup, cilj i rok. Izdvojićemo prioritetne korake, informacije koje nedostaju i dio koji još nije spreman za ulaganje." />
  </>
}
