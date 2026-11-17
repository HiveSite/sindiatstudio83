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
      label: 'ImaPosla.me - stvarna desktop početna stranica',
      kind: 'Screenshot',
      aspect: 'wide',
      image: {
        src: '/images/cases/imaposla/imaposla-live-home-desktop.jpg',
        alt: 'Stvarna desktop početna stranica ImaPosla.me',
        width: 1440,
        height: 1000,
        fit: 'contain',
      },
    },
    {
      label: 'ImaPosla.me - stvarna lista oglasa i filteri',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-live-jobs-desktop.jpg',
        alt: 'Stvarna stranica oglasa za posao ImaPosla.me',
        width: 1440,
        height: 1000,
        fit: 'contain',
      },
    },
    {
      label: 'ImaPosla.me - stvarna mobilna početna stranica',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-live-home-mobile.jpg',
        alt: 'Stvarna mobilna stranica ImaPosla.me sa pretragom i najnovijim poslovima',
        width: 390,
        height: 844,
        fit: 'contain',
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
