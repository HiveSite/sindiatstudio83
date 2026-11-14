import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/lead-form'
import { enServices, enIndustries, enCaseSummaries, enCaseDetails } from '@/data/en'
import { enProducts } from '@/data/en-products'
import { enServiceDetails } from '@/data/en-service-details'
import { enIndustryDetails } from '@/data/en-industry-details'
import { cases } from '@/data/cases'
import { serviceBySlug as canonicalServiceBySlug } from '@/data/services'
import { blogPosts } from '@/data/blog'
import { englishBlogBySlug, englishBlogPosts, plainEnglishExcerpt } from '@/data/en-blog'
import { site } from '@/data/site'
import { enLegalPages } from '@/data/en-legal'
import { ServicesPageContent } from '@/components/localized-services-page'
import { PricingPageContent } from '@/components/localized-pricing-page'
import { ServicePageContent } from '@/components/localized-service-detail'
import { IndustryPageContent } from '@/components/localized-industry-detail'
import { IndustriesPageContent } from '@/components/localized-industries-page'
import { AboutPageContent } from '@/components/localized-about-page'
import { ContactPageContent } from '@/components/localized-contact-page'
import { BlogPageContent } from '@/components/localized-blog-page'
import { ArticlePageContent } from '@/components/localized-blog-article'
import { WorksPageContent } from '@/components/localized-works-page'
import { CaseStudyPageContent } from '@/components/localized-case-detail'
import { FocusedServiceLanding } from '@/components/focused-service-landing'
import { focusedServicesEn } from '@/data/en-focused'
import { LegalPageContent } from '@/components/localized-legal-page'
import { ThankYouPageContent } from '@/components/localized-thank-you'
import { createEnglishMetadata } from '@/lib/metadata'
import { enBlogFullBySlug } from '@/data/localized-blog'

const enAdServices: Record<string,{title:string;summary:string;benefits:string[]}> = {
 'meta-ads':{title:'Instagram & Facebook advertising',summary:'Reach relevant people with Meta Ads. We connect the offer, creative assets, audience targeting and measurement instead of focusing only on views.',benefits:['Campaign planning and audience research','Photo, video and ad copy variations','Tracking, testing and reporting']},
 'google-ads':{title:'Google Search advertising',summary:'Make your offer visible when people actively search for a relevant product or service. We connect keywords, ads, landing pages and conversion measurement.',benefits:['Search intent and keyword planning','Campaign setup and negative keywords','Clear reporting and optimization']},
}

const top = [
  ['usluge','Services','What we can do for your business'],
  ['radovi','Projects','Selected work and practical experience'],
  ['industrije','Industries','Different businesses, different solutions'],
  ['cijene','Pricing','Starting points and ways of working'],
  ['o-nama','About the studio','Ideas, people and execution'],
  ['kontakt','Contact','Tell us what you are working on'],
  ['blog','Resources','Practical guides and ideas'],
  ['privatnost','Privacy policy','How personal information is used'],
  ['kolacici','Cookie policy','Your privacy choices'],
  ['uslovi-koriscenja','Terms of use','Using this website'],
  ['hvala','Thank you','Your enquiry'],
] as const
const enBase = '/en/'
const path = (parts:string[]) => enBase+parts.join('/')+(parts.length?'/':'')
const caseBySlug = Object.fromEntries(cases.map(x=>[x.slug,x]))
const serviceBySlug = Object.fromEntries(enServices.map(x=>[x.slug,x]))
const industryBySlug = Object.fromEntries(enIndustries.map(x=>[x.slug,x]))
const caseCopyBySlug = Object.fromEntries(enCaseSummaries.map(x=>[x.slug,x]))
const navLinks = [
  {name:'Services',href:'/en/usluge/'}, {name:'Projects',href:'/en/radovi/'},
  {name:'Industries',href:'/en/industrije/'}, {name:'Pricing',href:'/en/cijene/'},
  {name:'Contact',href:'/en/kontakt/'}
]

export const dynamicParams = false
export function generateStaticParams() {
  const pages: string[][] = top.map(([slug])=>[slug])
  pages.push(...enServices.map(x=>['usluge',x.slug]),['usluge','meta-ads'],['usluge','google-ads'])
  pages.push(...enCaseSummaries.map(x=>['radovi',x.slug]))
  pages.push(...enIndustries.map(x=>['industrije',x.slug]))
  pages.push(...blogPosts.map(x=>['blog',x.slug]))
  return pages.map(segments=>({segments}))
}

