import type { Metadata } from 'next'
import { site } from '@/data/site'

interface MetadataInput {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function createMetadata({
  title,
  description,
  path,
  image = '/images/brand/og-cover.png',
  imageAlt = site.name,
  type = 'website',
  noIndex = false,
}: MetadataInput): Metadata {
  const fullTitle = title.includes(site.shortName) ? title : `${title} | ${site.name}`
  const canonical = new URL(path, site.domain).toString()
  const imageUrl = new URL(image, site.domain).toString()

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type,
      locale: site.openGraphLocale,
      siteName: site.name,
      title: fullTitle,
      description,
      url: canonical,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [imageUrl] },
  }
}
