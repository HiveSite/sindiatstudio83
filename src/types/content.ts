export type Metric = readonly [value: string, label: string]

export interface ServiceEngagement {
  name: string
  text: string
}

export interface Service {
  slug: string
  eyebrow: string
  title: string
  shortTitle: string
  summary: string
  outcomes: string[]
  bestFor: string[]
  clientInputs: string[]
  successSignals: string[]
  includes: string[]
  process: string[][]
  engagements: ServiceEngagement[]
  faq: string[][]
  accent: string
}

export interface Industry {
  slug: string
  title: string
  summary: string
  problems: string[]
  solutions: string[]
  bestFor: string[]
  successSignals: string[]
  timing: string
  caseSlugs: string[]
  cta: string
}

export type CaseCategory =
  | 'digitalni-proizvodi'
  | 'web-i-mini-sajtovi'
  | 'aktivacije-i-promo-timovi'
  | 'dogadjaji-i-produkcija'
  | 'edukacija-i-community'

export interface CaseStudyLink {
  label: string
  href: string
}

export interface CaseStudyImage {
  src: string
  alt: string
  width: number
  height: number
  position?: string
}

export interface CaseStudyMedia {
  label: string
  kind: 'Fotografija' | 'Screenshot' | 'Vizual'
  aspect?: 'wide' | 'landscape' | 'portrait' | 'square'
  image?: CaseStudyImage
}

export interface CaseStudySubproject {
  title: string
  summary: string
  link?: CaseStudyLink
}

export interface CaseStudy {
  slug: string
  type: string
  title: string
  summary: string
  role: string
  metrics?: string[][]
  challenge: string
  solution: string
  result: string
  services: string[]
  serviceSlugs: string[]
  categories: CaseCategory[]
  scope: string[]
  coverMark: string
  coverLabel: string
  coverImage?: CaseStudyImage
  socialImage?: CaseStudyImage
  links?: CaseStudyLink[]
  gallery: CaseStudyMedia[]
  subprojects?: CaseStudySubproject[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  description: string
  category: string
  date: string
  cover: string
  coverAlt: string
  tags: string[]
  body: string
}
