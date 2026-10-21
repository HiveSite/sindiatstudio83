import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'

export const dynamic = 'force-static'

const absoluteUrl = (path: string) => new URL(path, site.domain).toString()
// Avoid claiming that every route changed on the same unverified date.

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), images: [absoluteUrl('/images/brand/og-cover.png')] },
    { url: absoluteUrl('/usluge/') },
    { url: absoluteUrl('/industrije/') },
    { url: absoluteUrl('/radovi/') },
    { url: absoluteUrl('/o-nama/') },
    { url: absoluteUrl('/blog/') },
    { url: absoluteUrl('/kontakt/') },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((item) => ({
    url: absoluteUrl(`/usluge/${item.slug}/`),
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((item) => ({
    url: absoluteUrl(`/industrije/${item.slug}/`),
  }))

  const caseRoutes: MetadataRoute.Sitemap = cases.map((item) => {
    const image = item.socialImage?.src || item.coverImage?.src
    return {
      url: absoluteUrl(`/radovi/${item.slug}/`),
      images: image ? [absoluteUrl(image)] : undefined,
    }
  })

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((item) => ({
    url: absoluteUrl(`/blog/${item.slug}/`),
    lastModified: item.date ? new Date(`${item.date}T00:00:00.000Z`) : undefined,
    images: item.cover ? [absoluteUrl(item.cover)] : undefined,
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...caseRoutes,
    ...blogRoutes,
  ]
}
