'use client'

import { site } from '@/data/site'

export type TrackingPayload = Record<string, unknown>

export function pushDataLayer(event: string, payload: TrackingPayload = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })
}

export function sendDirectGa4Event(event: string, payload: TrackingPayload = {}) {
  if (typeof window === 'undefined' || !site.analytics.directGa4Enabled) return
  window.gtag?.('event', event, { ...payload, send_to: site.analytics.ga4Id })
}

export function trackEvent(event: string, payload: TrackingPayload = {}) {
  pushDataLayer(event, payload)
  if (site.analytics.forwardCustomEventsToDirectGa4) sendDirectGa4Event(event, payload)
}

export function getStoredCampaignData() {
  if (typeof window === 'undefined') return {}
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
  return Object.fromEntries(keys.map((key) => [
    key,
    new URLSearchParams(window.location.search).get(key)
      || sessionStorage.getItem(`sindikat_${key}`)
      || '',
  ]))
}

export function getFirstTouchData() {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem('sindikat_first_touch')
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [`first_${key}`, value]))
  } catch {
    return {}
  }
}
