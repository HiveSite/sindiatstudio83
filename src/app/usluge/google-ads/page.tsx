import type { Metadata } from 'next'
import { FocusedServiceLanding, type FocusedServiceData } from '@/components/focused-service-landing'
import { createMetadata } from '@/lib/metadata'

const data: FocusedServiceData = {
  path: '/usluge/google-ads/',
  eyebrow: 'Google Ads',
  title: 'Google Ads kampanje u Podgorici i Crnoj Gori',
  description: 'Google Ads postavka i vođenje za firme u Crnoj Gori: kampanje na pretrazi, ključne riječi, konverzije, odredišne stranice i optimizacija.',
  intro: 'Pomažemo da potencijalni kupci pronađu ponudu kada aktivno pretražuju proizvod ili uslugu. Kampanju povezujemo sa relevantnim stranicama, jasnim mjerenjem i realnim poslovnim ciljem.',
  problems: [
    'Oglasi troše budžet na pretrage koje nijesu relevantne za ponudu.',
    'Korisnici dolaze na stranicu koja ne odgovara na ono što su pretraživali.',
    'Pozivi, upiti i druge konverzije nijesu pouzdano izmjereni.',
    'Nedostaje redovno praćenje pojmova pretrage, oglasa i rezultata.',
  ],
  deliverables: [
    'Analiza namjere pretrage i komercijalnih upita.',
    'Struktura kampanja, grupa oglasa i oglasa.',
    'Negativne ključne riječi i kontrola relevantnosti.',
    'Povezivanje kampanja sa odredišnim stranicama.',
    'Mjerenje upita i drugih važnih konverzija.',
    'Optimizacija i razumljiv izvještaj o rezultatima.',
  ],
  stages: [
    {name:'Analiza pretrage',text:'Provjeravamo potražnju, ponudu, konkurenciju i relevantne upite.'},
    {name:'Postavka kampanja',text:'Povezujemo oglase, odredišne stranice i mjerenje konverzija.'},
    {name:'Optimizacija',text:'Uklanjamo nerelevantan saobraćaj i unapređujemo kvalitet upita.'},
  ],
  faq: [
    {question:'Da li odmah mogu očekivati prve klijente?',answer:'Nema garancije broja upita ili prodaja. Rezultat zavisi od ponude, tržišta, konkurencije, budžeta i kvaliteta obrade kontakata.'},
    {question:'Može li kampanja raditi sa postojećim sajtom?',answer:'Da, ako stranica jasno predstavlja ponudu i omogućava mjerenje važnih radnji. U suprotnom predložićemo neophodne ispravke.'},
    {question:'Šta je odvojeno od cijene vođenja?',answer:'Budžet koji se plaća oglasnoj platformi odvaja se od agencijskog rada i eventualne produkcije sadržaja ili sajta.'},
  ],
}
export const metadata: Metadata = createMetadata({title:data.title, description:data.description, path:data.path})
export default function GoogleAdsPage(){return <FocusedServiceLanding data={data}/>}
