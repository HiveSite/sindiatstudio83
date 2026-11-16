import type { Service, Industry } from '@/types/content'
import { services, serviceBySlug } from '@/data/services'
import { enServices, enIndustries } from '@/data/en'
import { enServiceDetails } from '@/data/en-service-details'
import { enIndustryDetails } from '@/data/en-industry-details'
import { industries, industryBySlug } from '@/data/industries'
import { enProducts } from '@/data/en-products'
import { enServiceParity } from '@/data/en-service-parity'
import type { SiteLocale } from '@/lib/locale'

export function localizedService(slug:string,locale:SiteLocale):Service|undefined {
 const original=serviceBySlug[slug]
 if(!original || locale==='sr')return original
 const basic=enServices.find(item=>item.slug===slug)
 const translated=enServiceParity[slug]
 const detail=enServiceDetails[slug]
 const product=enProducts[slug]
 if(!basic||!detail||!product||!translated)throw new Error('Missing English service translation for '+slug)
 const needed={
  outcomes:translated.outcomes, bestFor:detail.bestFor,
  clientInputs:detail.needFromYou, successSignals:detail.successSignals,
  includes:detail.includes, process:detail.process,
  engagements:translated.engagements, faq:detail.faq
 }
 const expected={
  outcomes:original.outcomes, bestFor:original.bestFor,
  clientInputs:original.clientInputs, successSignals:original.successSignals,
  includes:original.includes, process:original.process,
  engagements:original.engagements, faq:original.faq
 }
 for(const key of Object.keys(needed) as (keyof typeof needed)[]){
  if(needed[key].length!==expected[key].length)throw new Error('EN service content mismatch: '+slug+' '+key+' SR='+expected[key].length+' EN='+needed[key].length)
 }
 return {
  ...original,eyebrow:translated.eyebrow,title:translated.title,shortTitle:translated.shortTitle,summary:translated.summary,
  outcomes:[...translated.outcomes],
  bestFor:[...detail.bestFor],clientInputs:[...detail.needFromYou],
  successSignals:[...detail.successSignals],includes:[...detail.includes],
  process:detail.process.map(step=>[step.name,step.text]),
  engagements:[...translated.engagements],
  faq:detail.faq.map(entry=>[entry.question,entry.answer])
 }
}

export function localizedIndustry(slug:string,locale:SiteLocale):Industry|undefined {
 const original=industryBySlug[slug]
 if(!original||locale==='sr')return original
 const basic=enIndustries.find(item=>item.slug===slug)
 const detail=enIndustryDetails[slug]
 if(!basic||!detail)throw new Error('Missing English industry translation: '+slug)
 const match:{key:string;sr:unknown[];en:unknown[]}[]=[
  {key:'problems',sr:original.problems,en:detail.problems},
  {key:'solutions',sr:original.solutions,en:detail.solutions},
  {key:'bestFor',sr:original.bestFor,en:detail.bestFor},
  {key:'successSignals',sr:original.successSignals,en:detail.signals},
 ]
 for(const x of match)if(x.sr.length!==x.en.length)throw new Error('EN industry content mismatch '+slug+' '+x.key)
 return {
  ...original,title:basic.title,summary:basic.summary,
  problems:[...detail.problems],solutions:[...detail.solutions],
  bestFor:[...detail.bestFor],successSignals:[...detail.signals],
  timing:detail.timing,cta:'Discuss your project'
 }
}

export const allServiceSlugs=services.map(x=>x.slug)
export const allIndustrySlugs=industries.map(x=>x.slug)
