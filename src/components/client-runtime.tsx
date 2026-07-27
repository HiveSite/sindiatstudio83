'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { sendDirectGa4Event, trackEvent } from '@/lib/tracking'

const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const

function RuntimeEffects() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPageRef = useRef('')

  useEffect(() => {
    if (!sessionStorage.getItem('sindikat_landing_page')) sessionStorage.setItem('sindikat_landing_page', window.location.pathname + window.location.search)

    campaignKeys.forEach((key) => {
      const value = searchParams.get(key)
      if (value) sessionStorage.setItem(`sindikat_${key}`, value)
    })

    if (!localStorage.getItem('sindikat_first_touch')) {
      const firstTouch = {
        landing_page: window.location.pathname + window.location.search,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        ...Object.fromEntries(campaignKeys.map((key) => [key, searchParams.get(key) || ''])),
      }
      localStorage.setItem('sindikat_first_touch', JSON.stringify(firstTouch))
    }
  }, [searchParams])

  useEffect(() => {
    const query = searchParams.toString()
    const pagePath = `${pathname}${query ? `?${query}` : ''}`
    if (lastPageRef.current === pagePath) return
    lastPageRef.current = pagePath

    const payload = {
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer,
    }

    trackEvent('next_page_view', payload)
    sendDirectGa4Event('page_view', payload)
  }, [pathname, searchParams])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const tracked = target?.closest<HTMLElement>('[data-track]')
      const trackedEvent = tracked?.dataset.track?.trim()
      const anchor = target?.closest<HTMLAnchorElement>('a[href]')
      const href = anchor?.getAttribute('href') || ''

      if (tracked && trackedEvent) {
        trackEvent(trackedEvent, {
          link_url: tracked instanceof HTMLAnchorElement ? tracked.href : href,
          link_text: tracked.textContent?.trim() || '',
          element_id: tracked.id || '',
        })
      }

      if (!anchor) return
      if (href.startsWith('mailto:') && trackedEvent !== 'email_click') trackEvent('email_click', { link_url: href })
      if (href.startsWith('tel:') && trackedEvent !== 'phone_click') trackEvent('phone_click', { link_url: href })

      const isExternal = /^https?:\/\//.test(href) && !href.startsWith(window.location.origin)
      if (isExternal && trackedEvent !== 'outbound_click') {
        trackEvent('outbound_click', { link_url: anchor.href, link_text: anchor.textContent?.trim() || '' })
      }

      if (/\.(pdf|docx?|xlsx?|zip)$/i.test(href)) {
        trackEvent('file_download', { file_url: anchor.href, file_name: href.split('/').pop() || '' })
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}

export function ClientRuntime() {
  return <Suspense fallback={null}><RuntimeEffects /></Suspense>
}
