import { site } from './site'

export const legalPages = {
  privatnost: {
    title: 'Politika privatnosti',
    description: 'Kako Sindikat Studio 83 obrađuje podatke poslate kroz kontakt i prijavne forme.',
    sections: [
      ['Uvod', 'Ova politika opisuje kako Sindikat Studio 83 obrađuje podatke koje dobrovoljno pošalješ kroz kontakt forme, prijave za angažmane i druge kanale na sajtu.'],
      ['Podaci koje prikupljamo', 'Možemo obraditi ime, naziv firme, email, telefon, cilj projekta, budžetski okvir, poruku, podatke iz prijave za angažman, URL stranice, referrer i kampanjske parametre.'],
      ['Svrha', 'Podatke koristimo da odgovorimo na upit, organizujemo projekat ili prijavu, vodimo evidenciju komunikacije, razumijemo učinak sajta i spriječimo zloupotrebu formi.'],
      ['Servisi trećih strana', 'Sajt koristi Google Analytics, Google Tag Manager i Google Apps Script endpointove za kontakt i angažmane. Obrada podataka kroz te servise uređena je i njihovim pravilima.'],
      ['Čuvanje i prava', `Podatke čuvamo onoliko koliko je potrebno za svrhu zbog koje su poslati i primjenjive obaveze. Za pristup, ispravku ili brisanje piši na ${site.email}.`],
      ['Sigurnost', 'Primjenjujemo razumne tehničke i organizacione mjere, ali nijedan način prenosa ili čuvanja podataka na internetu ne može biti potpuno bez rizika.'],
    ],
  },
  kolacici: {
    title: 'Politika kolačića',
    description: 'Informacije o analitičkim i funkcionalnim tehnologijama na sajtu Sindikat Studio 83.',
    sections: [
      ['Uvod', 'Sajt koristi lokalnu memoriju i analitičke tehnologije radi funkcionisanja, pamćenja izbora i mjerenja korišćenja.'],
      ['Neophodna memorija', 'Koristimo je da zapamtimo izbor u vezi sa kolačićima, zaštitimo forme i sačuvamo kampanjske parametre tokom sesije.'],
      ['Analitika', 'Google Analytics 4 i Google Tag Manager koriste se u skladu sa izabranim pristankom i podešavanjima povezanih naloga.'],
      ['Promjena izbora', 'Izbor možeš ponovo otvoriti preko dugmeta Podešavanja kolačića u footeru sajta.'],
      ['Trajanje izbora', 'Izbor se čuva u lokalnoj memoriji pregledača do promjene, brisanja podataka sajta ili objave nove verzije podešavanja pristanka.'],
    ],
  },
  'uslovi-koriscenja': {
    title: 'Uslovi korišćenja',
    description: 'Osnovni uslovi korišćenja sajta Sindikat Studio 83.',
    sections: [
      ['Uvod', 'Sadržaj sajta služi za predstavljanje usluga, projekata, vodiča i mogućnosti angažmana.'],
      ['Ponude i cijene', 'Opis usluga i modela saradnje nije obavezujuća ponuda. Konačni obim, rokovi, odgovornosti i cijena postoje tek nakon pisane ponude i prihvatanja.'],
      ['Prijave i angažmani', 'Slanje prijave ne garantuje angažman. Uslovi, naknada, lokacija i obaveze potvrđuju se posebno za svaki projekat.'],
      ['Sadržaj', 'Tekstovi i vodiči nijesu pravni, poreski ili finansijski savjet. Korisnik je odgovoran da odluke prilagodi sopstvenoj situaciji.'],
      ['Odgovornost', 'Nastojimo da informacije budu tačne, ali ne garantujemo da će svaki eksterni servis, forma ili link biti dostupan bez prekida.'],
      ['Kontakt', `Za pitanja piši na ${site.email}.`],
    ],
  },
} as const
