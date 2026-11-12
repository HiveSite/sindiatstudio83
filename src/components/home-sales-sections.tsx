import Link from 'next/link'
import Image from 'next/image'
import { cases } from '@/data/cases'
import { serviceProducts } from '@/data/service-products'

const highlighted = [
  {
    slug: 'imaposla-digitalni-proizvod',
    image: '/images/cases/imaposla/imaposla-me-platforma-poslovi-crna-gora-cover.webp',
    category: 'DIGITALNI PROIZVOD',
    title: 'ImaPosla.me',
    description: 'Web platforma, korisnički tokovi, SEO arhitektura i distribucija na lokalnom tržištu.',
    service: 'web-i-konverzije',
  },
  {
    slug: 'battlebots-arena',
    image: '/images/cases/battlebots-arena/battlebots-finalna-arena-i-publika.webp',
    category: 'PRODUKCIJA I DOGAĐAJI',
    title: 'BattleBots Arena',
    description: 'Višemjesečni program, koordinacija, komunikacija i produkcija završnog događaja.',
    service: 'aktivacije-i-eventi',
  },
  {
    slug: 'sistem-za-terenske-angazmane',
    image: '/images/cases/promo-timovi/tim.webp',
    category: 'PROMO TIMOVI',
    title: 'Ljudi koji realizuju plan',
    description: 'Izbor tima, opis projektaing, rasporedi, logistika i kontrola realizacije na terenu.',
    service: 'aktivacije-i-eventi',
  },
] as const

const featuredServices = [
  {slug: 'performance-marketing', title: 'Meta i Google kampanje', text: 'Oglasi, mjerenje konverzija, testiranje i optimizacija budžeta.', outcome: 'Kvalitetniji upiti i jasnije mjerenje'},
  {slug: 'sadrzaj-za-kampanje', title: 'Sadržaj i produkcija', text: 'Kreativni pravci, fotografija, video i materijali spremni za kampanje.', outcome: 'Sadržaj sa konkretnom namjenom'},
  {slug: 'web-i-konverzije', title: 'Sajtovi i digitalni proizvodi', text: 'Odredišne stranice, mini-sajtovi i složeniji sistemi sa jasnim korisničkim tokom.', outcome: 'Lakši put do prijave ili kontakta'},
  {slug: 'aktivacije-i-eventi', title: 'Aktivacije i događaji', text: 'Koncept, ljudi, logistika i produkcija na jednoj ili više lokacija.', outcome: 'Pouzdanija realizacija projekta'},
  {slug: 'recruitment-kampanje', title: 'Kampanje za zapošljavanje', text: 'Oglas, prijavni tok, distribucija i organizacija kandidata.', outcome: 'Relevantnije prijave kandidata'},
] as const

const steps = [
  {number: '01', title: 'Upoznajemo cilj', text: 'Šta treba da se dogodi, kome se obraćamo i koji su realni rokovi?'},
  {number: '02', title: 'Predlažemo konkretan obim', text: 'Isporuke, faze, cijena i odgovornosti bez nejasnih stavki.'},
  {number: '03', title: 'Realizujemo i mjerimo', text: 'Jedna odgovorna tačka, jasan tok komunikacije i pregled rezultata.'},
] as const

