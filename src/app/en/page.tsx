import type { Metadata } from 'next'
import { HomePageContent } from '@/components/localized-home-page'

export const metadata: Metadata = {
  title: 'Marketing Agency in Podgorica - Ads, Websites & Content | Sindikat Studio 83',
  description: 'Looking for a marketing agency in Podgorica? Explore Sindikat Studio 83 projects, social media content, Meta and Google Ads, websites and event production.',
  alternates: { canonical: '/en/', languages: { 'sr-Latn-ME': '/', en: '/en/' } },
  openGraph: { locale: 'en_GB', title: 'Sindikat Studio 83 | Ideas. People. Execution.', description: 'Creative campaigns, digital products and events in Montenegro.' },
}

export default function EnglishHome() {
  return <HomePageContent locale="en" />
}
