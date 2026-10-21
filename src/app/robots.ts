import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio83-media/', '/comment-picker/', '/team-building/azul/'],
    },
    sitemap: `${site.domain}/sitemap.xml`,
    host: site.domain,
  }
}
