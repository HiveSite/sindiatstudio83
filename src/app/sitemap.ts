import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/', '/usluge/', ...services.map((item) => `/usluge/${item.slug}/`),
    '/industrije/', ...industries.map((item) => `/industrije/${item.slug}/`),
    '/radovi/', ...cases.map((item) => `/radovi/${item.slug}/`),
    '/o-nama/', '/blog/', ...blogPosts.map((item) => `/blog/${item.slug}/`),
    '/kontakt/', '/postani-dio-tima/', '/privatnost/', '/kolacici/', '/uslovi-koriscenja/',
  ]
  const lastModified = new Date()
  return routes.map((route) => ({
    url: new URL(route, site.domain).toString(),
    lastModified,
    changeFrequency: route.startsWith('/blog/') ? 'monthly' : 'weekly',
    priority: route === '/' ? 1 : route.split('/').filter(Boolean).length === 1 ? 0.8 : 0.7,
  }))
}
