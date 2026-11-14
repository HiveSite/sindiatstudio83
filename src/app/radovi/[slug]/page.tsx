import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CaseCoverPlaceholder, CaseMediaPlaceholder } from '@/components/case-media'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { caseGalleryOverrides } from '@/data/case-gallery-overrides'
import { cases, caseBySlug } from '@/data/cases'
import { serviceBySlug } from '@/data/services'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { CaseStudyPageContent } from '@/components/localized-case-detail'
import { getPublicCaseStudy } from '@/lib/public-case'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'
import { managedThumbnail } from '@/lib/studio83-media'

export const dynamicParams = false
export function generateStaticParams() { return cases.map((item) => ({ slug: item.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const baseItem = caseBySlug[slug]
  if (!baseItem) return {}
  const item = getPublicCaseStudy(baseItem)
  return createMetadata({
    title: `${item.title} - case study`,
    description: item.summary,
    path: `/radovi/${item.slug}/`,
    image: item.socialImage?.src,
    imageAlt: item.socialImage?.alt,
  })
}

export default async function CaseStudyPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <CaseStudyPageContent slug={slug} locale="sr" />}
