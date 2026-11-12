export type ServiceProduct = {
  name: string
  price: string
  description: string
  includes: string[]
  featured?: boolean
}

export const serviceProducts: Record<string, ServiceProduct[]> = {
  'performance-marketing': [
    {
      name: 'Dijagnostika i plan',
      price: 'od 50 €',
      description: 'Za firme koje prvo žele da znaju šta treba popraviti prije većeg ulaganja.',
      includes: ['pregled ponude i puta do upita', 'pregled kampanja i mjerenja', 'prioritetni akcioni plan'],
    },
    {
      name: 'Postavka kampanje',
      price: 'od 100 €',
      description: 'Za pokretanje novih oglasa ili sređivanje postojećih kampanja, uz pravilno mjerenje rezultata.',
      includes: ['Meta i/ili Google struktura', 'mjerenje upita i drugih važnih radnji', 'priprema oglasa i pokretanje kampanje'],
      featured: true,
    },
    {
      name: 'Mjesečno vođenje',
      price: 'od 150 € / mj.',
      description: 'Za firme koje žele da redovno unapređuju oglase i prate šta im donosi upite.',
      includes: ['sedmična optimizacija', 'testiranje kreativa i publika', 'mjesečni pregled rezultata'],
    },
  ],
  'web-i-konverzije': [
    {
      name: 'Landing stranica',
      price: 'od 100 €',
      description: 'Jedna fokusirana prodajna stranica napravljena oko jasne ponude i konverzije.',
      includes: ['UX i prodajna struktura', 'dizajn prilagođen telefonu i računaru', 'kontakt forma, mjerenje i SEO osnova'],
    },
    {
      name: 'Premium mini-sajt',
      price: 'od 250 €',
      description: 'Za biznis ili projekat kojem treba ozbiljnija digitalna prezentacija sa više sadržaja.',
      includes: ['više stranica ili sekcija', 'tekstovi i pregledna struktura sadržaja', 'integracije, analitika i QA'],
      featured: true,
    },
    {
      name: 'Digitalni proizvod',
      price: 'od 500 €',
      description: 'Za platforme, prijavne sisteme i web proizvode sa posebnom poslovnom logikom.',
      includes: ['plan funkcionalnosti i korisničkog iskustva', 'funkcionalnosti prilagođene projektu', 'integracije i produkcijska predaja'],
    },
  ],
  'aktivacije-i-eventi': [
    {
      name: 'Plan aktivacije',
      price: 'od 100 €',
      description: 'Koncept i operativna osnova prije produkcije i izlaska na teren.',
      includes: ['ideja promocije i način realizacije', 'operativna mapa', 'budžetska i logistička struktura'],
    },
    {
      name: 'Produkcija i koordinacija',
      price: 'od 300 €',
      description: 'Za događaje i aktivacije gdje preuzimamo ljude, raspored, logistiku i kontrolu.',
      includes: ['tim i briefing', 'lokacije, smjene i logistika', 'supervizija i izvještaj'],
      featured: true,
    },
    {
      name: 'Kompletna kampanja',
      price: 'od 500 €',
      description: 'Digital, produkcija, ljudi, teren i sadržaj povezani kroz isti cilj.',
      includes: ['digitalna distribucija', 'produkcija i terenska realizacija', 'mjerenje i sadržaj i aktivnosti nakon događaja'],
    },
  ],
  'sadrzaj-za-kampanje': [
    {
      name: 'Kreativni plan',
      price: 'od 50 €',
      description: 'Uvodne poruke, formati i plan snimanja prije izrade sadržaja.',
      includes: ['predlog poruka i formata', 'uvodni naslovi i tekstovi', 'produkcioni plan'],
    },
    {
      name: 'Paket oglasa i vizuala',
      price: 'od 100 €',
      description: 'Paket materijala spremnih za kampanju i kontrolisano testiranje.',
      includes: ['više kreativnih varijanti', 'formati za kanale', 'tekstovi i pozivi na akciju'],
      featured: true,
    },
    {
      name: 'Kontinuirana produkcija',
      price: 'od 200 € / mj.',
      description: 'Mjesečni sistem novih materijala i iteracija prema rezultatima kampanje.',
      includes: ['mjesečni plan sadržaja', 'produkcija novih formata', 'iteracije pobjedničkih pravaca'],
    },
  ],
  'recruitment-kampanje': [
    {
      name: 'Kampanja za jednu poziciju',
      price: 'od 100 €',
      description: 'Za jednu otvorenu poziciju ili konkretnu potrebu za novim zaposlenim.',
      includes: ['tekst oglasa i ponuda poslodavca', 'jednostavan put do prijave', 'kampanjska postavka i distribucija'],
    },
    {
      name: 'Sezonska kampanja',
      price: 'od 200 €',
      description: 'Za više pozicija, veći broj kandidata ili sezonsko zapošljavanje.',
      includes: ['više oglasa i kreativnih pravaca', 'distribucija i optimizacija', 'pregled i organizacija prijava'],
      featured: true,
    },
    {
      name: 'Kontinuirano zapošljavanje',
      price: 'od 300 €',
      description: 'Za kontinuirano zapošljavanje i employer branding kroz više kanala.',
      includes: ['employer sadržaj', 'redovno privlačenje kandidata', 'baza i proces prijava'],
    },
  ],
}
