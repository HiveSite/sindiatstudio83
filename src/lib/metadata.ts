import type { Metadata } from 'next'
import { site } from '@/data/site'
import { enServices, enIndustries, enCaseSummaries } from '@/data/en'
import { englishBlogPosts } from '@/data/en-blog'

interface MetadataInput {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export function createMetadata({
  title,
  description,
  path,
  image = '/images/brand/og-cover.png',
  imageAlt = site.name,
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
  tags = [],
}: MetadataInput): Metadata {
  const fullTitle = title.includes(site.shortName) ? title : `${title} | ${site.name}`
  const canonical = new URL(path, site.domain).toString()
  const englishPaths = new Set([
    '/', '/usluge/', '/cijene/', '/industrije/', '/radovi/', '/o-nama/', '/blog/', '/kontakt/',
    '/usluge/meta-ads/', '/usluge/google-ads/',
    ...enServices.map((entry) => `/usluge/${entry.slug}/`),
    ...enIndustries.map((entry) => `/industrije/${entry.slug}/`),
    ...enCaseSummaries.map((entry) => `/radovi/${entry.slug}/`),
    ...englishBlogPosts.map((entry) => `/blog/${entry.slug}/`),
  ])
  const languageAlternates = englishPaths.has(path) ? { 'sr-Latn-ME': canonical, 'en': new URL('/en' + path, site.domain).toString() } : undefined
  const imageUrl = new URL(image, site.domain).toString()
  const socialImage = { url: imageUrl, width: 1200, height: 630, alt: imageAlt }

  const openGraph: Metadata['openGraph'] = type === 'article'
    ? {
        type: 'article',
        locale: site.openGraphLocale,
        siteName: site.name,
        title: fullTitle,
        description,
        url: canonical,
        images: [socialImage],
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: [site.domain],
        tags,
      }
    : {
        type: 'website',
        locale: site.openGraphLocale,
        siteName: site.name,
        title: fullTitle,
        description,
        url: canonical,
        images: [socialImage],
      }

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical, languages: languageAlternates },
    authors: [{ name: site.name, url: site.domain }],
    creator: site.name,
    publisher: site.name,
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  }
}

export function createEnglishMetadata({
  title,description,path,image='/images/brand/og-cover.png',imageAlt=site.name,
  type='website',noIndex=false,publishedTime,modifiedTime,tags=[]
}:MetadataInput):Metadata{
  const originalPath=path.startsWith('/en/')?path.slice(3):path
  const englishPath='/en'+originalPath
  const result=createMetadata({title,description,path:englishPath,image,imageAlt,type,noIndex,publishedTime,modifiedTime,tags})
  const canonical=new URL(englishPath,site.domain).toString()
  const srCanonical=new URL(originalPath,site.domain).toString()
  const imageUrl=new URL(image,site.domain).toString()
  return {
    ...result,
    alternates:{canonical,languages:{
      en:canonical,'sr-Latn-ME':srCanonical,'x-default':srCanonical
    }},
    openGraph:{
      type,
      title:result.title && typeof result.title==='object' && 'absolute' in result.title ? result.title.absolute : title,
      description,
      url:canonical,
      locale:'en_GB',
      siteName:site.name,
      images:[{url:imageUrl,width:1200,height:630,alt:imageAlt}],
      ...(type==='article' ? {
        publishedTime,modifiedTime:modifiedTime||publishedTime,
        authors:[site.domain],tags
      }:{}),
    },
    twitter:{card:'summary_large_image',title,description,images:[imageUrl]}
  }
}
