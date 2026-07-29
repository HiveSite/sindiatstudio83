import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { LeadForm } from '@/components/lead-form'
import { JsonLd } from '@/components/json-ld'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({ title: 'Kontakt', description: 'Pošaljite brief za digitalni proizvod, kampanju, aktivaciju, događaj, sadržaj ili kampanju za zapošljavanje u Crnoj Gori.', path: '/kontakt/' })

export default function ContactPage() {
  const crumbs = [{ label: 'Kontakt', href: '/kontakt/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Kontakt</span><h1>Pošalji situaciju, cilj i rok. Ne moraš unaprijed znati rješenje.</h1><p className="lead">Dobar početni brief ne mora biti dug. Važno je da razumijemo šta želiš da promijeniš, ko je uključen, kada projekat treba da krene i šta već postoji.</p></div><aside className="page-hero-aside"><strong>Najkorisnije informacije</strong><ul><li>cilj ili problem koji sada koči projekat</li><li>rok, lokacija i važni termini</li><li>postojeći sajt, kampanje, sadržaj ili partneri</li><li>ko donosi odluke i ko obrađuje rezultat</li></ul></aside></div></div></section>

    <section className="section"><div className="container contact-layout"><aside className="contact-sidebar"><span className="eyebrow">Direktan kontakt</span><h2>Podgorica i cijela Crna Gora.</h2><p>Digitalne projekte možemo voditi potpuno online. Za aktivacije, promo angažmane i događaje planiramo ljude, lokacije, transport i dobavljače prema stvarnom obimu.</p><div className="contact-card"><strong>Email</strong><a href={`mailto:${site.email}`} data-track="email_click">{site.email}</a><p>U naslov poruke stavi naziv firme ili projekta da bismo ga lakše povezali sa materijalima.</p></div><div className="contact-card"><strong>Instagram</strong><a href={site.instagram} target="_blank" rel="noopener noreferrer" data-track="instagram_click">@sindikat_studio83</a><p>Za briefove, ponude i dokumente forma ili email su pouzdaniji od direktnih poruka.</p></div><div className="contact-card"><strong>Odgovor</strong><p>{site.responseTime} Ako nema dovoljno informacija za procjenu, prvo šaljemo kratka konkretna pitanja umjesto generičke ponude.</p></div></aside><LeadForm /></div></section>

    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">Nakon slanja</span><h2>Prvi odgovor treba da smanji nejasnoću, ne da je pretvori u prodajni poziv.</h2><p className="lead">Ne šaljemo automatski veliki paket usluga. Prvo provjeravamo fit, ključne zavisnosti i da li projekat ima dovoljno informacija za realnu procjenu.</p></div><div className="step-list">{[
      ['01','Pregled briefa','Provjeravamo cilj, rok, lokacije, postojeće materijale i odgovornosti koje su već definisane.'],
      ['02','Pitanja koja nedostaju','Vraćamo se samo sa informacijama koje stvarno mijenjaju obim, cijenu, rok ili izbor rješenja.'],
      ['03','Preporučeni prvi korak','Predlažemo poziv, audit, sprint, tehničku provjeru ili okvir projekta, zavisno od nivoa spremnosti.'],
      ['04','Ponuda i početak','Kada su obim, rokovi i vlasnici jasni, ponuda razdvaja isporuke, troškove, zavisnosti i način odobravanja.'],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
  </>
}
