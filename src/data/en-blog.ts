import first from './en-blog-part1.json'
import second from './en-blog-part2.json'
import third from './en-blog-part3.json'
import fourth from './en-blog-part4.json'

export type EnglishArticle={slug:string;title:string;body:string}
export const englishBlogPosts:EnglishArticle[]=[...first,...second,...third,...fourth]
export const englishBlogBySlug:Record<string,EnglishArticle>=Object.fromEntries(englishBlogPosts.map((post)=>[post.slug,post]))
export const plainEnglishExcerpt=(post:EnglishArticle)=>{
 const value=post.body.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
 return value.length>185?value.slice(0,182).trimEnd()+'...':value
}
