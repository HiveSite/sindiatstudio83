import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('out')
if (!fs.existsSync(dist)) throw new Error('Missing Next.js static export: out/')
const errors = []
const pages = []
const ignored = new Set(['en','404','comment-picker','studio83-media','team-building','sr-me','_not-found'])
function walk(dir) {
  for (const item of fs.readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,item.name)
    if (item.isDirectory()) {
      if (path.relative(dist,file).split(path.sep).some(segment=>ignored.has(segment))) continue
      walk(file)
    } else if (item.name==='index.html') pages.push(file)
  }
}
walk(dist)
function main(html) {
  const start=html.indexOf('<main')
  if(start<0)return ''
  const contentStart=html.indexOf('>',start)+1
  const end=html.indexOf('</main>',contentStart)
  return html.slice(contentStart,end<0?undefined:end)
}
const occurrences=(html,tag)=>(html.match(new RegExp('<'+tag+'(?=[\\s>])','gi'))||[]).length
function title(html) {
  const match=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  return (match?.[1]||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()
}
const records=[]
for(const file of pages) {
 const relative=path.relative(dist,file)
 const enFile=path.join(dist,'en',relative)
 const route=relative==='index.html'?'/':'/'+relative.replaceAll(path.sep,'/').replace(/index\.html$/,'')
 if(!fs.existsSync(enFile)) {errors.push(route+' missing English page');continue}
 const source=fs.readFileSync(file,'utf8')
 const english=fs.readFileSync(enFile,'utf8')
 const bodySr=main(source),bodyEn=main(english)
 if(!bodySr||!bodyEn){errors.push(route+' missing main landmark');continue}
 if(!/<html[^>]*lang="en"/i.test(english))errors.push(route+' wrong English html lang')
 const counts={}
 for(const tag of ['section','article','h1','h2','h3','form','input','select','textarea','button','details','summary','nav']){
  const sr=occurrences(bodySr,tag),en=occurrences(bodyEn,tag)
  counts[tag]={sr,en}
  if(sr!==en)errors.push(route+' '+tag+' count mismatch: '+sr+' SR / '+en+' EN')
 }
 const srH1=title(bodySr),enH1=title(bodyEn)
 if(srH1&&srH1===enH1&&!/^[A-Z0-9. \-&]+$/.test(srH1))errors.push(route+' untranslated H1: '+srH1)
 const links=s=>(s.match(/<a\b[^>]*href="\/[^"]*"/gi)||[]).length
 const a=links(bodySr),b=links(bodyEn)
 if(a!==b)errors.push(route+' link count mismatch: '+a+' SR / '+b+' EN')
 records.push({route,srH1,enH1,counts,links:{sr:a,en:b}})
}
fs.mkdirSync('reports',{recursive:true})
fs.writeFileSync('reports/strict-parity.json',JSON.stringify({checked:records.length,errors,records},null,2)+'\n')
console.log('Audited '+records.length+' SR/EN pairs; '+errors.length+' differences')
for(const error of errors.slice(0,150))console.error('PARITY ERROR:',error)
if(errors.length)process.exitCode=1
