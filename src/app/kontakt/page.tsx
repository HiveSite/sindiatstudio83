import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { LeadForm } from '@/components/lead-form'
import { JsonLd } from '@/components/json-ld'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = createMetadata({ title: 'Kontakt', description: 'Pošaljite upit za performance kampanje, aktivacije, web, sadržaj ili recruitment u Crnoj Gori.', path: '/kontakt/' })

export default function ContactPage() {
  const crumbs = [{ label: 'Kontakt', href: '/kontakt/' }]
  return <>
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid"><div><span className="eyebrow">Kontakt</span><h1>Pošalji cilj. Mi ćemo složiti realan sljedeći korak.</h1><p className="lead">Ne moraš znati naziv usluge. Napiši šta želiš da promijeniš, kada, gdje i sa kojim okvirnim budžetom.</p></div><aside className="page-hero-aside"><strong>Dobar početni brief sadrži</strong><ul><li>cilj ili problem</li><li>rok i lokaciju</li><li>šta već postoji</li><li>okvirni budžet</li></ul></aside></div></div></section>
    <section className="section"><div className="container contact-layout"><aside className="contact-sidebar"><span className="eyebrow">Direktan kontakt</span><h2>Podgorica i cijela Crna Gora.</h2><p>Za kampanje, web i strategiju možemo raditi potpuno digitalno. Za aktivacije i događaje planiramo logistiku prema lokaciji.</p><div className="contact-card"><strong>Email</strong><a href={`mailto:${site.email}`}>{site.email}</a><p>Za brži pregled u subject stavi naziv firme ili projekta.</p></div><div className="contact-card"><strong>Instagram</strong><a href={site.instagram} target="_blank" rel="noopener noreferrer">@sindikat_studio83</a><p>Za ozbiljnije briefove forma ili email su pouzdaniji.</p></div><div className="contact-card"><strong>Nakon slanja</strong><p>Pregledamo cilj i okvir, javljamo se u roku od jednog radnog dana i, ako postoji dobar fit, šaljemo prijedlog obima i narednih koraka.</p></div></aside><LeadForm /></div></section>
  </>
}
