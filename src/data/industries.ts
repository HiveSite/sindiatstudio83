export const industries = [
  {
    slug: 'ugostiteljstvo-i-turizam',
    title: 'Ugostiteljstvo i turizam',
    summary: 'Kampanje, direktne rezervacije, priprema sezone, Google prisustvo, sadržaj i aktivacije na lokaciji.',
    problems: ['zavisnost od posrednika i platformi', 'slaba popunjenost van udarnih termina', 'nejasna ponuda za strane i domaće goste'],
    solutions: ['sezonski plan rasta', 'Google Search i lokalna vidljivost', 'Meta kampanje i ponovno oglašavanje', 'landing stranica na više jezika', 'QR sistem za recenzije i povratak gosta'],
    cta: 'Planiraj sezonu'
  },
  {
    slug: 'retail-i-fmcg',
    title: 'Maloprodaja i FMCG',
    summary: 'Promocije, podjela uzoraka, lansiranje proizvoda, prodajna mjesta, promo timovi i digitalni nastavak kampanje.',
    problems: ['aktivacija bez mjerljivog ishoda', 'neujednačena realizacija po lokacijama', 'materijal sa terena se ne koristi dalje'],
    solutions: ['operativni plan po lokacijama', 'promoteri i promo lideri', 'podjela uzoraka i kupon mehanike', 'foto i video dokaz realizacije', 'ponovno oglašavanje i sadržaj nakon aktivacije'],
    cta: 'Planiraj aktivaciju'
  },
  {
    slug: 'eventi-i-venue',
    title: 'Događaji i prostori',
    summary: 'Popunjavanje događaja, prodaja ulaznica, tok gostiju, produkcija, tim i sadržaj prije, tokom i nakon događaja.',
    problems: ['promocija kreće kasno', 'ne postoji jasan put do kupovine ili prijave', 'produkcija i marketing rade odvojeno'],
    solutions: ['plan pokretanja i kampanja', 'prodajna stranica ili sistem za ulaznice', 'event osoblje i koordinacija', 'sadržaj uživo i sadržaj publike', 'ponovno oglašavanje nakon događaja'],
    cta: 'Pokreni event kampanju'
  },
  {
    slug: 'nekretnine-i-premium-usluge',
    title: 'Nekretnine i premium usluge',
    summary: 'Kampanje za upite, kvalifikacione forme, jasna prezentacija ponude i praćenje kvaliteta kontakata.',
    problems: ['mnogo nekvalitetnih upita', 'spora obrada kontakata', 'sajt ne objašnjava dovoljno vrijednost i naredni korak'],
    solutions: ['kampanje za upite', 'landing stranica po projektu ili ponudi', 'kvalifikaciona pitanja', 'CRM ili email integracija', 'praćenje izvora i kvaliteta kontakata'],
    cta: 'Sredi sistem upita'
  },
  {
    slug: 'poslodavci-i-zaposljavanje',
    title: 'Poslodavci i zapošljavanje',
    summary: 'Kampanje za zapošljavanje, ponuda poslodavca, jednostavna prijava, distribucija i sezonsko angažovanje.',
    problems: ['premalo relevantnih prijava', 'oglas ne objašnjava stvarne uslove', 'kandidati odustaju zbog sporog procesa'],
    solutions: ['jasna ponuda poslodavca', 'oglasi i kreativni paket', 'brza prijava bez komplikacija', 'ImaPosla i distribucija kroz zajednice', 'početna selekcija i izvještavanje'],
    cta: 'Pokreni kampanju za zapošljavanje'
  }
]

export const industryBySlug = Object.fromEntries(industries.map(industry => [industry.slug, industry]))
