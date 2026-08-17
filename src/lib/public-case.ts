import type { CaseStudy } from '@/types/content'

// Public portfolio copy intentionally uses the category-level description instead of individual beverage brand names.
const publicCaseOverrides: Partial<Record<string, Partial<CaseStudy>>> = {
  'aktivacije-regulisanih-brendova': {
    type: 'Promocije brendova pića + teren',
    title: 'Promocije brendova pića u ugostiteljstvu',
    summary: 'Organizacija promo timova, brendirane postavke, koordinacije sa ugostiteljskim objektima i dokumentovanja terenske realizacije.',
    role: 'Sindikat organizuje tim i operativni tok promocije: izbor promotera, briefing, raspored, koordinaciju sa lokacijom, kontrolu standarda i završni foto izvještaj.',
    challenge: 'Promocije u dinamičnom ugostiteljskom okruženju moraju istovremeno poštovati standard brenda, pravila lokacije i realne uslove rada. Bez jasnog briefinga i supervizije poruka, izgled i kvalitet realizacije mogu se razlikovati od smjene do smjene.',
    solution: 'Za svaku realizaciju definišu se profil tima, standard nastupa, uniforme, pozicije, način komunikacije, raspored i odgovorna osoba. Tim prolazi pripremu prije smjene, a realizacija se prati kroz vođu tima, koordinaciju sa objektom i dogovorenu foto-dokumentaciju.',
    result: 'Brend dobija dosljedniju i kontrolisanu terensku realizaciju, dok ugostiteljski partner ima jasan kontakt i raspored. Portfolio ostaje fokusiran na kvalitet organizacije, ljudi, postavke i standarda realizacije.',
    services: ['Promo timovi', 'Briefing i standardi', 'Koordinacija lokacije', 'Kontrola realizacije', 'Foto-dokumentacija'],
    scope: [
      'Odabir promo tima prema briefu i tipu lokacije',
      'Priprema poruke, uniformi, pozicija i pravila ponašanja',
      'Raspored, potvrda dolazaka i komunikacija sa ugostiteljskim objektom',
      'Koordinacija sa predstavnikom brenda i vođom smjene',
      'Kontrola vizuelnog i operativnog standarda tokom realizacije',
      'Foto-dokumentacija i završni pregled po lokaciji ili terminu',
    ],
    coverMark: 'PROMO',
    coverLabel: 'Promo timovi, brendirana postavka i kontrola realizacije',
    subprojects: [
      {
        title: 'Promocije u ugostiteljskim objektima',
        summary: 'Promo timovi, priprema i brendirana realizacija na lokaciji kroz unaprijed definisane standarde nastupa, raspored i kontrolu kvaliteta.',
      },
      {
        title: 'Višelokacijske brend aktivacije',
        summary: 'Koordinacija timova, postavke, komunikacije sa lokacijama i dokumentovanja realizacije kroz isti operativni proces na više mjesta.',
      },
    ],
  },
}

export function getPublicCaseStudy(item: CaseStudy): CaseStudy {
  const override = publicCaseOverrides[item.slug]
  return override ? { ...item, ...override } : item
}
