import type { CaseStudyMedia } from '@/types/content'
import { cases } from '@/data/cases'
import { managedExtraGallery, managedGalleryImage } from '@/lib/studio83-media'

const fixedOverrides: Record<string, CaseStudyMedia[]> = {
  'hive-agency-platforma': [
    {
      label: 'Hive Agency - stvarna početna stranica na desktopu',
      kind: 'Screenshot',
      aspect: 'wide',
      image: { src: '/images/cases/hive-agency/hive-live-home-desktop.jpg', alt: 'Stvarna desktop početna stranica Hive Agency platforme', width: 1440, height: 1000, fit: 'contain' },
    },
    {
      label: 'Hive Agency - pregled programa i kartica aktivnosti',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: { src: '/images/cases/hive-agency/hive-live-programs-desktop.jpg', alt: 'Stvarna stranica programa Hive Agency platforme', width: 1440, height: 1000, fit: 'contain' },
    },
    {
      label: 'Hive Agency - mobilna početna stranica',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: { src: '/images/cases/hive-agency/hive-live-home-mobile.jpg', alt: 'Stvarna mobilna početna stranica Hive Agency platforme', width: 390, height: 844, fit: 'contain' },
    },
    ...cases.find((item) => item.slug === 'hive-agency-platforma')!.gallery,
  ],
  'imaposla-digitalni-proizvod': [
    {
      label: 'Početna stranica - stvarni desktop prikaz u visokoj rezoluciji',
      kind: 'Screenshot', aspect: 'wide',
      image: { src: '/images/cases/imaposla/imaposla-hq-home-desktop.jpg', alt: 'ImaPosla.me - nova početna stranica sa pretragom oglasa, fotografijom i navigacijom', width: 3456, height: 2120, fit: 'contain' },
    },
    {
      label: 'Oglasi za posao - filteri i aktivne pozicije',
      kind: 'Screenshot', aspect: 'landscape',
      image: { src: '/images/cases/imaposla/imaposla-hq-jobs-desktop.jpg', alt: 'ImaPosla.me desktop lista oglasa za posao sa filterima i karticama', width: 3456, height: 2120, fit: 'contain' },
    },
    {
      label: 'Mobilna pretraga i najnoviji oglasi',
      kind: 'Screenshot', aspect: 'portrait',
      image: { src: '/images/cases/imaposla/imaposla-hq-home-mobile.jpg', alt: 'ImaPosla.me mobilna početna stranica sa pretragom poslova i aktuelnim oglasima', width: 1290, height: 2796, fit: 'contain' },
    },
    {
      label: 'Mobilna lista oglasa i prijava',
      kind: 'Screenshot', aspect: 'portrait',
      image: { src: '/images/cases/imaposla/imaposla-hq-jobs-mobile.jpg', alt: 'ImaPosla.me mobilni pregled oglasa, filtera i pozicija', width: 1290, height: 2796, fit: 'contain' },
    },
    {
      label: 'Kompanije i poslodavci na platformi',
      kind: 'Screenshot', aspect: 'landscape',
      image: { src: '/images/cases/imaposla/imaposla-hq-companies-desktop.jpg', alt: 'ImaPosla.me desktop prikaz stranice sa firmama i poslodavcima', width: 3456, height: 2120, fit: 'contain' },
    },
  ],}

// Order is editorial, not alphabetical: lead with the clearest outcome, then show
// detail, people and behind-the-scenes footage. Keep source labels intact for fallbacks.
const projectImageOrder: Record<string, number[]> = {
  'battlebots-arena': [0, 2, 5, 6, 1, 4, 7, 3],
  'sistem-za-terenske-angazmane': [0, 2, 1, 3],
  'aktivacije-regulisanih-brendova': [1, 2, 0, 3],
  'privatni-i-korporativni-dogadjaji': [1, 2, 0, 3],
  'mini-sajtovi-i-digitalni-alati': [2, 0, 1, 6, 3, 4, 5, 7, 8, 9],
  'student-connect-mini-festival': [0, 2, 1, 3],
  'kucica-na-podgorickom-pazaru': [2, 0, 1, 3],
}

// Hero-sized editorial image followed by balanced frames; portrait screenshots
// remain contain-fit to preserve every pixel of the actual interface.
function presentGallery(slug: string, source: CaseStudyMedia[]): CaseStudyMedia[] {
  const order = projectImageOrder[slug]
  const sorted = order ? [
    ...order.map(index => source[index]).filter((item): item is CaseStudyMedia => Boolean(item)),
    ...source.filter((_, index) => !order.includes(index)),
  ] : [...source]
  return sorted.map((media, index) => {
    const isHero = index === 0 && media.aspect !== 'portrait'
    const aspect = isHero ? 'wide' : media.aspect
    const image = media.image
      ? { ...media.image, fit: media.image.fit || (media.kind === 'Screenshot' || aspect === 'portrait' ? 'contain' as const : 'cover' as const) }
      : undefined
    return { ...media, aspect, ...(image ? { image } : {}) }
  })
}

export const caseGalleryOverrides: Record<string, CaseStudyMedia[]> = Object.fromEntries(
  cases.map((item) => {
    const base = presentGallery(item.slug, fixedOverrides[item.slug] || item.gallery)
    return [
      item.slug,
      [
        ...base.map((media) => managedGalleryImage(item.slug, media)),
        ...managedExtraGallery(item.slug),
      ],
    ]
  }),
)
