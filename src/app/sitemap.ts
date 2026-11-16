import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { industries } from '@/data/industries'
import { cases } from '@/data/cases'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'
import { enServices,enIndustries,enCaseSummaries } from '@/data/en'
import { englishBlogPosts } from '@/data/en-blog'

export const dynamic = 'force-static'
const absoluteUrl=(route:string)=>new URL(route,site.domain).toString()
const alternates=(route:string)=>({languages:{
 'sr-Latn-ME':absoluteUrl(route),
 'en':absoluteUrl('/en'+route),
 'x-default':absoluteUrl(route)
}})
const pair=(route:string,other?:{images?:string[],date?:Date}):MetadataRoute.Sitemap => [
 {url:absoluteUrl(route),alternates:alternates(route), images:other?.images?.map(absoluteUrl),lastModified:other?.date},
 {url:absoluteUrl('/en'+route),alternates:alternates(route),images:other?.images?.map(absoluteUrl),lastModified:other?.date}
]
export default function sitemap():MetadataRoute.Sitemap{
 const staticRoutes:MetadataRoute.Sitemap=[
  ...pair('/',{images:['/images/brand/og-cover.png']}),
  ...['/usluge/','/cijene/','/usluge/meta-ads/','/usluge/google-ads/','/industrije/','/radovi/','/o-nama/','/blog/','/kontakt/'].flatMap(route=>pair(route))
 ]
 // Both languages contain identical, independently indexable public routes.
 const serviceRoutes=services.map(item=>({slug:item.slug,path:'/usluge/'+item.slug+'/'}))
 const industryRoutes=industries.map(item=>({slug:item.slug,path:'/industrije/'+item.slug+'/'}))
 const caseRoutes=cases.map(item=>({slug:item.slug,path:'/radovi/'+item.slug+'/',image:item.socialImage?.src||item.coverImage?.src}))
 const blogRoutes=blogPosts.map(item=>({slug:item.slug,path:'/blog/'+item.slug+'/',image:item.cover,date:item.date}))
 const assertSame=(label:string,src:string[],en:string[])=>{
  const missing=src.filter(slug=>!en.includes(slug)),extra=en.filter(slug=>!src.includes(slug))
  if(missing.length||extra.length)throw new Error(label+' EN/SR routes mismatch: missing '+missing.join(',')+' extra '+extra.join(','))
 }
 assertSame('services',serviceRoutes.map(x=>x.slug),enServices.map(x=>x.slug))
 assertSame('industries',industryRoutes.map(x=>x.slug),enIndustries.map(x=>x.slug))
 assertSame('case studies',caseRoutes.map(x=>x.slug),enCaseSummaries.map(x=>x.slug))
 assertSame('blog',blogRoutes.map(x=>x.slug),englishBlogPosts.map(x=>x.slug))
 return [
  ...staticRoutes,
  ...serviceRoutes.flatMap(x=>pair(x.path)),
  ...industryRoutes.flatMap(x=>pair(x.path)),
  ...caseRoutes.flatMap(x=>pair(x.path,{images:x.image?[x.image]:undefined})),
  ...blogRoutes.flatMap(x=>pair(x.path,{images:x.image?[x.image]:undefined,date:x.date?new Date(x.date+'T00:00:00.000Z'):undefined}))
 ]
}