export function HomeServiceDirectory() {
  return <section className="section home-service-directory" id="usluge-na-jednom-mjestu">
    <div className="container">
      <div className="home-sales-heading">
        <div><span className="eyebrow">Šta konkretno radimo</span><h2>Pet oblasti. Jasna ponuda.</h2></div>
        <p>Izaberi uslugu, pogledaj šta je uključeno i početni cjenovni okvir. Za složenije projekte pripremamo individualnu ponudu.</p>
      </div>
      <div className="home-service-list">
        {featuredServices.map((item, index) => {
          const product = serviceProducts[item.slug]?.[0]
          return <article className="home-service-row" key={item.slug}>
            <span className="home-service-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="home-service-main">
              <h3><Link href={`/usluge/${item.slug}/`}>{item.title}</Link></h3>
              <p>{item.text}</p>
              <span className="home-service-outcome">{item.outcome}</span>
            </div>
            <div className="home-service-action">
              <span className="home-service-price">Početna opcija <strong>{product?.price || 'Po ponudi'}</strong></span>
              <Link href={`/usluge/${item.slug}/`} aria-label={`Pogledaj uslugu: ${item.title}`}>Detalji i cijene <span aria-hidden="true">↗</span></Link>
              <Link className="home-service-opis projekta" href={`/kontakt/?usluga=${encodeURIComponent(item.slug)}&izvor=home-service`}>Zatraži ponudu</Link>
            </div>
          </article>
        })}
      </div>
    </div>
  </section>
}

export function HomeProjectHighlights() {
  return <section className="section home-project-highlights" aria-labelledby="home-project-title">
    <div className="container">
      <div className="home-sales-heading">
        <div><span className="eyebrow">Pravi projekti, pravi materijali</span><h2 id="home-project-title">Ne ostajemo na ideji.</h2></div>
        <p>Umjesto generičkih vizuala, ovdje su projekti koji pokazuju kako spajamo digital, produkciju i organizaciju.</p>
      </div>
      <div className="home-project-grid">
        {highlighted.filter(item => cases.some(project => project.slug === item.slug)).map((item, index) =>
          <article className="home-project-card" key={item.slug}>
            <Link className="home-project-image-link" href={`/radovi/${item.slug}/`} aria-label={`Pogledaj projekat: ${item.title}`}>
              <Image src={item.image} alt={`Fotografija projekta ${item.title}`} fill sizes="(max-width: 760px) 94vw, (max-width: 1100px) 45vw, 33vw" />
              <span className="home-project-image-number">0{index+1}</span>
            </Link>
            <div className="home-project-text"><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p>
              <div className="home-project-links"><Link href={`/radovi/${item.slug}/`}>Pogledaj projekat ↗</Link><Link href={`/usluge/${item.service}/`}>Povezana usluga</Link></div>
            </div>
          </article>)}
      </div>
      <div className="home-all-projects"><Link className="button button-ghost" href="/radovi/">Svi projekti i studije slučaja ↗</Link></div>
    </div>
  </section>
}

export function HomeProcessAndFaq() {
  return <section className="section home-process" aria-labelledby="home-process-title">
    <div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">Saradnja bez komplikacija</span><h2 id="home-process-title">Od prvog upita do realizacije.</h2></div>
        <p>Ne moraš imati gotov opis projekta. Dovoljno je da nam kažeš šta želiš da postigneš.</p></div>
      <div className="home-process-grid">{steps.map(step=><div className="home-process-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
      <div className="home-faq-panel">
        <div><span className="eyebrow">Prije prvog upita</span><h3>Brzi odgovori.</h3><p>Najvažnije stvari koje treba da znaš prije saradnje.</p></div>
        <div className="home-faq-items">
          <details><summary>Da li radite jednokratne projekte ili mjesečnu saradnju?</summary><p>Oba modela. Obim i rokove dogovaramo prema cilju, usluzi i potrebnim resursima.</p></details>
          <details><summary>Da li radite van Podgorice?</summary><p>Da. Projekte organizujemo širom Crne Gore, uz dogovorenu logistiku.</p></details>
          <details><summary>Da li je budžet za oglašavanje uključen?</summary><p>Medijski budžet i agencijska usluga se posebno definišu u ponudi, kako bi troškovi bili jasni.</p></details>
          <details><summary>Šta treba da pošaljem za ponudu?</summary><p>Dovoljni su cilj, kontakt, okvirni rok i kratak opis. Detalje razrađujemo nakon prvog razgovora.</p></details>
        </div>
      </div>
    </div>
  </section>
}
