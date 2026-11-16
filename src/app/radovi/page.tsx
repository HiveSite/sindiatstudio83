import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { WorkFilter } from '@/components/work-filter'
import { cases } from '@/data/cases'
import { getPublicCaseStudy } from '@/lib/public-case'
import { createMetadata } from '@/lib/metadata'
import { WorksPageContent } from '@/components/localized-works-page'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Portfolio - digitalni proizvodi, kampanje, eventi i promo timovi'
const seoDescription = 'Case studies Sindikat Studio 83: digitalne platforme, kampanje, aktivacije, promo timovi, događaji, web projekti i operativni sistemi u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/radovi/',
})

export default function WorksPage(){return <WorksPageContent locale="sr" />}
