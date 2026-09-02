import type { CaseStudyMedia } from '@/types/content'
import { cases } from '@/data/cases'
import { managedExtraGallery, managedGalleryImage } from '@/lib/studio83-media'

const fixedOverrides: Record<string, CaseStudyMedia[]> = {
  'imaposla-digitalni-proizvod': [
    {
      label: 'Početna stranica platforme i pregled glavnih tokova',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-pocetna-platforma-poslovi.webp',
        alt: 'ImaPosla.me desktop prikaz platforme za poslove i angažmane',
        width: 360,
        height: 260,
      },
    },
    {
      label: 'Oglasi i tok pronalaska posla',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-oglasi-za-posao.webp',
        alt: 'ImaPosla.me prikaz oglasa i pronalaska posla',
        width: 270,
        height: 360,
      },
    },
    {
      label: 'Brzi angažmani i kratki poslovi',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-brzi-angazmani.webp',
        alt: 'ImaPosla.me desktop prikaz brzih angažmana',
        width: 360,
        height: 262,
      },
    },
    {
      label: 'Usluge i dodatne ponude na platformi',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-usluge-marketplace.webp',
        alt: 'ImaPosla.me mobilni prikaz usluga i ponuda',
        width: 165,
        height: 360,
      },
    },
    {
      label: 'Radnici, firme i profili na platformi',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-firme-poslodavci.webp',
        alt: 'ImaPosla.me desktop prikaz radnika, firmi i profila',
        width: 360,
        height: 260,
      },
    },
    {
      label: 'Mobilni prikaz i kategorije poslova',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-kategorije-poslova.webp',
        alt: 'ImaPosla.me mobilni prikaz kategorija i pretrage poslova',
        width: 166,
        height: 360,
      },
    },
  ],
}

export const caseGalleryOverrides: Record<string, CaseStudyMedia[]> = Object.fromEntries(
  cases.map((item) => {
    const base = fixedOverrides[item.slug] || item.gallery
    return [
      item.slug,
      [
        ...base.map((media) => managedGalleryImage(item.slug, media)),
        ...managedExtraGallery(item.slug),
      ],
    ]
  }),
)
