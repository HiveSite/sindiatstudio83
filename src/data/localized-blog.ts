import { blogPosts } from '@/data/blog'
import enBatch1 from '@/data/blog-en-aligned-01.json'
import enBatch2 from '@/data/blog-en-aligned-02.json'
import enBatch3 from '@/data/blog-en-aligned-03.json'
import type { BlogPost } from '@/types/content'

const englishTags:Record<string,string> = {
  "Crna Gora": "Montenegro",
  "SEO greške": "SEO mistakes",
  "agencije": "agencies",
  "aktivacija": "activation",
  "aktivacije": "activations",
  "barovi": "bars",
  "budžet": "budget",
  "cijena događaja": "event pricing",
  "cilj": "goal",
  "greške": "mistakes",
  "kampanja": "campaign",
  "ključne riječi": "keywords",
  "klubovi": "clubs",
  "konverzija": "conversion",
  "konverzije": "conversions",
  "kreativa": "creative",
  "leadovi": "leads",
  "logistika": "logistics",
  "lokalni biznis": "local business",
  "metrike": "metrics",
  "mjerenje": "measurement",
  "oglasi": "ads",
  "optimizacija": "optimization",
  "organizacija događaja": "event planning",
  "ozvučenje": "sound system",
  "ponuda": "offer",
  "poruka": "messaging",
  "proces": "process",
  "prodaja": "sales",
  "produkcija": "production",
  "protokol": "protocol",
  "rasvjeta": "lighting",
  "recenzije": "reviews",
  "rezervacije": "bookings",
  "rezultat": "result",
  "rezultati": "results",
  "strategija": "strategy",
  "struktura": "structure",
  "upiti": "enquiries",
  "usluge": "services",
  "varijacije": "variations"
}


type AlignedTranslation={slug:string;title:string;segments:string[]}
const aligned:Record<string,AlignedTranslation>=Object.fromEntries(
 ( [...enBatch1,...enBatch2,...enBatch3] as AlignedTranslation[] ).map(post=>[post.slug,post])
)
function translateArticleHtml(html:string,translation:AlignedTranslation):string{
 let index=0
 const result=html.replace(/>([^<>]+)</g,(raw,inner:string)=>{
   if(!inner.trim()||!/[A-Za-zÀ-ž]/.test(inner))return raw
   if(index>=translation.segments.length)throw new Error('Translation too short: '+translation.slug)
   const translated=translation.segments[index++].replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
   const leading=inner.match(/^\s*/)?.[0]||''
   const trailing=inner.match(/\s*$/)?.[0]||''
   return '>'+leading+translated+trailing+'<'
 })
 if(index!==translation.segments.length)throw new Error('Translation count mismatch '+translation.slug+': '+index+'/'+translation.segments.length)
 return result
}
function stripHtml(value:string){
  return value.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()
}
function englishExcerpt(body:string, limit=300){
 const first=(body.match(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i)||[])[1]||body
 const clean=stripHtml(first)
 return clean.length>limit ? clean.slice(0,limit-3).trimEnd()+'...' : clean
}
export const enBlogFullPosts:BlogPost[]=blogPosts.map(post=>{
 const localized=aligned[post.slug]
 if(!localized?.title||!localized.segments.length)throw new Error('Missing full English translation: '+post.slug)
 const body=translateArticleHtml(post.body,localized)
 return {
  ...post,
  title:localized.title,
  excerpt:englishExcerpt(body,220),
  description:englishExcerpt(body,155),
  coverAlt:'Cover illustration: '+localized.title,
  body,
  tags:post.tags.map(tag=>englishTags[tag]||tag)
 }
})
export const enBlogFullBySlug:Record<string,BlogPost>=Object.fromEntries(enBlogFullPosts.map(p=>[p.slug,p]))
