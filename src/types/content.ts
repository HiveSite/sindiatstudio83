export type Metric = readonly [value: string, label: string]

export interface ServicePrice {
  name: string
  price: string
  text: string
}

export interface Service {
  slug: string
  eyebrow: string
  title: string
  shortTitle: string
  summary: string
  outcomes: string[]
  includes: string[]
  process: string[][]
  pricing: ServicePrice[]
  faq: string[][]
  accent: string
}

export interface Industry {
  slug: string
  title: string
  summary: string
  problems: string[]
  solutions: string[]
  cta: string
}

export interface CaseStudyLink {
  label: string
  href: string
}

export interface CaseStudyMedia {
  label: string
  kind: 'Fotografija' | 'Screenshot'
  aspect?: 'wide' | 'landscape' | 'portrait' | 'square'
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
  metrics: string[][]
  challenge: string
  solution: string
  result: string
  services: string[]
  scope: string[]
  coverMark: string
  coverLabel: string
  links?: CaseStudyLink[]
  gallery: CaseStudyMedia[]
  subprojects?: CaseStudySubproject[]
  note?: string
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
