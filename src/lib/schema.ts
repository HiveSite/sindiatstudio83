import { site } from '@/data/site'

export type JsonLdValue = Record<string, unknown>

const absoluteUrl = (path: string) => new URL(path, site.domain).toString()

export function organizationSchema(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.domain}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.domain,
    description: 'Operativni studio iz Podgorice za digitalni marketing, web i digitalne proizvode, aktivacije, događaje, sadržaj i organizaciju timova u Crnoj Gori.',
    logo: {
      '@type': 'ImageObject',
      url: `${site.domain}/images/brand/logo.png`,
    },
    image: `${site.domain}/images/brand/og-cover.png`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Podgorica',
      addressCountry: 'ME',
    },
    areaServed: { '@type': 'Country', name: 'Montenegro' },
    sameAs: [site.instagram],
    contactPoint: [{
      '@type': 'ContactPoint',
      email: site.email,
      contactType: 'sales',
      areaServed: 'ME',
      availableLanguage: ['sr-Latn', 'en'],
    }],
    knowsLanguage: ['sr-Latn', 'en'],
    knowsAbout: [
      'digitalni marketing',
      'performance marketing',
      'web i digitalni proizvodi',
      'aktivacije i događaji',
      'promo timovi i event operativa',
      'sadržaj za kampanje',
      'recruitment kampanje',
    ],
  }
}

export function websiteSchema(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: site.name,
    alternateName: site.shortName,
    url: site.domain,
    description: 'Digitalni marketing, web, aktivacije, događaji, sadržaj i operativni timovi u Crnoj Gori.',
    inLanguage: site.locale,
    publisher: { '@id': `${site.domain}/#organization` },
  }
}

export function webPageSchema({
  name,
  description,
  path,
  type = 'WebPage',
  image,
  about,
}: {
  name: string
  description: string
  path: string
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage'
  image?: string
  about?: Array<{ name: string; url?: string }>
}): JsonLdValue {
  const url = absoluteUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: site.locale,
    isPartOf: { '@id': `${site.domain}/#website` },
    publisher: { '@id': `${site.domain}/#organization` },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: absoluteUrl(image) } : undefined,
    about: about?.map((item) => ({
      '@type': 'Thing',
      name: item.name,
      url: item.url ? absoluteUrl(item.url) : undefined,
    })),
  }
}

export function itemListSchema({
  name,
  path,
  items,
}: {
  name: string
  path: string
  items: Array<{ name: string; href: string }>
}): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  }
}

export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string
  description: string
  path: string
  serviceType: string
}): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#service`,
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: { '@id': `${site.domain}/#organization` },
    areaServed: { '@type': 'Country', name: 'Montenegro' },
    inLanguage: site.locale,
    isRelatedTo: { '@id': `${site.domain}/#organization` },
  }
}

export function breadcrumbSchema(items: Array<{ label: string; href: string }>): JsonLdValue {
  const allItems = [{ label: 'Početna', href: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  }
}
