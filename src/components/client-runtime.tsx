'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { site } from '@/data/site'

function RuntimeEffects() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
    keys.forEach((key) => {
      const value = searchParams.get(key)
      if (value) sessionStorage.setItem(`sindikat_${key}`, value)
    })
  }, [searchParams])

  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`
    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: url,
      send_to: site.analytics.ga4Id,
    })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'next_page_view', page_path: url, page_title: document.title })
  }, [pathname, searchParams])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const tracked = target?.closest<HTMLElement>('[data-track]')
      const trackedEvent = tracked?.dataset.track || ''
      if (trackedEvent) {
        window.dataLayer.push({
          event: trackedEvent,
          link_url: tracked instanceof HTMLAnchorElement ? tracked.href : '',
          link_text: tracked.textContent?.trim() || '',
        })
      }
      const anchor = target?.closest<HTMLAnchorElement>('a[href]')
      const href = anchor?.getAttribute('href') || ''
      if (href.startsWith('mailto:') && trackedEvent !== 'email_click') window.dataLayer.push({ event: 'email_click', link_url: href })
      if (href.startsWith('tel:') && trackedEvent !== 'phone_click') window.dataLayer.push({ event: 'phone_click', link_url: href })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}

export function ClientRuntime() {
  return <Suspense fallback={null}><RuntimeEffects /></Suspense>
}
