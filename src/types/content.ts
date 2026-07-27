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
