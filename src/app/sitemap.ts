import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'

export const dynamic = 'force-static'

const absoluteUrl = (path: string) => new URL(path, site.domain).toString()
const contentDate = new Date(`${site.contentUpdatedAt}T00:00:00.000Z`)

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: contentDate, images: [absoluteUrl('/images/brand/og-cover.png')] },
    { url: absoluteUrl('/usluge/'), lastModified: contentDate },
    { url: absoluteUrl('/industrije/'), lastModified: contentDate },
    { url: absoluteUrl('/radovi/'), lastModified: contentDate },
    { url: absoluteUrl('/o-nama/'), lastModified: contentDate },
    { url: absoluteUrl('/blog/'), lastModified: contentDate },
    { url: absoluteUrl('/kontakt/'), lastModified: contentDate },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((item) => ({
    url: absoluteUrl(`/usluge/${item.slug}/`),
    lastModified: contentDate,
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((item) => ({
    url: absoluteUrl(`/industrije/${item.slug}/`),
    lastModified: contentDate,
  }))

  const caseRoutes: MetadataRoute.Sitemap = cases.map((item) => {
    const image = item.socialImage?.src || item.coverImage?.src
    return {
      url: absoluteUrl(`/radovi/${item.slug}/`),
      lastModified: contentDate,
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
