const publicEnv = (value: string | undefined, fallback: string) => value?.trim() || fallback
const publicBoolean = (value: string | undefined, fallback: boolean) => {
  if (value == null || value.trim() === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
}

export const site = {
  name: 'Sindikat Studio 83',
  shortName: 'Sindikat',
  domain: publicEnv(process.env.NEXT_PUBLIC_SITE_URL, 'https://www.sindikatstudio83.me'),
  locale: 'sr-Latn-ME',
  openGraphLocale: 'sr_ME',
  location: 'Podgorica, Crna Gora',
  email: publicEnv(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'sindikatevents@gmail.com'),
  instagram: 'https://www.instagram.com/sindikat_studio83/',
  imaposla: 'https://imaposla.me/',
  contentUpdatedAt: '2026-08-12',
  responseTime: 'Odgovaramo u roku od jednog radnog dana.',
  consentVersion: '2026-11-12-v2',
  analytics: {
    ga4Id: publicEnv(process.env.NEXT_PUBLIC_GA4_ID, 'G-NH2FL5SP1Y'),
    gtmId: publicEnv(process.env.NEXT_PUBLIC_GTM_ID, 'GTM-PBXVW3GK'),
    directGa4Enabled: publicBoolean(process.env.NEXT_PUBLIC_DIRECT_GA4_ENABLED, true),
    forwardCustomEventsToDirectGa4: publicBoolean(process.env.NEXT_PUBLIC_DIRECT_GA4_CUSTOM_EVENTS, false),
  },
  integrations: {
    contactEndpoint: publicEnv(
      process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
      'https://script.google.com/macros/s/AKfycbyKu4_7m2qLOxnlfiDLYcwYbP4u1hswsp_mqH9rUj0ByyoUv1IVY0abc3gCK67QE4AQxQ/exec',
    ),
  },
  proof: [
    { value: '9', label: 'projekata predstavljenih u portfoliju' },
    { value: '20+', label: 'partnera i saradnika' },
    { value: '150+', label: 'ljudi u mreži za angažmane i događaje' },
  ],
} as const

export const navigation = [
  { label: 'Usluge', href: '/usluge/' },
  { label: 'Industrije', href: '/industrije/' },
  { label: 'Projekti', href: '/radovi/' },
  { label: 'Cijene', href: '/cijene/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'O nama', href: '/o-nama/' },
  { label: 'Kontakt', href: '/kontakt/' },
] as const
