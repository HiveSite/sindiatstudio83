import type { CaseStudy, CaseStudyMedia } from '@/types/content'

export function CaseCoverPlaceholder({ item, large = false }: { item: CaseStudy; large?: boolean }) {
  return (
    <div className={`case-visual case-visual-${item.slug}${large ? ' case-visual-large' : ''}`}>
      <div className="case-cover-copy">
        <span>{item.type}</span>
        <strong>{item.coverMark}</strong>
        <small>{item.coverLabel}</small>
      </div>
      <div className="case-orbit" aria-hidden="true" />
    </div>
  )
}

export function CaseMediaPlaceholder({ item }: { item: CaseStudyMedia }) {
  return (
    <article className="case-media-placeholder" data-aspect={item.aspect || 'landscape'}>
      <div className="case-media-placeholder-inner">
        <span>{item.kind}</span>
        <strong>{item.label}</strong>
      </div>
    </article>
  )
}
