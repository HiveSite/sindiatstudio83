import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { HeroShowcase } from '@/components/hero-showcase'
import { enServices, enIndustries, enCaseSummaries } from '@/data/en'
import { cases } from '@/data/cases'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Creative production, campaigns and websites | Sindikat Studio 83',
  description: 'Sindikat Studio 83 is a creative and production studio in Podgorica, Montenegro. Digital advertising, content, websites, events and activation teams.',
  alternates: { canonical: '/en/', languages: {'sr-Latn-ME':'/','en':'/en/'} },
  openGraph: { locale:'en_GB',title:'Sindikat Studio 83 | Ideas. People. Execution.',description:'Creative campaigns, digital products and events in Montenegro.' },
}

export default function EnglishHome() {
  return <div className="sales-home" lang="en">
    <section className="demo-hero" aria-label="Sindikat Studio 83 - a creative and production studio">
      <div className="demo-hero-photo"><HeroShowcase /></div>
      <div className="container demo-hero-content"><div className="demo-hero-copy">
        <span className="eyebrow">Independent creative & production studio / Podgorica</span>
        <h1><span>IDEAS.</span><span>PEOPLE.</span><span className="demo-hero-accent">EXECUTION.</span></h1>
        <p className="lead">We create campaigns, shoot content, build websites and deliver events. One team connects the first idea with every detail of execution.</p>
        <div className="button-row demo-hero-actions"><Link className="button button-primary" href="/en/kontakt/">Start a project ↗</Link><Link className="button button-ghost" href="/en/radovi/">Explore our work ↗</Link></div>
        <div className="demo-hero-subline">Podgorica · Montenegro / One team, multiple disciplines.</div>
      </div></div>
    </section>
    <section className="proof-strip"><div className="container proof-grid">
      <div className="proof-intro">More than just a presentation.</div>
      <div className="proof-stat"><strong>9</strong><span>projects in our portfolio</span></div>
      <div className="proof-stat"><strong>20+</strong><span>partners and collaborators</span></div>
      <div className="proof-stat"><strong>150+</strong><span>people in our event and field network</span></div>
    </div></section>
    <section className="section v7-quick-choice"><div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">WHAT CAN WE DO FOR YOU?</span><h2>Tell us the outcome. We'll work out the details.</h2></div><p>Whether you need more enquiries, better content or an event delivered from start to finish, we can connect the right services.</p></div>
      <div className="v7-quick-list">
        {[
          {title:'More enquiries and customers',desc:'Advertising, messaging and conversion tracking',href:'/en/usluge/performance-marketing/'},
          {title:'Stronger social content',desc:'Video, photography and campaign creative',href:'/en/usluge/sadrzaj-za-kampanje/'},
          {title:'A website that works',desc:'Websites, landing pages and digital platforms',href:'/en/usluge/web-i-konverzije/'},
          {title:'An event or activation',desc:'Concept, logistics, crews and production',href:'/en/usluge/aktivacije-i-eventi/'},
          {title:'Help with hiring or teams',desc:'Recruitment campaigns and field crews',href:'/en/usluge/recruitment-kampanje/'}
        ].map((item,i)=><Link className="v7-quick-card" key={item.href} href={item.href}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div><b>↗</b></Link>)}
      </div>
    </div></section>
    <section className="section home-service-directory"><div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">WHAT WE DO</span><h2>Five areas. One accountable team.</h2></div><p>Explore our services and see what is involved. Every proposal is tailored to the scope, timeline and people needed.</p></div>
      <div className="home-service-list">{enServices.map((s,i)=><article className="home-service-row" key={s.slug}>
        <span className="home-service-number">{String(i+1).padStart(2,'0')}</span><div className="home-service-main"><h3><Link href={`/en/usluge/${s.slug}/`}>{s.title}</Link></h3><p>{s.summary}</p></div>
        <div className="home-service-action"><Link href={`/en/usluge/${s.slug}/`}>Explore service ↗</Link><Link className="home-service-brief" href={`/en/kontakt/?usluga=${s.slug}`}>Request a proposal</Link></div>
      </article>)}</div>
    </div></section>
    <section className="section home-project-highlights"><div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">SELECTED WORK</span><h2>Ideas brought to life.</h2></div><p>Real projects, real teams and practical work behind the creative.</p></div>
      <div className="home-project-grid">{enCaseSummaries.slice(0,3).map(item=>{
        const example=cases.find(c=>c.slug===item.slug)
        return <article className="home-project-card" key={item.slug}>
          <Link className="home-project-image-link" href={`/en/radovi/${item.slug}/`}>{example?.coverImage?.src ? <Image src={example.coverImage.src} alt={item.title} fill sizes="(max-width:760px) 100vw, 33vw"/> : null}</Link>
          <div className="home-project-text"><h3>{item.title}</h3><p>{item.summary}</p><div className="home-project-links"><Link href={`/en/radovi/${item.slug}/`}>Read project ↗</Link></div></div>
        </article>
      })}</div><div className="home-all-projects"><Link className="button button-ghost" href="/en/radovi/">View all projects ↗</Link></div>
    </div></section>
    <section className="section home-process"><div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">HOW WE WORK</span><h2>From first conversation to delivery.</h2></div><p>You do not need a finished brief. A goal, a timeline and a few details are enough to start.</p></div>
      <div className="home-process-grid">{[
        {n:'01',title:'Understand the goal',text:'We ask what needs to happen, who the audience is and what is realistic.'},
        {n:'02',title:'Define the scope',text:'We agree on deliverables, responsibilities, timing and costs.'},
        {n:'03',title:'Create and deliver',text:'We coordinate production, track progress and review results.'}
      ].map(x=><div className="home-process-step" key={x.n}><span>{x.n}</span><h3>{x.title}</h3><p>{x.text}</p></div>)}</div>
    </div></section>
    <section className="section v7-industries-home"><div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">INDUSTRIES</span><h2>Different businesses need different solutions.</h2></div><p>Our approach adapts to the practical demands of each market, from hospitality to recruitment.</p></div>
      <div className="v7-industries-grid">{enIndustries.map(x=><Link className="v7-industry" key={x.slug} href={`/en/industrije/${x.slug}/`}><h3>{x.title}</h3><p>{x.summary}</p><strong>Explore ↗</strong></Link>)}</div>
    </div></section>
    <section className="section section-dark"><div className="container"><div className="home-sales-heading"><div><span className="eyebrow">LET'S TALK</span><h2>Have something in mind?</h2></div><p>Tell us what you need. We will propose a realistic next step and a clear scope.</p></div><Link className="button button-primary" href="/en/kontakt/">Request a proposal ↗</Link></div></section>
  </div>
}