export async function generateMetadata({params}:{params:Promise<{segments:string[]}>}):Promise<Metadata>{
  const {segments}=await params
  const [kind,slug]=segments
  let title='Sindikat Studio 83'
  let description='Creative production, websites and advertising for businesses in Montenegro.'
  if(kind==='usluge'&&slug){const x=serviceBySlug[slug]||enAdServices[slug];if(!x)return {};title=x.title;description=x.summary}
  else if(kind==='radovi'&&slug){const x=caseCopyBySlug[slug];if(!x)return {};title=x.title;description=x.summary}
  else if(kind==='industrije'&&slug){const x=industryBySlug[slug];if(!x)return {};title=x.title;description=x.summary}
  else if(kind==='blog'&&slug){const article=englishBlogBySlug[slug];title=article?.title||'Practical guide';description=article?plainEnglishExcerpt(article):'A practical guide from Sindikat Studio 83.'}
  else {const x=top.find(row=>row[0]===kind);if(x){title=x[1];description=x[2]}}
  const article=kind==='blog'&&slug?enBlogFullBySlug[slug]:undefined
  const caseImage=kind==='radovi'&&slug?caseBySlug[slug]?.socialImage?.src||caseBySlug[slug]?.coverImage?.src:undefined
  return createEnglishMetadata({
    title,description,
    path:'/'+segments.join('/')+'/',
    image:article?.cover||caseImage,
    imageAlt:article?.coverAlt||title,
    type:article?'article':'website',
    noIndex:['privatnost','kolacici','uslovi-koriscenja','hvala'].includes(kind),
    publishedTime:article?.date||undefined,
    modifiedTime:article?.date||undefined,
    tags:article?.tags||[]
  })
}
function Head({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
 return <section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lead">{description}</p></div></section>
}
function Buttons({slug,service}:{slug:string;service?:string}){
 return <div className="button-row"><Link className="button button-primary" href={`/en/kontakt/?usluga=${service||slug}&izvor=en-service`}>Request a proposal ↗</Link><Link className="button button-ghost" href="/en/cijene/">See pricing</Link></div>
}
export default async function EnglishPages({params}:{params:Promise<{segments:string[]}>}){
  const {segments}=await params
  const [kind,slug]=segments
  if(!kind||segments.length>2)notFound()
  const service=serviceBySlug[slug]||enAdServices[slug]
  const industry=industryBySlug[slug]
  const project=caseCopyBySlug[slug]
  const original=caseBySlug[slug]
  if(kind==='usluge'&&slug&&canonicalServiceBySlug[slug]) return <div lang="en"><ServicePageContent slug={slug} locale="en" /></div>
  if(kind==='usluge'&&slug&&focusedServicesEn[slug])return <div lang="en"><FocusedServiceLanding data={focusedServicesEn[slug]} locale="en" /></div>
  if(kind==='usluge'&&!slug) return <div lang="en"><ServicesPageContent locale="en" /></div>
  if(kind==='industrije'&&slug&&industry) return <div lang="en"><IndustryPageContent slug={slug} locale="en" /></div>
  if(kind==='industrije'&&!slug) return <div lang="en"><IndustriesPageContent locale="en" /></div>
  if(kind==='radovi'&&slug&&project)return <div lang="en"><CaseStudyPageContent slug={slug} locale="en" /></div>
  if(kind==='radovi'&&!slug)return <div lang="en"><WorksPageContent locale="en" /></div>
  if(kind==='cijene') return <div lang="en"><PricingPageContent locale="en" /></div>
  if(kind==='o-nama')return <div lang="en"><AboutPageContent locale="en" /></div>
  if(kind==='kontakt')return <div lang="en"><ContactPageContent locale="en" /></div>
  if(kind==='hvala')return <div lang="en"><ThankYouPageContent locale="en" /></div>
  if(kind==='blog'&&!slug)return <div lang="en"><BlogPageContent locale="en" /></div>
  if(kind==='blog'&&slug&&englishBlogBySlug[slug])return <div lang="en"><ArticlePageContent slug={slug} locale="en" /></div>
  if(kind==='privatnost'||kind==='kolacici'||kind==='uslovi-koriscenja')return <div lang="en"><LegalPageContent slug={kind} locale="en" /></div>

  notFound()
}
