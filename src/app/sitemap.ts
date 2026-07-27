import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/', '/usluge/', '/industrije/', '/radovi/', '/o-nama/', '/blog/', '/kontakt/',
    '/postani-dio-tima/', '/privatnost/', '/kolacici/', '/uslovi-koriscenja/',
  ]
  const contentDate = new Date(`${site.contentUpdatedAt}T00:00:00.000Z`)

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route, site.domain).toString(),
      lastModified: contentDate,
      changeFrequency: route === '/' ? 'weekly' as const : 'monthly' as const,
      priority: route === '/' ? 1 : route.split('/').filter(Boolean).length === 1 ? 0.8 : 0.6,
    })),
    ...services.map((item) => ({ url: `${site.domain}/usluge/${item.slug}/`, lastModified: contentDate, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...industries.map((item) => ({ url: `${site.domain}/industrije/${item.slug}/`, lastModified: contentDate, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...cases.map((item) => ({ url: `${site.domain}/radovi/${item.slug}/`, lastModified: contentDate, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...blogPosts.map((item) => ({
      url: `${site.domain}/blog/${item.slug}/`,
      lastModified: new Date(`${item.date || site.contentUpdatedAt}T00:00:00.000Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
