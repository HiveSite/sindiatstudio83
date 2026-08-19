import Link from 'next/link'
import type { CaseStudy, Industry } from '@/types/content'
import { CaseCoverPlaceholder } from '@/components/case-media'
import { getPublicCaseStudy } from '@/lib/public-case'
import { managedThumbnail } from '@/lib/studio83-media'

function withManagedThumbnail(item: CaseStudy): CaseStudy {
  const coverImage = managedThumbnail(item.slug, item.coverImage)
  return coverImage === item.coverImage ? item : { ...item, coverImage }
}

export function CaseCard({ item }: { item: CaseStudy }) {
  const publicItem = withManagedThumbnail(getPublicCaseStudy(item))
  const metrics = publicItem.metrics?.slice(0, 3) || []
  return (
    <article className="case-card">
      <CaseCoverPlaceholder item={publicItem} />
      <div className="case-card-copy">
        <span className="eyebrow">{publicItem.type}</span>
        <h3>{publicItem.title}</h3>
        <p>{publicItem.summary}</p>
        {metrics.length ? <div className="case-mini-metrics">
          {metrics.map(([value, label]) => <div key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>)}
        </div> : null}
        <Link href={`/radovi/${publicItem.slug}/`}>Pogledaj projekat <span>↗</span></Link>
      </div>
    </article>
  )
}

export function CasePreviewCard({ item }: { item: CaseStudy }) {
  const publicItem = withManagedThumbnail(getPublicCaseStudy(item))
  return (
    <article className="case-preview-card">
      <CaseCoverPlaceholder item={publicItem} />
      <div className="case-preview-copy">
        <span>{publicItem.type}</span>
        <h3>{publicItem.title}</h3>
        <p>{publicItem.summary}</p>
        <Link href={`/radovi/${publicItem.slug}/`}>Pogledaj projekat ↗</Link>
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
