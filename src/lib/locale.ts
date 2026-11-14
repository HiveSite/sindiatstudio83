export type SiteLocale = 'sr' | 'en'
export const translate = (locale: SiteLocale, sr: string, en: string) => locale === 'en' ? en : sr
export function localeHref(locale: SiteLocale, href: string): string {
  if (locale !== 'en' || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/en/')) return href
  return '/en' + href
}
