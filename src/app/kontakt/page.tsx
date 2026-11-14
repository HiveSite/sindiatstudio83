import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { LeadForm } from '@/components/lead-form'
import { JsonLd } from '@/components/json-ld'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { ContactPageContent } from '@/components/localized-contact-page'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Kontakt - digitalni marketing, web, eventi i promo timovi'
const seoDescription = 'Pošalji upit Sindikat Studio 83 timu iz Podgorice za digitalni marketing, web, aktivacije, događaje, sadržaj, promo timove ili recruitment kampanju u Crnoj Gori.'

export const metadata: Metadata = createMetadata({ title: seoTitle, description: seoDescription, path: '/kontakt/' })

export default function ContactPage(){return <ContactPageContent locale="sr" />}
