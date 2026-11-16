import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { enIndustries } from '@/data/en'
import Link from 'next/link'
import { industries } from '@/data/industries'

const goals = [
  {title:'Više kupaca i upita',desc:'Oglasi, prodaja i konverzije',href:'/usluge/performance-marketing/'},
  {title:'Jači nastup na mrežama',desc:'Snimanje, sadržaj i društvene mreže',href:'/usluge/sadrzaj-za-kampanje/'},
  {title:'Sajt koji prodaje',desc:'Sajtovi, odredišne stranice i digitalni proizvodi',href:'/usluge/web-i-konverzije/'},
  {title:'Događaj ili aktivacija',desc:'Produkcija, ljudi i realizacija',href:'/usluge/aktivacije-i-eventi/'},
  {title:'Potrebni su mi ljudi',desc:'Zapošljavanje i promotivni timovi',href:'/usluge/recruitment-kampanje/'},
] as const

export function HomeQuickChoices({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const enGoals=[
    {title:'More customers and enquiries',desc:'Ads, sales and conversions'},
    {title:'Stronger social presence',desc:'Filming, content and social media'},
    {title:'A website that converts',desc:'Websites, landing pages and digital products'},
    {title:'An event or activation',desc:'Production, people and execution'},
    {title:'We need a team',desc:'Recruitment and promotional teams'}
  ]
  return <section className="section v7-quick-choice" id="brzi-izbor" aria-labelledby="quick-choice-title">
    <div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">{t('BRZI IZBOR / 20 SEKUNDI','QUICK CHOICE / 20 SECONDS')}</span><h2 id="quick-choice-title">{t('Šta treba da uradimo za tvoj biznis?','What do you need for your business?')}</h2></div><p>{t('Ne moraš znati naziv usluge. Izaberi rezultat koji želiš - odmah ćemo te odvesti do relevantne ponude.','You do not need to know the service name. Choose the outcome you want and we will show you the relevant offer.')}</p></div>
      <div className="v7-quick-list">{goals.map((goal,i)=><Link href={localeHref(locale,goal.href)} className="v7-quick-card" key={locale === "en" ? enGoals[i].title : goal.title}>
        <span>{String(i+1).padStart(2,'0')}</span><div><h3>{goal.title}</h3><p>{locale === "en" ? enGoals[i].desc : goal.desc}</p></div><b aria-hidden="true">↗</b>
      </Link>)}</div>
    </div>
  </section>
}

export function HomeIndustriesPreview({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  return <section className="section v7-industries-home" aria-labelledby="v7-industries-heading"><div className="container">
    <div className="home-sales-heading"><div><span className="eyebrow">{t('RADIMO SA RAZLIČITIM BIZNISIMA','WORKING WITH DIFFERENT BUSINESSES')}</span><h2 id="v7-industries-heading">{t('Znamo da nije svaki biznis isti.','Every business is different.')}</h2></div><p>{t('Od hotela i maloprodaje do događaja i zapošljavanja - usklađujemo poruku, korisnički tok i realizaciju sa stvarnim kontekstom.','From hotels and retail to events and recruitment, we tailor messaging, journeys and execution to the real context.')}</p></div>
    <div className="v7-industries-grid">{industries.slice(0,5).map((item,i)=><Link className="v7-industry" href={localeHref(locale,`/industrije/${item.slug}/`)} key={item.slug}><span>0{i+1}</span><h3>{locale === 'en' ? enIndustries[i]?.title || item.title : item.title}</h3><p>{locale === 'en' ? enIndustries[i]?.summary || item.summary : item.summary}</p><strong>{t('Saznaj više ↗','Read more ↗')}</strong></Link>)}</div>
    <div className="v7-industries-more"><Link href={localeHref(locale,"/industrije/")} className="button button-ghost">{t('Sve industrije ↗','All industries ↗')}</Link></div>
  </div></section>
}
