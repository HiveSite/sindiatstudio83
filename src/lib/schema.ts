import { site } from '@/data/site'

export type JsonLdValue = Record<string, unknown>

export function organizationSchema(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.domain}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.domain,
    logo: `${site.domain}/images/brand/logo.png`,
    image: `${site.domain}/images/brand/og-cover.png`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Podgorica',
      addressCountry: 'ME',
    },
    areaServed: { '@type': 'Country', name: 'Montenegro' },
    sameAs: [site.instagram],
  }
}

export function websiteSchema(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: site.name,
    url: site.domain,
    inLanguage: site.locale,
    publisher: { '@id': `${site.domain}/#organization` },
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
      item: new URL(item.href, site.domain).toString(),
    })),
  }
}
