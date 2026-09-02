import manifest from '@/data/studio83-media-manifest.json'
import type { CaseStudyImage, CaseStudyMedia, MediaFit } from '@/types/content'

type MediaSettings = {
  fit?: MediaFit
  desktopX?: number
  desktopY?: number
  mobileX?: number
  mobileY?: number
  width?: number
  height?: number
}

type CustomSlot = {
  key: string
  theme: string
  imagePath: string | null
  path: string
  aspect?: 'wide' | 'landscape' | 'portrait' | 'square'
  settings?: MediaSettings
}

type ProjectMediaConfig = {
  thumbnailPath?: string | null
  coverSettings?: MediaSettings
  gallerySettings?: Record<string, MediaSettings>
  customSlots?: CustomSlot[]
}

type MediaManifest = {
  version: number
  projects: Record<string, ProjectMediaConfig>
}

const mediaManifest = manifest as MediaManifest

function clampPercent(value: number | undefined, fallback = 50) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.max(0, Math.min(100, Math.round(value)))
}

function resolvedSettings(settings: MediaSettings | undefined, defaultFit: MediaFit): Required<Pick<MediaSettings, 'fit' | 'desktopX' | 'desktopY' | 'mobileX' | 'mobileY'>> & Pick<MediaSettings, 'width' | 'height'> {
  return {
    fit: settings?.fit === 'contain' ? 'contain' : settings?.fit === 'cover' ? 'cover' : defaultFit,
    desktopX: clampPercent(settings?.desktopX),
    desktopY: clampPercent(settings?.desktopY),
    mobileX: clampPercent(settings?.mobileX),
    mobileY: clampPercent(settings?.mobileY),
    width: settings?.width,
    height: settings?.height,
  }
}

function imageWithSettings(image: CaseStudyImage, settings: MediaSettings | undefined, defaultFit: MediaFit): CaseStudyImage {
  const value = resolvedSettings(settings, defaultFit)
  const desktopPosition = `${value.desktopX}% ${value.desktopY}%`
  const mobilePosition = `${value.mobileX}% ${value.mobileY}%`

  return {
    ...image,
    width: value.width || image.width,
    height: value.height || image.height,
    fit: value.fit,
    position: desktopPosition,
    desktopPosition,
    mobilePosition,
  }
}

function publicSrcToRepoPath(src: string) {
  if (src.startsWith('/images/')) return `public${src}`
  if (src.startsWith('public/images/')) return src
  return null
}

export function managedThumbnail(slug: string, fallback?: CaseStudyImage): CaseStudyImage | undefined {
  const project = mediaManifest.projects[slug]
  const path = project?.thumbnailPath
  if (!path) return fallback

  const base: CaseStudyImage = {
    src: path,
    alt: fallback?.alt || `Cover projekta ${slug}`,
    width: fallback?.width || project?.coverSettings?.width || 1600,
    height: fallback?.height || project?.coverSettings?.height || 1200,
  }

  return imageWithSettings(base, project?.coverSettings, 'cover')
}

export function managedGalleryImage(slug: string, media: CaseStudyMedia): CaseStudyMedia {
  if (!media.image) return media
  const path = publicSrcToRepoPath(media.image.src)
  if (!path) return media
  const settings = mediaManifest.projects[slug]?.gallerySettings?.[path]
  if (!settings) return media
  return { ...media, image: imageWithSettings(media.image, settings, 'contain') }
}

export function managedExtraGallery(slug: string): CaseStudyMedia[] {
  return (mediaManifest.projects[slug]?.customSlots || [])
    .filter((slot) => Boolean(slot.imagePath))
    .map((slot) => {
      const settings = resolvedSettings(slot.settings, 'contain')
      const image = imageWithSettings({
        src: `/${String(slot.imagePath).replace(/^public\//, '')}`,
        alt: slot.theme,
        width: settings.width || (slot.aspect === 'portrait' ? 1200 : 1800),
        height: settings.height || (slot.aspect === 'portrait' ? 1800 : 1200),
      }, slot.settings, 'contain')

      return {
        label: slot.theme,
        kind: 'Fotografija' as const,
        aspect: slot.aspect || 'landscape',
        image,
      }
    })
}
