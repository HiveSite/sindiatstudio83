import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { createMetadata } from '@/lib/metadata'
import { AboutPageContent } from '@/components/localized-about-page'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Sindikat Studio 83 - digitalni i event studio iz Podgorice'
const seoDescription = 'Upoznajte Sindikat Studio 83, operativni studio iz Podgorice za digitalne proizvode, kampanje, sadržaj, promo timove, aktivacije i događaje u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/o-nama/',
})

export default function AboutPage(){return <AboutPageContent locale="sr" />}
