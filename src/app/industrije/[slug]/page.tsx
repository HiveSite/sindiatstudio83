import { IndustryPageContent } from '@/components/localized-industry-detail'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CasePreviewCard } from '@/components/cards'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { caseBySlug } from '@/data/cases'
import { industries, industryBySlug } from '@/data/industries'
import { serviceBySlug } from '@/data/services'

import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return industries.map((industry) => ({ slug: industry.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = industryBySlug[slug]
  if (!item) return {}
  return createMetadata({ title: `${item.title} - marketing i realizacija u Crnoj Gori`, description: item.summary, path: `/industrije/${item.slug}/` })
}


export default async function IndustryPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <IndustryPageContent slug={slug} locale="sr" />}

