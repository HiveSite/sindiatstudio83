import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const defaultLastModified = new Date(site.updatedAt)
  const staticRoutes = [
    '/', '/usluge/', ...services.map((item) => `/usluge/${item.slug}/`),
    '/industrije/', ...industries.map((item) => `/industrije/${item.slug}/`),
    '/radovi/', ...cases.map((item) => `/radovi/${item.slug}/`),
    '/o-nama/', '/blog/', '/kontakt/', '/postani-dio-tima/', '/privatnost/', '/kolacici/', '/uslovi-koriscenja/',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: new URL(route, site.domain).toString(),
    lastModified: defaultLastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.split('/').filter(Boolean).length === 1 ? 0.8 : 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: new URL(`/blog/${post.slug}/`, site.domain).toString(),
    lastModified: post.date ? new Date(post.date) : defaultLastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...blogEntries]
}
