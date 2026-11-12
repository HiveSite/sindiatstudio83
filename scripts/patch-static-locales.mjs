import fs from 'node:fs'
import path from 'node:path'

// Next.js exports the localized pages through one shared root layout.
// Correct the serialized document language at build time, not only after hydration.
const root=path.join(process.cwd(),'out','en')
if(!fs.existsSync(root))throw new Error('English export directory is missing')
let corrected=0
const walk=(folder)=>{
 for(const ent of fs.readdirSync(folder,{withFileTypes:true})){
  const file=path.join(folder,ent.name)
  if(ent.isDirectory())walk(file)
  else if(ent.isFile()&&ent.name.endsWith('.html')){
   const content=fs.readFileSync(file,'utf8')
   const replaced=content.replace(/<html\b([^>]*?)\blang="sr-Latn-ME"/,'<html$1lang="en"')
   if(content===replaced)throw new Error('Cannot correct HTML language in '+file)
   fs.writeFileSync(file,replaced)
   corrected++
  }
 }
}
walk(root)
if(corrected<10)throw new Error('Too few English static pages were found: '+corrected)
console.log('Fixed HTML lang=en on '+corrected+' exported English pages')
