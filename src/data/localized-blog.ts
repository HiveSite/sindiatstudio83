import { blogPosts } from '@/data/blog'
import { englishBlogBySlug } from '@/data/en-blog'
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

function stripHtml(value:string){
  return value.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()
}
function englishExcerpt(body:string, limit=300){
 const first=(body.match(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i)||[])[1]||body
 const clean=stripHtml(first)
 return clean.length>limit ? clean.slice(0,limit-3).trimEnd()+'...' : clean
}
export const enBlogFullPosts:BlogPost[]=blogPosts.map(post=>{
 const localized=englishBlogBySlug[post.slug]
 if(!localized?.body||!localized.title)throw new Error('Missing authored English article: '+post.slug)
 return {
  ...post,title:localized.title,
  excerpt:englishExcerpt(localized.body,220),
  description:englishExcerpt(localized.body,155),
  coverAlt:'Cover illustration: '+localized.title,
  body:localized.body,
  tags:post.tags.map(tag=>englishTags[tag]||tag)
 }
})
export const enBlogFullBySlug:Record<string,BlogPost>=Object.fromEntries(enBlogFullPosts.map(p=>[p.slug,p]))
