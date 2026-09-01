import type { Metadata } from 'next'
import { Studio83MediaUploader } from '@/components/studio83-media-uploader'

export const metadata: Metadata = {
  title: 'Studio83 Media Admin',
  description: 'Privatni alat za upravljanje Studio83 case-study fotografijama.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function Studio83MediaPage() {
  return <Studio83MediaUploader />
}
