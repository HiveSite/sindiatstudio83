import manifest from '@/data/studio83-media-manifest.json'
import type { CaseStudyImage, CaseStudyMedia } from '@/types/content'

type CustomSlot = {
  key: string
  theme: string
  imagePath: string | null
  path: string
  aspect?: 'wide' | 'landscape' | 'portrait' | 'square'
}

type ProjectMediaConfig = {
  thumbnailPath?: string | null
  customSlots?: CustomSlot[]
}

type MediaManifest = {
  version: number
  projects: Record<string, ProjectMediaConfig>
}

const mediaManifest = manifest as MediaManifest

export function managedThumbnail(slug: string, fallback?: CaseStudyImage): CaseStudyImage | undefined {
  const path = mediaManifest.projects[slug]?.thumbnailPath
  if (!path) return fallback
  return {
    src: path,
    alt: fallback?.alt || `Thumbnail projekta ${slug}`,
    width: 1600,
    height: 1200,
    position: 'center',
  }
}

export function managedExtraGallery(slug: string): CaseStudyMedia[] {
  return (mediaManifest.projects[slug]?.customSlots || [])
    .filter((slot) => Boolean(slot.imagePath))
    .map((slot) => ({
      label: slot.theme,
      kind: 'Fotografija' as const,
      aspect: slot.aspect || 'landscape',
      image: {
        src: `/${String(slot.imagePath).replace(/^public\//, '')}`,
        alt: slot.theme,
        width: slot.aspect === 'portrait' ? 1200 : 1800,
        height: slot.aspect === 'portrait' ? 1800 : 1200,
        position: 'center',
      },
    }))
}
