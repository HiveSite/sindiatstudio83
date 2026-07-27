import Link from 'next/link'
import type { CaseStudy, Industry, Service } from '@/types/content'

export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  return (
    <article className={`service-card${featured ? ' service-card-featured' : ''}`}>
      <span className="service-index">{service.eyebrow}</span>
      <h3>{service.shortTitle}</h3>
      <p>{service.summary}</p>
      <ul>{service.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
      <Link href={`/usluge/${service.slug}/`}>Pogledaj uslugu <span>↗</span></Link>
    </article>
  )
}

export function CaseCard({ item }: { item: CaseStudy }) {
  return (
    <article className="case-card">
      <div className={`case-visual case-visual-${item.slug}`}><span>{item.type}</span><div className="case-orbit" /></div>
      <div className="case-card-copy">
        <span className="eyebrow">{item.type}</span><h3>{item.title}</h3><p>{item.summary}</p>
        <div className="case-mini-metrics">{item.metrics.slice(0, 3).map(([value, label]) => <div key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <Link href={`/radovi/${item.slug}/`}>Pogledaj projekat <span>↗</span></Link>
      </div>
    </article>
  )
}

export function IndustryCard({ item }: { item: Industry }) {
  return (
    <Link className="industry-card" href={`/industrije/${item.slug}/`}>
      <span className="industry-mark" /><h3>{item.title}</h3><p>{item.summary}</p><span className="industry-link">Detalji ↗</span>
    </Link>
  )
}

export function FaqList({ items }: { items: string[][] }) {
  return (
    <div className="faq-list">
      {items.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><div><p>{answer}</p></div></details>)}
    </div>
  )
}
