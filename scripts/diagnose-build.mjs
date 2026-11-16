import fs from 'node:fs'
import {spawnSync} from 'node:child_process'
const commands=[['npm',['run','validate:source']],['npm',['run','validate:seo']],['npm',['run','typecheck']],['npm',['run','build']]]
const results=[]
for(const [command,args] of commands){
 const r=spawnSync(command,args,{encoding:'utf8',maxBuffer:10*1024*1024,timeout:180000,env:{...process.env,CI:'1'}})
 results.push({command:command+' '+args.join(' '),status:r.status,error:r.error?.message,output:((r.stdout||'')+'\n'+(r.stderr||'')).slice(-70000)})
 if(r.status!==0)break
}
fs.mkdirSync('out/diagnostics',{recursive:true})
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
fs.writeFileSync('out/diagnostics/index.html','<!doctype html><html><head><meta name="robots" content="noindex,nofollow"><title>WIP build diagnostics</title></head><body><h1>Preview build diagnostics</h1><pre>'+escape(JSON.stringify(results,null,2))+'</pre></body></html>')
if(!fs.existsSync('out/index.html'))fs.writeFileSync('out/index.html','<!doctype html><html><head><meta name="robots" content="noindex,nofollow"></head><body><a href="/diagnostics/">Preview build diagnostics</a></body></html>')
console.log(results.map(r=>r.command+': '+r.status).join(' | '))
