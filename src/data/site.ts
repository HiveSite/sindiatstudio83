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
  consentVersion: '2026-07-27',
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
    jobsEndpoint: publicEnv(
      process.env.NEXT_PUBLIC_JOBS_ENDPOINT,
      'https://script.google.com/macros/s/AKfycbwSwvILrfKoSaDYrOIegGY3E_4_eokard8yY9lurGfcEL7fQNsPxb5wT0ZRKwJfnC2_/exec',
    ),
    blogEndpoint: publicEnv(
      process.env.NEXT_PUBLIC_BLOG_ENDPOINT,
      'https://script.google.com/macros/s/AKfycbzGf2MSW8mS-sm9ZUnszl7rfYoP2WRJ-3reuYdeMz-4PD0adX2L5ZzOz47Xaa-w-45N/exec?sheet=Posts&onlyPublished=1',
    ),
  },
  proof: [
    { value: '150+', label: 'ljudi u operativnom rosteru' },
    { value: '15+', label: 'klijenata i partnerskih timova' },
    { value: '20.000 €+', label: 'isplaćeno angažovanim ljudima u prva četiri mjeseca' },
  ],
} as const

export const navigation = [
  { label: 'Usluge', href: '/usluge/' },
  { label: 'Radovi', href: '/radovi/' },
  { label: 'O nama', href: '/o-nama/' },
  { label: 'Kontakt', href: '/kontakt/' },
] as const
