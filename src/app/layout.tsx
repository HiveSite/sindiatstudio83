import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AnalyticsScripts, GoogleTagManagerNoScript } from '@/components/analytics'
import { ClientRuntime } from '@/components/client-runtime'
import { JsonLd } from '@/components/json-ld'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { site } from '@/data/site'
import './globals.css'
import './sales-ux.css'
import './contrast.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: 'Digitalni proizvodi, kampanje, sadržaj, promo timovi, aktivacije i događaji u Crnoj Gori.',
  applicationName: site.name,
  authors: [{ name: site.name, url: site.domain }],
  creator: site.name,
  publisher: site.name,
  category: 'marketing',
  icons: { icon: '/favicon.png', apple: '/icons/icon-192.png' },
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: true, email: true, address: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#08080b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={site.locale}>
      <body>
        <AnalyticsScripts />
        <GoogleTagManagerNoScript />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ClientRuntime />
      </body>
    </html>
  )
}
