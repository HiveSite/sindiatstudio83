import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/lead-form'
import { enServices, enIndustries, enCaseSummaries } from '@/data/en'
import { enProducts } from '@/data/en-products'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'
import { enLegalPages } from '@/data/en-legal'

const enArticles: Record<string,string> = {
p01:'Why a campaign in Podgorica can fail before it starts',
p02:'Five Meta Ads mistakes businesses in Montenegro can avoid',
p03:'Why attractive creative is not always effective advertising',
p04:'How much does event planning cost in Podgorica?',
p05:'Brand activations in Montenegro - turning field work into results',
p06:'Organising an event in Podgorica - a practical guide',
p07:'Event production costs in Montenegro explained',
p08:'Corporate event checklist - venue, team and production',
p09:'Brand activations versus simple promotions',
p10:'Nine elements of a landing page that encourages enquiries',
p11:'Common event sound and lighting mistakes',
p12:'How to measure a field promotion',
p13:'Practical promotional ideas for hospitality venues',
p14:'Combining events with digital campaigns',
p15:'What to review after a one-day promotion',
p16:'Meta advertising in Podgorica - what to check first',
p17:'Choosing Google Ads keywords for service businesses',
p18:'Seven reasons ads spend money without producing enquiries',
p19:'A practical structure for enquiry-driven landing pages',
p20:'How much advertising budget do you need to begin?',
p21:'When remarketing makes sense',
p22:'Ten creative variations without burning out your team',
p23:'Cost per click versus cost per enquiry',
p24:'GA4 and GTM - what is worth measuring?',
p25:'SEO versus paid ads - when to combine them',
p26:'Local SEO in Podgorica - improving Google visibility',
p27:'Google Business Profile basics and customer reviews',
p28:'Common SEO mistakes on agency websites',
p29:'Why service pages and blog posts have different jobs',
p30:'How to write a service page people understand',
}
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
  else if(kind==='blog'&&slug){title=enArticles[slug]||'Practical guide';description='A practical guide from Sindikat Studio 83.'}
  else {const x=top.find(row=>row[0]===kind);if(x){title=x[1];description=x[2]}}
  return {
    title:`${title} | Sindikat Studio 83`,description,
    alternates:{canonical:path(segments),languages:kind==='blog'&&slug?undefined:{'en':path(segments),'sr-Latn-ME':`/${segments.join('/')}/`}},
    robots:(kind==='blog'&&slug)||['privatnost','kolacici','uslovi-koriscenja','hvala'].includes(kind)?{index:false,follow:true}:undefined,
    openGraph:{locale:'en_GB',title,description},
  }
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
  if(kind==='usluge'&&slug&&service){
    const products=enProducts[slug]||enProducts['performance-marketing']
    return <div lang="en"><Head eyebrow="OUR SERVICES / MONTENEGRO" title={service.title} description={service.summary}/>
      <section className="section section-dark"><div className="container"><h2>What we can deliver</h2>
      <div className="home-process-grid">{service.benefits.map((x,i)=><article className="home-process-step" key={x}><span>{String(i+1).padStart(2,'0')}</span><h3>{x}</h3></article>)}</div>
      <p style={{marginTop:28}}>Every project starts with a clear scope, timeline and responsibilities. We work with local and international teams.</p><Buttons slug={slug}/></div></section>
      <section className="section section-light"><div className="container"><h2>Starting options</h2><p>Prices below are indicative starting points, not fixed quotes. Media spend and external supplier costs are agreed separately.</p>
      <div className="home-process-grid">{products.map(x=><article key={x.name} className="home-process-step" style={{background:'#fff',color:'#15151b'}}><h3>{x.name} - {x.price}</h3><p style={{color:'#444'}}>{x.description}</p><ul>{x.includes.map(part=><li key={part}>{part}</li>)}</ul><Link href={`/en/kontakt/?usluga=${slug}`}>Discuss this option ↗</Link></article>)}</div></div></section>
    </div>
  }
  if(kind==='usluge'&&!slug) return <div lang="en"><Head eyebrow="OUR SERVICES" title="One team for strategy and execution" description="Advertising, content, websites, events and recruitment campaigns in one coordinated offering."/><section className="section section-dark"><div className="container home-service-list">{enServices.map(s=><article className="home-service-row" key={s.slug}><span className="home-service-number">+</span><div className="home-service-main"><h3><Link href={path(['usluge',s.slug])}>{s.title}</Link></h3><p>{s.summary}</p></div><div className="home-service-action"><Link href={path(['usluge',s.slug])}>Explore ↗</Link></div></article>)}</div></section></div>
  if(kind==='industrije'&&slug&&industry)return <div lang="en"><Head eyebrow="INDUSTRIES" title={industry.title} description={industry.summary}/><section className="section"><div className="container"><h2>How we help</h2><p>Campaign planning, content production, websites and operational coordination adapted to the way your industry works.</p><Buttons slug={slug}/></div></section></div>
  if(kind==='industrije'&&!slug)return <div lang="en"><Head eyebrow="INDUSTRIES" title="Different industries. Practical solutions." description="We adapt the project scope, messaging, people and timeline to each industry."/><section className="section v7-industries-home"><div className="container v7-industries-grid">{enIndustries.map(s=><Link key={s.slug} href={path(['industrije',s.slug])} className="v7-industry"><h3>{s.title}</h3><p>{s.summary}</p><strong>Read more ↗</strong></Link>)}</div></section></div>
  if(kind==='radovi'&&slug&&project)return <div lang="en"><Head eyebrow="SELECTED PROJECT" title={project.title} description={project.summary}/><section className="section section-dark"><div className="container">{original?.coverImage?.src?<Image src={original.coverImage.src} alt={project.title} width={1000} height={600} style={{width:'100%',height:'auto',objectFit:'contain',borderRadius:20}}/>:null}<div style={{marginTop:30}}><h2>Our approach</h2><p>{project.summary}</p><Link href="/en/kontakt/" className="button button-primary">Discuss a similar project ↗</Link></div></div></section></div>
  if(kind==='radovi'&&!slug)return <div lang="en"><Head eyebrow="OUR WORK" title="Real projects. Real execution." description="A selection of digital products, events, content and field projects from our studio."/><section className="section section-dark"><div className="container home-project-grid">{enCaseSummaries.map(s=><article className="home-project-card" key={s.slug}><div className="home-project-text"><h3>{s.title}</h3><p>{s.summary}</p><Link href={path(['radovi',s.slug])}>Explore project ↗</Link></div></article>)}</div></section></div>
  if(kind==='cijene')return <div lang="en"><Head eyebrow="PRICING & COLLABORATION" title="A clear starting point. A tailored proposal." description="Choose a service area and explore the starting prices. Final scope, timeline and costs are agreed before work begins."/><section className="section section-dark"><div className="container">{enServices.map(s=><section key={s.slug} style={{marginBottom:48}}><h2>{s.title}</h2><div className="home-process-grid">{(enProducts[s.slug]||[]).map(product=><article key={product.name} className="home-process-step"><span>STARTING AT</span><h3>{product.name} - {product.price}</h3><p>{product.description}</p><ul>{product.includes.map(part=><li key={part}>{part}</li>)}</ul><Link href={`/en/kontakt/?usluga=${s.slug}`}>Request an estimate ↗</Link></article>)}</div></section>)}</div></section></div>
  if(kind==='o-nama')return <div lang="en"><Head eyebrow="ABOUT SINDIKAT" title="An independent studio built for real-world execution." description="We combine digital work, creative production, teams and coordination so businesses can move from a plan to a finished project."/><section className="section section-dark"><div className="container"><h2>One team, multiple disciplines</h2><p>Our work spans campaigns, digital products, content, events and field activation. We believe a good idea matters only when people can turn it into clear deliverables.</p><p>Based in Podgorica, we work on projects across Montenegro and collaborate with trusted partners when a project needs additional expertise.</p><Link href="/en/kontakt/" className="button button-primary">Talk to our studio ↗</Link></div></section></div>
  if(kind==='kontakt')return <div lang="en"><Head eyebrow="CONTACT" title="Tell us about your project." description="Share your goal, timeline and a few details. We will get back to you with a realistic next step."/><section className="section section-dark"><div className="container"><LeadForm source="en-contact-page" locale="en"/><p style={{marginTop:24}}>You can also email us directly at <a href={`mailto:${site.email}`}>{site.email}</a>.</p></div></section></div>
  if(kind==='hvala')return <div lang="en"><Head eyebrow="THANK YOU" title="Your enquiry has been received." description="We will review your message and get back to you as soon as we can."/><section className="section"><div className="container"><Link className="button button-primary" href="/en/">Back to homepage ↗</Link></div></section></div>
  if(kind==='blog'&&!slug)return <div lang="en"><Head eyebrow="RESOURCES" title="Practical guides from the studio." description="Explore campaign planning, websites, local search and event production."/><section className="section section-dark"><div className="container home-project-grid">{blogPosts.map(post=><article key={post.slug} className="home-project-card"><div className="home-project-text"><h3>{enArticles[post.slug]}</h3><p>Insights and practical guidance from Sindikat Studio 83.</p><Link href={path(['blog',post.slug])}>English article overview ↗</Link></div></article>)}</div></section></div>
  if(kind==='blog'&&slug&&enArticles[slug])return <div lang="en"><Head eyebrow="ARTICLE OVERVIEW" title={enArticles[slug]} description="An English overview of this topic is being edited. The full article is currently available in Serbian (ijekavian)."/><section className="section section-dark"><div className="container"><h2>Read the full guide</h2><p>The complete English translation has not yet been published. We would rather show this clearly than display an incomplete or unreliable automated translation.</p><Link href={`/blog/${slug}/`} className="button button-ghost">Read the original Serbian guide ↗</Link></div></section></div>
  if(kind==='privatnost'||kind==='kolacici'||kind==='uslovi-koriscenja'){
    const legal=enLegalPages[kind]
    return <div lang="en"><Head eyebrow="LEGAL INFORMATION" title={legal.title} description={legal.description}/>
      <section className="section section-dark"><div className="container legal">
        {legal.sections.map(section=><div key={section.title} style={{marginBottom:30}}><h2>{section.title}</h2><p>{section.text}</p></div>)}
        <p>Last updated: November 12, 2026.</p>
        <p>Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div></section>
    </div>
  }

  notFound()
}
