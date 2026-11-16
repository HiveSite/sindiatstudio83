import {notFound} from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { legalPages } from '@/data/legal'
import { enLegalPages } from '@/data/en-legal'
import { site } from '@/data/site'
import { breadcrumbSchema } from '@/lib/schema'
import {localeHref,translate,type SiteLocale} from '@/lib/locale'

export function LegalPageContent({slug,locale='sr'}:{slug:string;locale?:SiteLocale}){
 const en=locale==='en'
 const original=legalPages[slug as keyof typeof legalPages]
 const english=enLegalPages[slug as keyof typeof enLegalPages]
 if(!original||!english)notFound()
 if(original.sections.length!==english.sections.length)throw new Error('Legal sections mismatch '+slug)
 const title=en?english.title:original.title
 const description=en?english.description:original.description
 const sections=original.sections.map(([heading,text],i)=>({
   heading:en?english.sections[i].title:heading,
   text:en?english.sections[i].text:text
 }))
 const href=localeHref(locale,'/'+slug+'/')
 const crumbs=[{label:title,href}]
 return <>
  <JsonLd data={breadcrumbSchema(crumbs)} />
  <section className="section"><div className="container legal">
   <Breadcrumbs items={crumbs} locale={locale}/>
   <span className="eyebrow" style={{marginTop:42}}>{translate(locale,'Pravni dokument','Legal document')}</span>
   <h1>{title}</h1><p className="lead">{description}</p>
   {sections.map((section,index)=><div key={section.heading}>
    {index>0?<h2>{section.heading}</h2>:null}
    <p>{section.text}</p>
   </div>)}
   <p className="legal-updated">{en?'Last updated: November 12, 2026.':'Posljednje ažuriranje: 12. novembar 2026.'}</p>
  </div></section>
 </>
}
