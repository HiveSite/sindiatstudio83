'use client'

import { useMemo, useState } from 'react'
import { trackEvent } from '@/lib/tracking'
import { CaseCard } from '@/components/cards'
import { caseCategories } from '@/data/cases'
import type { CaseCategory, CaseStudy } from '@/types/content'

type FilterValue = 'sve' | CaseCategory

export function WorkFilter({ items }: { items: CaseStudy[] }) {
  const [active, setActive] = useState<FilterValue>('sve')
  const selectCategory = (category: FilterValue) => {
    setActive(category)
    trackEvent('work_filter', { category })
  }

  const visibleItems = useMemo(
    () => active === 'sve' ? items : items.filter((item) => item.categories.includes(active)),
    [active, items],
  )

  const countLabel = visibleItems.length === 1 ? 'projekat' : visibleItems.length >= 2 && visibleItems.length <= 4 ? 'projekta' : 'projekata'

  return (
    <div className="work-explorer" id="projekti">
      <div className="work-filter" role="group" aria-label="Filtriraj projekte po temi">
        <div className="work-filter-scroll">
          {caseCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`filter-button${active === category.slug ? ' is-active' : ''}`}
              aria-pressed={active === category.slug}
              aria-controls="work-results"
              onClick={() => selectCategory(category.slug)}
            >
              {category.label}
            </button>
          ))}
        </div>
        <span className="work-result-count" aria-live="polite">
          {visibleItems.length} {countLabel}
        </span>
      </div>
      <div className="case-grid" id="work-results">
        {visibleItems.map((item) => <CaseCard key={item.slug} item={item} />)}
      </div>
    </div>
  )
}
