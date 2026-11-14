import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { legalPages } from '@/data/legal'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'
import { LegalPageContent } from '@/components/localized-legal-page'

export const dynamicParams = false
export function generateStaticParams() { return Object.keys(legalPages).map((legal) => ({ legal })) }

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> {
  const { legal } = await params
  const page = legalPages[legal as keyof typeof legalPages]
  if (!page) return {}
  return createMetadata({ title: page.title, description: page.description, path: `/${legal}/`, noIndex: true })
}

export default async function LegalPage({params}:{params:Promise<{legal:string}>}){
 const {legal}=await params
 return <LegalPageContent slug={legal} locale="sr" />
}
