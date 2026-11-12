import Link from 'next/link'
import { industries } from '@/data/industries'

const goals = [
  {title:'Više kupaca i upita',desc:'Oglasi, prodaja i konverzije',href:'/usluge/performance-marketing/'},
  {title:'Jači nastup na mrežama',desc:'Snimanje, sadržaj i društvene mreže',href:'/usluge/sadrzaj-za-kampanje/'},
  {title:'Sajt koji prodaje',desc:'Sajtovi, odredišne stranice i digitalni proizvodi',href:'/usluge/web-i-konverzije/'},
  {title:'Događaj ili aktivacija',desc:'Produkcija, ljudi i realizacija',href:'/usluge/aktivacije-i-eventi/'},
  {title:'Potrebni su mi ljudi',desc:'Zapošljavanje i promotivni timovi',href:'/usluge/recruitment-kampanje/'},
] as const

export function HomeQuickChoices() {
  return <section className="section v7-quick-choice" id="brzi-izbor" aria-labelledby="quick-choice-title">
    <div className="container">
      <div className="home-sales-heading"><div><span className="eyebrow">BRZI IZBOR / 20 SEKUNDI</span><h2 id="quick-choice-title">Šta treba da uradimo za tvoj biznis?</h2></div><p>Ne moraš znati naziv usluge. Izaberi rezultat koji želiš - odmah ćemo te odvesti do relevantne ponude.</p></div>
      <div className="v7-quick-list">{goals.map((goal,i)=><Link href={goal.href} className="v7-quick-card" key={goal.title}>
        <span>{String(i+1).padStart(2,'0')}</span><div><h3>{goal.title}</h3><p>{goal.desc}</p></div><b aria-hidden="true">↗</b>
      </Link>)}</div>
    </div>
  </section>
}

export function HomeIndustriesPreview() {
  return <section className="section v7-industries-home" aria-labelledby="v7-industries-heading"><div className="container">
    <div className="home-sales-heading"><div><span className="eyebrow">RADIMO SA RAZLIČITIM BIZNISIMA</span><h2 id="v7-industries-heading">Znamo da nije svaki biznis isti.</h2></div><p>Od hotela i maloprodaje do događaja i zapošljavanja - usklađujemo poruku, korisnički tok i realizaciju sa stvarnim kontekstom.</p></div>
    <div className="v7-industries-grid">{industries.slice(0,5).map((item,i)=><Link className="v7-industry" href={`/industrije/${item.slug}/`} key={item.slug}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.summary}</p><strong>Saznaj više ↗</strong></Link>)}</div>
    <div className="v7-industries-more"><Link href="/industrije/" className="button button-ghost">Sve industrije ↗</Link></div>
  </div></section>
}
