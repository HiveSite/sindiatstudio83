import { site } from './site'

export const legalPages = {
  privatnost: {
    title: 'Politika privatnosti',
    description: 'Kako Sindikat Studio 83 obrađuje podatke poslate kroz kontakt i prijavne forme.',
    sections: [
      ['Uvod', 'Ova politika opisuje kako Sindikat Studio 83 obrađuje podatke koje dobrovoljno pošalješ kroz kontakt forme, prijave za angažmane i druge kanale na sajtu.'],
      ['Podaci koje prikupljamo', 'Možemo obraditi ime, naziv firme, email, telefon, cilj projekta, budžetski okvir, poruku, podatke iz prijave za angažman, URL stranice, referrer i kampanjske parametre.'],
      ['Svrha', 'Podatke koristimo da odgovorimo na upit, organizujemo projekat ili prijavu, vodimo evidenciju komunikacije, razumijemo učinak sajta i spriječimo zloupotrebu formi.'],
      ['Servisi trećih strana', 'Sajt koristi Google Analytics, Google Tag Manager i postojeće Google Apps Script endpointove za kontakt, blog i angažmane. Njihova obrada može biti uređena i pravilima tih servisa.'],
      ['Čuvanje i prava', `Podatke čuvamo onoliko koliko je razumno potrebno za svrhu zbog koje su poslati, ugovorne obaveze i zakonske zahtjeve. Za pristup, ispravku ili brisanje piši na`],
      ['Kontakt i zahtjevi', `Za pitanja o obradi podataka, pristup, ispravku ili brisanje možeš pisati na ${site.email}. Zahtjev ćemo obraditi u razumnom roku i u skladu sa primjenjivim pravilima.`],
    ],
  },
  kolacici: {
    title: 'Politika kolačića',
    description: 'Informacije o analitičkim i funkcionalnim kolačićima na sajtu Sindikat Studio 83.',
    sections: [
      ['Uvod', 'Sajt koristi lokalnu memoriju i analitičke tehnologije radi funkcionisanja, pamćenja izbora i mjerenja korišćenja.'],
      ['Neophodna memorija', 'Koristimo je da zapamtimo izbor u vezi sa kolačićima i kampanjske parametre tokom sesije.'],
      ['Analitika', 'Na sajtu su zadržani postojeći Google Analytics 4 identifikator i Google Tag Manager kontejner. Oni mogu prikupljati podatke o posjetama i događajima u skladu sa konfiguracijom tih naloga.'],
      ['Promjena izbora', 'Izbor možeš ponovo otvoriti kroz link Podešavanja kolačića u dnu sajta. Podatke sajta možeš obrisati i kroz podešavanja pregledača.'],
      ['Alati koje koristimo', 'Google Analytics 4 i Google Tag Manager koriste se u skladu sa izborom posjetioca i stvarnom konfiguracijom oznaka. Neophodna lokalna memorija ostaje aktivna radi pamćenja izbora i osnovnog funkcionisanja.'],
    ],
  },
  'uslovi-koriscenja': {
    title: 'Uslovi korišćenja',
    description: 'Osnovni uslovi korišćenja sajta Sindikat Studio 83.',
    sections: [
      ['Uvod', 'Sadržaj sajta služi za predstavljanje usluga, projekata, vodiča i mogućnosti angažmana.'],
      ['Ponude i cijene', 'Prikazani rasponi su orijentacioni. Obavezujući obim, rokovi i cijena postoje tek nakon pisane ponude i prihvatanja.'],
      ['Prijave i angažmani', 'Slanje prijave ne garantuje angažman. Uslovi, naknada, lokacija i obaveze potvrđuju se posebno za svaki projekat.'],
      ['Sadržaj', 'Tekstovi i vodiči nijesu pravni, poreski ili finansijski savjet. Korisnik je odgovoran da odluke prilagodi sopstvenoj situaciji.'],
      ['Odgovornost', 'Nastojimo da informacije budu tačne, ali ne garantujemo da će svaki eksterni servis, forma ili link biti dostupan bez prekida.'],
      ['Kontakt', `Za pitanja piši na`],
    ],
  },
} as const
