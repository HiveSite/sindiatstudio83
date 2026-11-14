import type { Metadata } from 'next'
import { IndustriesPageContent } from '@/components/localized-industries-page'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { IndustryCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { industries } from '@/data/industries'
import { enIndustries } from '@/data/en'
import { localizedIndustry } from '@/lib/localized-data'
import { localeHref,translate,type SiteLocale } from '@/lib/locale'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Digitalni marketing i realizacija po industrijama u Crnoj Gori'
const seoDescription = 'Marketing, web, aktivacije i operativna realizacija za turizam, ugostiteljstvo, retail, događaje, premium usluge i poslodavce u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/industrije/',
})


export default function IndustriesPage(){return <IndustriesPageContent locale="sr" />}

