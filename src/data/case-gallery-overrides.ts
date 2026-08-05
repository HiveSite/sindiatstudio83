import type { CaseStudyMedia } from '@/types/content'

export const caseGalleryOverrides: Record<string, CaseStudyMedia[]> = {
  'imaposla-digitalni-proizvod': [
    {
      label: 'Početna stranica i pregled brzih angažmana',
      kind: 'Screenshot',
      aspect: 'wide',
      image: {
        src: '/images/cases/imaposla/imaposla-desktop-pocetna-brzi-angazmani.avif',
        alt: 'Desktop prikaz početne stranice ImaPosla.me sa izdvojenim firmama i brzim angažmanima',
        width: 640,
        height: 462,
      },
    },
    {
      label: 'Mobilna naslovna i pretraga poslova u Podgorici',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-mobilna-naslovna-pretraga-poslova-podgorica.avif',
        alt: 'Mobilni prikaz početne stranice ImaPosla.me sa pretragom poslova u Podgorici',
        width: 320,
        height: 696,
      },
    },
    {
      label: 'Brzi poslovi sa jasnim terminom i lokacijom',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-brzi-poslovi-oglasi-desktop.avif',
        alt: 'Desktop lista brzih poslova na ImaPosla.me sa filterima, terminima i karticama oglasa',
        width: 640,
        height: 464,
      },
    },
    {
      label: 'Brzi poslovi prilagođeni mobilnoj pretrazi',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-brzi-poslovi-mobilni-prikaz.avif',
        alt: 'Mobilna lista brzih poslova na ImaPosla.me sa filterima i karticama oglasa',
        width: 380,
        height: 508,
      },
    },
    {
      label: 'Marketplace lokalnih usluga i filteri pretrage',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-marketplace-usluga-desktop.avif',
        alt: 'Desktop prikaz ImaPosla.me marketplacea sa filterima za pronalazak osobe ili firme po kategoriji i gradu',
        width: 640,
        height: 462,
      },
    },
    {
      label: 'Mobilna navigacija po gradovima i lokalnim uslugama',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-mobilni-gradovi-i-usluge.avif',
        alt: 'Mobilni prikaz ImaPosla.me sa izborom gradova i karticama lokalnih usluga',
        width: 320,
        height: 698,
      },
    },
  ],
}
