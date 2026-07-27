import type { Metadata } from 'next'
import { site } from '@/data/site'

interface MetadataInput {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function createMetadata({
  title,
  description,
  path,
  image = '/images/brand/og-cover.png',
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
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      type,
      locale: 'sr_ME',
      siteName: site.name,
      title: fullTitle,
      description,
      url: canonical,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  }
}
