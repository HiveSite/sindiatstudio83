import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: 'Digitalni proizvodi, kampanje, sadržaj, promo timovi, aktivacije i događaji u Crnoj Gori.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08080b',
    theme_color: '#08080b',
    lang: site.locale,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
