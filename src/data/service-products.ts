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
      includes: ['audit ponude i funnel-a', 'pregled kampanja i mjerenja', 'prioritetni akcioni plan'],
    },
    {
      name: 'Postavka kampanje',
      price: 'od 100 €',
      description: 'Za novi launch ili reorganizaciju postojećih kampanja sa jasnim trackingom.',
      includes: ['Meta i/ili Google struktura', 'tracking i konverzije', 'oglasi i launch'],
      featured: true,
    },
    {
      name: 'Mjesečno vođenje',
      price: 'od 150 € / mj.',
      description: 'Za kontinuirano testiranje, optimizaciju i razvoj kampanja.',
      includes: ['sedmična optimizacija', 'testiranje kreativa i publika', 'mjesečni pregled rezultata'],
    },
  ],
  'web-i-konverzije': [
    {
      name: 'Landing stranica',
      price: 'od 100 €',
      description: 'Jedna fokusirana prodajna stranica napravljena oko jasne ponude i konverzije.',
      includes: ['UX i prodajna struktura', 'responsive dizajn i razvoj', 'forma, tracking i SEO osnova'],
    },
    {
      name: 'Premium mini-sajt',
      price: 'od 250 €',
      description: 'Za biznis ili projekat kojem treba ozbiljnija digitalna prezentacija sa više sadržaja.',
      includes: ['više stranica ili sekcija', 'copy i sadržajna struktura', 'integracije, analitika i QA'],
      featured: true,
    },
    {
      name: 'Digitalni proizvod',
      price: 'od 500 €',
      description: 'Za platforme, prijavne sisteme i web proizvode sa posebnom poslovnom logikom.',
      includes: ['product i UX arhitektura', 'custom funkcionalnosti', 'integracije i produkcijska predaja'],
    },
  ],
  'aktivacije-i-eventi': [
    {
      name: 'Plan aktivacije',
      price: 'od 100 €',
      description: 'Koncept i operativna osnova prije produkcije i izlaska na teren.',
      includes: ['mehanika i koncept', 'operativna mapa', 'budžetska i logistička struktura'],
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
      includes: ['digitalna distribucija', 'produkcija i terenska realizacija', 'mjerenje i post-event nastavak'],
    },
  ],
  'sadrzaj-za-kampanje': [
    {
      name: 'Creative plan',
      price: 'od 50 €',
      description: 'Poruke, hookovi, formati i produkcioni pravac prije izrade sadržaja.',
      includes: ['creative matrica', 'hookovi i copy pravci', 'produkcioni plan'],
    },
    {
      name: 'Paket ads kreativa',
      price: 'od 100 €',
      description: 'Paket materijala spremnih za kampanju i kontrolisano testiranje.',
      includes: ['više kreativnih varijanti', 'formati za kanale', 'copy i CTA varijante'],
      featured: true,
    },
    {
      name: 'Kontinuirana produkcija',
      price: 'od 200 € / mj.',
      description: 'Mjesečni sistem novih materijala i iteracija prema rezultatima kampanje.',
      includes: ['mjesečni content plan', 'produkcija novih formata', 'iteracije pobjedničkih pravaca'],
    },
  ],
  'recruitment-kampanje': [
    {
      name: 'Recruitment sprint',
      price: 'od 100 €',
      description: 'Za jednu poziciju ili jasno definisan hiring cilj.',
      includes: ['oglas i employer ponuda', 'prijavni flow', 'kampanjska postavka i distribucija'],
    },
    {
      name: 'Sezonska kampanja',
      price: 'od 200 €',
      description: 'Za više pozicija, veći broj kandidata ili sezonsko zapošljavanje.',
      includes: ['više oglasa i kreativnih pravaca', 'distribucija i optimizacija', 'organizacija leadova'],
      featured: true,
    },
    {
      name: 'Employer sistem',
      price: 'od 300 €',
      description: 'Za kontinuirano zapošljavanje i employer branding kroz više kanala.',
      includes: ['employer sadržaj', 'kontinuirani acquisition', 'baza i proces prijava'],
    },
  ],
}
