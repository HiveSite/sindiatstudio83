import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { enProducts } from '@/data/en-products'
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
    description: 'Internet platforma, korisnički tokovi, SEO arhitektura i distribucija na lokalnom tržištu.',
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
  {slug: 'performance-marketing', title: 'Instagram i Google oglasi', text: 'Oglasi, mjerenje konverzija, testiranje i optimizacija budžeta.', outcome: 'Kvalitetniji upiti i jasnije mjerenje'},
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


const enHighlighted = [
  {category:'DIGITAL PRODUCT',title:'ImaPosla.me',description:'Online platform, user journeys, SEO architecture and distribution in the local market.'},
  {category:'PRODUCTION AND EVENTS',title:'BattleBots Arena',description:'Multi-month programme, coordination, communication and final event production.'},
  {category:'PROMOTIONAL TEAMS',title:'The people who deliver the plan',description:'Team selection, project briefing, schedules, logistics and on-site execution control.'}
]
const enFeaturedServices = [
  {title:'Instagram and Google advertising',text:'Advertising, conversion tracking, testing and budget optimization.',outcome:'Better-quality enquiries and clearer measurement'},
  {title:'Content and production',text:'Creative concepts, photography, video and assets ready for campaigns.',outcome:'Content created for a clear purpose'},
  {title:'Websites and digital products',text:'Landing pages, microsites and complex systems with clear user journeys.',outcome:'An easier path to apply or enquire'},
  {title:'Activations and events',text:'Concept, people, logistics and production at one or more locations.',outcome:'More reliable project execution'},
  {title:'Recruitment campaigns',text:'Job listings, application journeys, distribution and candidate organization.',outcome:'More relevant applications'},
]
const enSteps = [
  {title:'Understand the goal',text:'What should happen, who do we need to reach and what are the realistic timelines?'},
  {title:'Define the scope',text:'Deliverables, phases, costs and responsibilities without vague terms.'},
  {title:'Deliver and measure',text:'One accountable lead, a clear communication flow and a review of outcomes.'},
]

