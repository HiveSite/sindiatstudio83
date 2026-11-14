import type { Metadata } from 'next'
import { HomePageContent } from '@/components/localized-home-page'
import Link from 'next/link'
import { cases } from '@/data/cases'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { FinalCta } from '@/components/final-cta'
import { HeroShowcase } from '@/components/hero-showcase'
import { HomeServiceDirectory, HomeProjectHighlights, HomeProcessAndFaq } from '@/components/home-sales-sections'
import { JsonLd } from '@/components/json-ld'
import { OfferChooser } from '@/components/sales-offer'
import { HomeQuickChoices, HomeIndustriesPreview } from '@/components/demo-home-choices'
import { createMetadata } from '@/lib/metadata'
import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { enServices } from '@/data/en'
import { itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Marketing agencija Podgorica - kampanje, web i događaji'
const seoDescription = 'Sindikat Studio 83 iz Podgorice kreira sadržaj, vodi digitalne kampanje, pravi sajtove i organizuje događaje i promocije širom Crne Gore.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/',
})


export default function HomePage() { return <HomePageContent locale="sr" /> }

