import type { Metadata } from 'next'
import { FocusedServiceLanding, type FocusedServiceData } from '@/components/focused-service-landing'
import { createMetadata } from '@/lib/metadata'

const data: FocusedServiceData = {
  path: '/usluge/meta-ads/',
  eyebrow: 'Meta Ads',
  title: 'Instagram i Facebook oglašavanje za firme u Crnoj Gori',
  description: 'Instagram i Facebook reklame za firme u Crnoj Gori. Priprema oglasa, ciljanje publike, mjerenje upita i vođenje Meta Ads kampanja iz Podgorice.',
  intro: 'Imaš dobru ponudu, ali reklame ne donose dovoljno upita? Pomažemo da je vidi prava publika na Instagramu i Facebooku. Pripremamo oglase, pratimo šta ljudi rade poslije klika i mijenjamo ono što ne daje rezultat.',
  problems: [
    'Objave i reklame dobijaju preglede, ali telefon ne zvoni i upiti ne stižu.',
    'Stalno se koristi isti vizual ili video, pa publika prestaje da reaguje.',
    'Ne znaš koja reklama dovodi zainteresovane kupce, a koja samo troši novac.',
    'Ljudi kliknu na reklamu, ali ne mogu lako da pronađu cijenu ili pošalju poruku.',
  ],
  deliverables: [
    'Analiza ponude, cilja i publike.',
    'Struktura kampanja i postavka mjerenja.',
    'Predlozi fotografija, videa i tekstova za različite publike.',
    'Povezivanje oglasa sa odgovarajućom odredišnom stranicom.',
    'Praćenje rezultata i prilagođavanje oglasa budžetu.',
    'Jasan pregled koliko je kampanja potrošila i šta je donijela.',
  ],
  stages: [
    {name:'Audit i plan',text:'Pogledamo šta prodaješ, kome i kako ti trenutno stižu kupci.'},
    {name:'Lansiranje i test',text:'Pripremimo oglase, povežemo mjerenje i pokrenemo prve varijante.'},
    {name:'Optimizacija',text:'Pratimo koji oglasi donose korisne upite i unapređujemo ih.'},
  ],
  faq: [
    {question:'Da li je budžet za reklame uključen u cijenu?',answer:'Ne. Medijski budžet se definiše odvojeno od usluge pripreme i vođenja kampanja.'},
    {question:'Da li treba da imam već pripremljene fotografije i video?',answer:'Ne nužno. Možemo predložiti i organizovati kreativnu produkciju kao zaseban dio dogovorenog obima.'},
    {question:'Da li radite samo Podgoricu?',answer:'Ne. Kampanje možemo postaviti prema odgovarajućim lokacijama i tržištima, uključujući cijelu Crnu Goru.'},
  ],
}
export const metadata: Metadata = createMetadata({title: data.title, description: data.description, path: data.path})
export default function MetaAdsPage(){ return <FocusedServiceLanding data={data} /> }
