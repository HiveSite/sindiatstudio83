import type { Metadata } from 'next'
import { PricingPageContent } from '@/components/localized-pricing-page'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { serviceProducts } from '@/data/service-products'
import { enProducts } from '@/data/en-products'
import { enServices } from '@/data/en'
import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { services } from '@/data/services'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'
import { createMetadata } from '@/lib/metadata'

const title = 'Cijene i modeli saradnje za marketing, web i događaje'
const description = 'Pregled početnih cijena i modela saradnje Sindikat Studio 83: marketing kampanje, web, kreativni sadržaj, događaji i zapošljavanje u Crnoj Gori.'
export const metadata: Metadata = createMetadata({ title, description, path: '/cijene/' })


export default function PricingPage(){return <PricingPageContent locale="sr" />}

