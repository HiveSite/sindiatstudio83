import type { Metadata } from 'next'
import { FocusedServiceLanding, type FocusedServiceData } from '@/components/focused-service-landing'
import { createMetadata } from '@/lib/metadata'

const data: FocusedServiceData = {
  path: '/usluge/meta-ads/',
  eyebrow: 'Meta Ads',
  title: 'Meta Ads oglašavanje za firme u Crnoj Gori',
  description: 'Meta Ads kampanje za Instagram i Facebook: strategija, kreativni materijali, mjerenje, testiranje i optimizacija. Sindikat Studio 83 iz Podgorice.',
  intro: 'Postavljamo i vodimo Instagram i Facebook kampanje sa jasnim ciljem: relevantan upit, rezervacija, kupovina ili druga mjerljiva radnja. Prvo provjeravamo ponudu i put korisnika, pa tek onda povećavamo budžet.',
  problems: [
    'Oglasi imaju preglede i klikove, ali nije jasno da li donose korisne upite.',
    'Kreative se ponavljaju, bez kontrolisanog testiranja poruka i formata.',
    'Nije jasno koja publika, lokacija i ponuda donosi stvarnu vrijednost.',
    'Sajt ili kontakt forma gube ljude koji su već zainteresovani.',
  ],
  deliverables: [
    'Analiza ponude, cilja i publike.',
    'Struktura kampanja i postavka mjerenja.',
    'Kreativni pravci, tekstovi i testne varijante.',
    'Povezivanje oglasa sa odgovarajućom odredišnom stranicom.',
    'Kontrolisano testiranje i optimizacija budžeta.',
    'Pregled rezultata i prijedlog narednih koraka.',
  ],
  stages: [
    {name:'Audit i plan',text:'Razumijemo cilj, publiku, ponudu i postojeće podatke.'},
    {name:'Lansiranje i test',text:'Postavljamo mjerenje, strukturu, oglase i testne varijante.'},
    {name:'Optimizacija',text:'Procjenjujemo kvalitet upita i prilagođavamo kampanje.'},
  ],
  faq: [
    {question:'Da li je budžet za reklame uključen u cijenu?',answer:'Ne. Medijski budžet se definiše odvojeno od usluge pripreme i vođenja kampanja.'},
    {question:'Da li treba da imam već pripremljene fotografije i video?',answer:'Ne nužno. Možemo predložiti i organizovati kreativnu produkciju kao zaseban dio dogovorenog obima.'},
    {question:'Da li radite samo Podgoricu?',answer:'Ne. Kampanje možemo postaviti prema odgovarajućim lokacijama i tržištima, uključujući cijelu Crnu Goru.'},
  ],
}
export const metadata: Metadata = createMetadata({title: data.title, description: data.description, path: data.path})
export default function MetaAdsPage(){ return <FocusedServiceLanding data={data} /> }
