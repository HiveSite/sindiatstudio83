import type { CaseStudyMedia } from '@/types/content'

export const caseGalleryOverrides: Record<string, CaseStudyMedia[]> = {
  'imaposla-digitalni-proizvod': [
    {
      label: 'Početna stranica platforme i pregled glavnih tokova',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-pocetna-platforma-poslovi.webp',
        alt: 'Početna stranica ImaPosla.me sa pretragom poslova, najnovijim oglasima, brzim angažmanima i kategorijama',
        width: 1055,
        height: 1491,
      },
    },
    {
      label: 'Pretraga i filtriranje oglasa za posao',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-oglasi-za-posao.webp',
        alt: 'Stranica oglasa za posao na ImaPosla.me sa filterima po gradu i kategoriji',
        width: 1055,
        height: 1491,
      },
    },
    {
      label: 'Kratki poslovi sa terminom, lokacijom i naknadom',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-brzi-angazmani.webp',
        alt: 'Stranica brzih angažmana na ImaPosla.me sa karticama kratkih poslova i filterima',
        width: 1055,
        height: 1491,
      },
    },
    {
      label: 'Marketplace lokalnih usluga i pružalaca',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-usluge-marketplace.webp',
        alt: 'Marketplace usluga na ImaPosla.me sa profilima fotografa, servisa, hostesa i drugih pružalaca',
        width: 1055,
        height: 1491,
      },
    },
    {
      label: 'Javni profili poslodavaca',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-firme-poslodavci.webp',
        alt: 'Stranica poslodavaca na ImaPosla.me sa javnim profilima firmi iz Crne Gore',
        width: 1055,
        height: 1491,
      },
    },
    {
      label: 'Pregled poslova po kategorijama',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-kategorije-poslova.webp',
        alt: 'Pregled kategorija poslova na ImaPosla.me uključujući ugostiteljstvo, turizam, prodaju, administraciju i IT',
        width: 1055,
        height: 1491,
      },
    },
  ],
}
