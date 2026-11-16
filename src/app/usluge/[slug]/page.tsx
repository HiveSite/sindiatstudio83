import { ServicePageContent } from '@/components/localized-service-detail'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CasePreviewCard, FaqList } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { cases } from '@/data/cases'
import { serviceBySlug, services } from '@/data/services'
import { serviceProducts } from '@/data/service-products'
import { enProducts } from '@/data/en-products'

import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { createMetadata } from '@/lib/metadata'
import { buyerSeo } from '@/data/buyer-seo'
import { breadcrumbSchema, itemListSchema, serviceSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })) }

const serviceSeo: Record<string, { title: string; description: string }> = {
  'performance-marketing': {
    title: 'Meta Ads i Google Ads kampanje u Crnoj Gori',
    description: 'Meta i Google Ads kampanje, postavka mjerenja, optimizacija i analiza upita. Sindikat Studio 83 - digitalni marketing iz Podgorice.',
  },
  'web-i-konverzije': {
    title: 'Izrada web sajtova i landing stranica u Podgorici',
    description: 'Izrada brzih sajtova, landing stranica i digitalnih proizvoda u Crnoj Gori. UX, mobilni dizajn, SEO osnova, analitika i integracije.',
  },
  'aktivacije-i-eventi': {
    title: 'Organizacija događaja i promo aktivacija u Crnoj Gori',
    description: 'Organizacija događaja, promocija, promo timova i aktivacija na terenu. Koncept, logistika, koordinacija i izvještavanje širom Crne Gore.',
  },
  'sadrzaj-za-kampanje': {
    title: 'Kreiranje sadržaja i video produkcija u Crnoj Gori',
    description: 'Foto i video produkcija, Reels, kreativni koncepti i sadržaj za Instagram, Facebook i digitalne kampanje. Sindikat Studio 83 Podgorica.',
  },
  'recruitment-kampanje': {
    title: 'Kampanje za zapošljavanje i employer branding',
    description: 'Kampanje za zapošljavanje u Crnoj Gori. Oglasi, prijavni tokovi, sadržaj za poslodavce, distribucija i optimizacija prijava.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug[slug]
  if (!service) return {}
  const seo = buyerSeo[slug]?.sr || serviceSeo[slug]
  return createMetadata({
    title: seo?.title || `${service.shortTitle} u Crnoj Gori - usluge i cijene`,
    description: seo?.description || service.summary,
    path: `/usluge/${service.slug}/`,
  })
}


export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <ServicePageContent slug={slug} locale="sr" />}

