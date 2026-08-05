import type { CaseStudyMedia } from '@/types/content'

export const caseGalleryOverrides: Record<string, CaseStudyMedia[]> = {
  'imaposla-digitalni-proizvod': [
    {
      label: 'Početna stranica i pregled brzih angažmana',
      kind: 'Screenshot',
      aspect: 'wide',
      image: {
        src: '/images/cases/imaposla/imaposla-desktop-pocetna-brzi-angazmani.webp',
        alt: 'Desktop prikaz početne stranice ImaPosla.me sa izdvojenim firmama i brzim angažmanima',
        width: 2608,
        height: 1886,
      },
    },
    {
      label: 'Mobilna naslovna i pretraga poslova u Podgorici',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-mobilna-naslovna-pretraga-poslova-podgorica.webp',
        alt: 'Mobilni prikaz početne stranice ImaPosla.me sa pretragom poslova u Podgorici',
        width: 790,
        height: 1716,
      },
    },
    {
      label: 'Brzi poslovi sa jasnim terminom i lokacijom',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-brzi-poslovi-oglasi-desktop.webp',
        alt: 'Desktop lista brzih poslova na ImaPosla.me sa filterima, terminima i karticama oglasa',
        width: 2588,
        height: 1880,
      },
    },
    {
      label: 'Brzi poslovi prilagođeni mobilnoj pretrazi',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-brzi-poslovi-mobilni-prikaz.webp',
        alt: 'Mobilna lista brzih poslova na ImaPosla.me sa filterima i karticama oglasa',
        width: 1020,
        height: 1362,
      },
    },
    {
      label: 'Marketplace lokalnih usluga i filteri pretrage',
      kind: 'Screenshot',
      aspect: 'landscape',
      image: {
        src: '/images/cases/imaposla/imaposla-marketplace-usluga-desktop.webp',
        alt: 'Desktop prikaz ImaPosla.me marketplacea sa filterima za pronalazak osobe ili firme po kategoriji i gradu',
        width: 2614,
        height: 1890,
      },
    },
    {
      label: 'Mobilna navigacija po gradovima i lokalnim uslugama',
      kind: 'Screenshot',
      aspect: 'portrait',
      image: {
        src: '/images/cases/imaposla/imaposla-mobilni-gradovi-i-usluge.webp',
        alt: 'Mobilni prikaz ImaPosla.me sa izborom gradova i karticama lokalnih usluga',
        width: 780,
        height: 1700,
      },
    },
  ],
}
