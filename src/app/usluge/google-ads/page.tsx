import type { Metadata } from 'next'
import { FocusedServiceLanding, type FocusedServiceData } from '@/components/focused-service-landing'
import { createMetadata } from '@/lib/metadata'

const data: FocusedServiceData = {
  path: '/usluge/google-ads/',
  eyebrow: 'Google Ads',
  title: 'Google Ads oglašavanje za firme u Crnoj Gori',
  description: 'Google Ads reklame u Podgorici i Crnoj Gori. Pomažemo firmama da dođu do kupaca koji već traže njihove proizvode i usluge na Googleu.',
  intro: 'Kada neko na Googleu traži ono što prodaješ, važno je da lako dođe do tvoje ponude. Biramo relevantne pretrage, pripremamo oglase i vodimo ljude na stranicu na kojoj mogu brzo da pozovu, pošalju upit ili kupe.',
  problems: [
    'Plaćaš klikove ljudi koji zapravo ne traže tvoju uslugu.',
    'Reklama obećava jedno, a na sajtu je teško pronaći baš tu ponudu.',
    'Ne vidiš koliko je poziva ili upita stiglo zahvaljujući reklami.',
    'Oglasi mjesecima rade isto, bez provjere na šta odlazi budžet.',
  ],
  deliverables: [
    'Izbor riječi koje potencijalni kupci zaista pretražuju.',
    'Struktura kampanja, grupa oglasa i oglasa.',
    'Isključivanje pretraga koje nepotrebno troše budžet.',
    'Povezivanje kampanja sa odredišnim stranicama.',
    'Praćenje poziva, upita i drugih važnih radnji.',
    'Redovno sređivanje kampanja i jednostavan izvještaj.',
  ],
  stages: [
    {name:'Analiza pretrage',text:'Pogledamo koje usluge ljudi traže i šta je vrijedno oglašavanja.'},
    {name:'Postavka kampanja',text:'Pripremimo reklame, odgovarajuće stranice i mjerenje upita.'},
    {name:'Optimizacija',text:'Isključujemo nepotrebne klikove i radimo na kvalitetnijim upitima.'},
  ],
  faq: [
    {question:'Da li odmah mogu očekivati prve klijente?',answer:'Nema garancije broja upita ili prodaja. Rezultat zavisi od ponude, tržišta, konkurencije, budžeta i kvaliteta obrade kontakata.'},
    {question:'Može li kampanja raditi sa postojećim sajtom?',answer:'Da, ako stranica jasno predstavlja ponudu i omogućava mjerenje važnih radnji. U suprotnom predložićemo neophodne ispravke.'},
    {question:'Šta je odvojeno od cijene vođenja?',answer:'Budžet koji se plaća oglasnoj platformi odvaja se od agencijskog rada i eventualne produkcije sadržaja ili sajta.'},
  ],
}
export const metadata: Metadata = createMetadata({title:data.title, description:data.description, path:data.path})
export default function GoogleAdsPage(){return <FocusedServiceLanding data={data}/>}
