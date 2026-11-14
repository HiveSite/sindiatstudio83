import type { Metadata } from 'next'
import { HomePageContent } from '@/components/localized-home-page'

export const metadata: Metadata = {
  title: 'Creative production, campaigns and websites | Sindikat Studio 83',
  description: 'Sindikat Studio 83 is a creative and production studio in Podgorica, Montenegro. Digital advertising, content, websites, events and activation teams.',
  alternates: { canonical: '/en/', languages: { 'sr-Latn-ME': '/', en: '/en/' } },
  openGraph: { locale: 'en_GB', title: 'Sindikat Studio 83 | Ideas. People. Execution.', description: 'Creative campaigns, digital products and events in Montenegro.' },
}

export default function EnglishHome() {
  return <HomePageContent locale="en" />
}