export function HomeServiceDirectory({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const displayServices = locale === 'en' ? featuredServices.map((item,i)=>({...item,...enFeaturedServices[i]})) : featuredServices
  return <section className="section home-service-directory" id="usluge-na-jednom-mjestu">
    <div className="container">
      <div className="home-sales-heading">
        <div><span className="eyebrow">{t("Šta konkretno radimo","WHAT WE DO")}</span><h2>{t("Pet oblasti. Jasna ponuda.","Five areas. A clear offer.")}</h2></div>
        <p>{t("Izaberi uslugu, pogledaj šta je uključeno i početni cjenovni okvir. Za složenije projekte pripremamo individualnu ponudu.","Choose a service, see what is included and explore starting prices. For complex projects, we prepare a tailored proposal.")}</p>
      </div>
      <div className="home-service-list">
        {displayServices.map((item, index) => {
          const product = (locale === 'en' ? enProducts : serviceProducts)[item.slug]?.[0]
          return <article className="home-service-row" key={item.slug}>
            <span className="home-service-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="home-service-main">
              <h3><Link href={localeHref(locale,`/usluge/${item.slug}/`)}>{item.title}</Link></h3>
              <p>{item.text}</p>
              <span className="home-service-outcome">{item.outcome}</span>
            </div>
            <div className="home-service-action">
              <span className="home-service-price">{t("Početna opcija","Starting option")} <strong>{product?.price || t('Po ponudi','On request')}</strong></span>
              <Link href={localeHref(locale,`/usluge/${item.slug}/`)} aria-label={`${t('Pogledaj uslugu','View service')}: ${item.title}`}>{t("Detalji i cijene","Details and pricing")} <span aria-hidden="true">↗</span></Link>
              <Link className="home-service-opis projekta" href={localeHref(locale,`/kontakt/?usluga=${encodeURIComponent(item.slug)}&izvor=home-service`)}>{t("Zatraži ponudu","Request a proposal")}</Link>
            </div>
          </article>
        })}
      </div>
    </div>
  </section>
}

export function HomeProjectHighlights({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const displayHighlighted=locale==='en' ? highlighted.map((item,i)=>({...item,...enHighlighted[i]})) : highlighted
  return <section className="section home-project-highlights" aria-labelledby="home-project-title">
    <div className="container">
      <div className="home-sales-heading">
        <div><span className="eyebrow">{t("Pravi projekti, pravi materijali","Real projects, real work")}</span><h2 id="home-project-title">{t("Ne ostajemo na ideji.","We go beyond the idea.")}</h2></div>
        <p>{t("Umjesto generičkih vizuala, ovdje su projekti koji pokazuju kako spajamo digital, produkciju i organizaciju.","These projects show how we connect digital work, production and coordination rather than relying on generic visuals.")}</p>
      </div>
      <div className="home-project-grid">
        {displayHighlighted.filter(item => cases.some(project => project.slug === item.slug)).map((item, index) =>
          <article className="home-project-card" key={item.slug}>
            <Link className="home-project-image-link" href={localeHref(locale,`/radovi/${item.slug}/`)} aria-label={`${t('Pogledaj projekat','View project')}: ${item.title}`}>
              <Image src={item.image} alt={`${t('Fotografija projekta','Project photo')}: ${item.title}`} fill sizes="(max-width: 760px) 94vw, (max-width: 1100px) 45vw, 33vw" />
              <span className="home-project-image-number">0{index+1}</span>
            </Link>
            <div className="home-project-text"><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p>
              <div className="home-project-links"><Link href={localeHref(locale,`/radovi/${item.slug}/`)}>{t("Pogledaj projekat ↗","View project ↗")}</Link><Link href={localeHref(locale,`/usluge/${item.service}/`)}>{t("Povezana usluga","Related service")}</Link></div>
            </div>
          </article>)}
      </div>
      <div className="home-all-projects"><Link className="button button-ghost" href={localeHref(locale,"/radovi/")}>{t("Svi projekti i studije slučaja ↗","All projects and case studies ↗")}</Link></div>
    </div>
  </section>
}

export function HomeProcessAndFaq({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const displaySteps=locale==='en' ? steps.map((step,i)=>({...step,...enSteps[i]})) : steps
  return <section className="section home-process" aria-labelledby="home-process-title">
    <div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">{t("Saradnja bez komplikacija","Straightforward collaboration")}</span><h2 id="home-process-title">{t("Od prvog upita do realizacije.","From the first enquiry to delivery.")}</h2></div>
        <p>{t("Ne moraš imati gotov opis projekta. Dovoljno je da nam kažeš šta želiš da postigneš.","You do not need a finished brief. Telling us what you want to achieve is enough to begin.")}</p></div>
      <div className="home-process-grid">{displaySteps.map(step=><div className="home-process-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
      <div className="home-faq-panel">
        <div><span className="eyebrow">{t("Prije prvog upita","Before your first enquiry")}</span><h3>{t("Brzi odgovori.","Quick answers.")}</h3><p>{t("Najvažnije stvari koje treba da znaš prije saradnje.","What you should know before working together.")}</p></div>
        <div className="home-faq-items">
          <details><summary>{t("Da li radite jednokratne projekte ili mjesečnu saradnju?","Do you handle one-off projects and ongoing engagements?")}</summary><p>{t("Oba modela. Obim i rokove dogovaramo prema cilju, usluzi i potrebnim resursima.","Both. We agree on the scope and timeline based on your objective, service and resources.")}</p></details>
          <details><summary>{t("Da li radite van Podgorice?","Do you work outside Podgorica?")}</summary><p>{t("Da. Projekte organizujemo širom Crne Gore, uz dogovorenu logistiku.","Yes. We organize projects throughout Montenegro with agreed logistics.")}</p></details>
          <details><summary>{t("Da li je budžet za oglašavanje uključen?","Is advertising spend included?")}</summary><p>{t("Medijski budžet i agencijska usluga se posebno definišu u ponudi, kako bi troškovi bili jasni.","Media spend and agency fees are specified separately in the proposal so costs are transparent.")}</p></details>
          <details><summary>{t("Šta treba da pošaljem za ponudu?","What should I send to get a proposal?")}</summary><p>{t("Dovoljni su cilj, kontakt, okvirni rok i kratak opis. Detalje razrađujemo nakon prvog razgovora.","A goal, contact details, approximate timeline and a short description are enough. We work through the details after our first discussion.")}</p></details>
        </div>
      </div>
    </div>
  </section>
}
