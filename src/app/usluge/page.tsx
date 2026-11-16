import type { Metadata } from 'next'
import { ServicesPageContent } from '@/components/localized-services-page'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { OfferAreas, OfferChooser } from '@/components/sales-offer'
import { services } from '@/data/services'
import { serviceProducts } from '@/data/service-products'
import { enServices } from '@/data/en'
import { enProducts } from '@/data/en-products'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'
import { createMetadata } from '@/lib/metadata'

const seoTitle = 'Usluge digitalnog marketinga, weba, događaja i promo timova u Crnoj Gori'
const seoDescription = 'Performance marketing, web i digitalni proizvodi, aktivacije, događaji, sadržaj i recruitment kampanje iz Podgorice za klijente širom Crne Gore.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/usluge/',
})


export default function ServicesPage(){return <ServicesPageContent locale="sr" />}

