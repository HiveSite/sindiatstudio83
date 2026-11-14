import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { ThankYouPageContent } from '@/components/localized-thank-you'

export const metadata: Metadata = createMetadata({
  title: 'Upit je poslat',
  description: 'Potvrda slanja upita Sindikat Studio 83.',
  path: '/hvala/',
  noIndex: true,
})

export default function ThankYouPage(){return <ThankYouPageContent locale="sr" />}
