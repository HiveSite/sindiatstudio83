'use client';

import { useMemo, useState } from 'react';

type Comment = { id:string; username:string; text:string; timestamp?:string };

function randomIndex(max:number){if(max<=1)return 0;const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%max}

function parseCsv(text:string):Comment[]{
  const rows:string[][]=[];let row:string[]=[];let cell='';let quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){
      if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;
    }else if(ch===','&&!quoted){row.push(cell);cell='';}
    else if((ch==='\n'||ch==='\r')&&!quoted){
      if(ch==='\r'&&text[i+1]==='\n')i++;
      row.push(cell);cell='';if(row.some(v=>v.trim()))rows.push(row);row=[];
    }else cell+=ch;
  }
  row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
  if(!rows.length)return [];
  const header=rows[0].map(v=>v.trim().toLowerCase());
  const uIndex=Math.max(0,header.findIndex(v=>['username','user','handle','account'].includes(v)));
  const tFound=header.findIndex(v=>['comment','text','comment_text','content'].includes(v));
  const tIndex=tFound>=0?tFound:Math.min(1,rows[0].length-1);
  const start=header.some(v=>['username','user','handle','account','comment','text','comment_text','content'].includes(v))?1:0;
  return rows.slice(start).map((r,i)=>({id:`csv-${i}-${(r[uIndex]||'').trim()}` ,username:(r[uIndex]||'').trim().replace(/^@/,''),text:(r[tIndex]||'').trim()})).filter(c=>c.username);
}

const exporterCode=`javascript:(async()=>{const sleep=m=>new Promise(r=>setTimeout(r,m));const found=new Map();const norm=s=>(s||'').replace(/\\s+/g,' ').trim();const collect=()=>{document.querySelectorAll('ul li').forEach(li=>{const links=[...li.querySelectorAll('a[href]')];const a=links.find(x=>/^\\/[A-Za-z0-9._]+\\/?$/.test(x.getAttribute('href')||''));if(!a)return;const user=(a.getAttribute('href')||'').replaceAll('/','');if(!user||['explore','accounts','direct','reels'].includes(user))return;let txt=norm(li.innerText);if(!txt)return;txt=txt.replace(new RegExp('^'+user.replace(/[.*+?^\\${}()|[\\]\\\\]/g,'\\\\$&')+'\\\\s*'),'').trim();txt=txt.replace(/\\b(Reply|Like|See translation|Odgovori|Sviđa mi se)\\b.*$/i,'').trim();if(txt&&txt!==user)found.set(user+'\\n'+txt,{username:user,comment:txt});});};let stable=0,last=0;for(let round=0;round<300;round++){collect();const buttons=[...document.querySelectorAll('button,div[role=button]')];let clicked=false;for(const b of buttons){const t=norm(b.textContent).toLowerCase();if(t.includes('more comments')||t.includes('view all')||t.includes('load more')||t.includes('prikaži još')||t.includes('jos komentara')||t.includes('još komentara')){try{b.click();clicked=true;}catch{}}}const dialog=document.querySelector('div[role=dialog]');if(dialog){dialog.scrollTop=dialog.scrollHeight;}window.scrollTo(0,document.body.scrollHeight);await sleep(clicked?850:650);collect();if(found.size===last)stable++;else stable=0;last=found.size;if(stable>=10)break;}const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';const csv='username,comment\\n'+[...found.values()].map(x=>esc(x.username)+','+esc(x.comment)).join('\\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='instagram-comments.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);alert('Exportovano '+found.size+' komentara.');})();`;

export default function CommentPickerPage(){
  const [postUrl,setPostUrl]=useState('');
  const [comments,setComments]=useState<Comment[]>([]);
  const [loading,setLoading]=useState(false);
  const [drawing,setDrawing]=useState(false);
  const [winner,setWinner]=useState<Comment|null>(null);
  const [rolling,setRolling]=useState<Comment|null>(null);
  const [error,setError]=useState('');
  const [uniqueOnly,setUniqueOnly]=useState(true);
  const [previous,setPrevious]=useState<string[]>([]);
  const [copied,setCopied]=useState(false);

  const eligible=useMemo(()=>{
    let list=[...comments];
    if(uniqueOnly){const seen=new Set<string>();list=list.filter(c=>{const k=c.username.toLowerCase();if(seen.has(k))return false;seen.add(k);return true})}
    return list.filter(c=>!previous.includes(c.id));
  },[comments,uniqueOnly,previous]);

  async function load(){
    setLoading(true);setError('');setComments([]);setWinner(null);setRolling(null);setPrevious([]);
    try{
      const r=await fetch('/comment-picker/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl})});
      const d=await r.json();if(!r.ok)throw new Error(d.error||'Nije moguće učitati komentare.');
      setComments(Array.isArray(d.comments)?d.comments:[]);
    }catch(e){setError(e instanceof Error?e.message:'Greška pri učitavanju.')}finally{setLoading(false)}
  }

  async function importCsv(file:File){
    setError('');setWinner(null);setRolling(null);setPrevious([]);
    try{const list=parseCsv(await file.text());if(!list.length)throw new Error('CSV nema prepoznatljive username/comment podatke.');setComments(list);}catch(e){setError(e instanceof Error?e.message:'CSV nije moguće učitati.');}
  }

  async function copyExporter(){await navigator.clipboard.writeText(exporterCode);setCopied(true);setTimeout(()=>setCopied(false),1800)}

  async function draw(){
    if(!eligible.length||drawing)return;setDrawing(true);setWinner(null);
    const finalWinner=eligible[randomIndex(eligible.length)];const started=performance.now();
    await new Promise<void>(resolve=>{const t=window.setInterval(()=>{setRolling(eligible[randomIndex(eligible.length)]);if(performance.now()-started>3000){clearInterval(t);resolve()}},70)});
    setRolling(finalWinner);setWinner(finalWinner);setPrevious(p=>[...p,finalWinner.id]);setDrawing(false);
  }

  return <main style={{minHeight:'100vh',background:'#09090b',color:'#fff',padding:'32px 16px',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <div style={{maxWidth:980,margin:'0 auto',display:'grid',gap:16}}>
      <section style={card}>
        <div style={eyebrow}>SINDIKAT STUDIO 83 · INSTAGRAM TOOL</div>
        <h1 style={{fontSize:'clamp(42px,8vw,82px)',lineHeight:.95,margin:'10px 0 18px',letterSpacing:'-0.05em'}}>Random Comment Picker</h1>
        <p style={{color:'#a5a5b0',fontSize:17}}>Bez API-ja: eksportuj komentare iz Instagram browsera u CSV, pa ubaci CSV ovdje.</p>
      </section>

      <section style={card}>
        <div style={eyebrow}>1 · EXPORT SA INSTAGRAMA</div>
        <h2 style={{margin:'10px 0'}}>Browser exporter</h2>
        <p style={{color:'#bdbdc8',lineHeight:1.6}}>Klikni <b>Copy exporter</b>, napravi novi bookmark u Chrome-u i u polje URL zalijepi kopirani kod. Zatim otvori giveaway post na instagram.com dok si ulogovan i klikni taj bookmark. Alat će učitavati dostupne komentare i skinuti <b>instagram-comments.csv</b>.</p>
        <button onClick={copyExporter} style={{...button,background:'#02C9BF',color:'#061313'}}>{copied?'Kopirano ✓':'Copy exporter'}</button>
        <div style={{marginTop:12,fontSize:13,color:'#8f8f9a'}}>Instagram može usporiti ili zaustaviti učitavanje kod veoma velikih postova; exporter ne koristi tvoju lozinku niti API token.</div>
      </section>

      <section style={card}>
        <div style={eyebrow}>2 · UBACI CSV</div>
        <label style={{display:'block',marginTop:12,padding:22,border:'1px dashed #454552',borderRadius:16,cursor:'pointer',textAlign:'center',background:'#0f0f13'}}>
          <b>Izaberi instagram-comments.csv</b><br/><span style={{fontSize:13,color:'#92929d'}}>podržava i CSV iz drugih exportera ako ima username + comment kolone</span>
          <input type="file" accept=".csv,text/csv" onChange={e=>{const f=e.target.files?.[0];if(f)importCsv(f)}} style={{display:'none'}}/>
        </label>
        {!!comments.length&&<div style={{marginTop:12,color:'#bdbdc8'}}><b>{comments.length}</b> komentara učitano · <b>{eligible.length}</b> eligible entries</div>}
        {error&&<div style={{marginTop:12,padding:12,border:'1px solid #6d2d2d',borderRadius:12,color:'#ffb6b6'}}>{error}</div>}
      </section>

      <section style={card}>
        <div style={eyebrow}>OPCIONALNO · API</div>
        <p style={{color:'#a5a5b0'}}>Ako kasnije dodaš Meta token, možeš učitati komentare direktno linkom:</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10,marginTop:12}}>
          <input value={postUrl} onChange={e=>setPostUrl(e.target.value)} placeholder="https://www.instagram.com/p/..." style={input}/>
          <button onClick={load} disabled={loading||!postUrl.trim()} style={button}>{loading?'Učitavanje...':'Load comments'}</button>
        </div>
      </section>

      <section style={card}>
        <label style={{display:'flex',gap:10,alignItems:'center'}}><input type="checkbox" checked={uniqueOnly} onChange={e=>setUniqueOnly(e.target.checked)}/> Jedan entry po username-u</label>
      </section>

      <section style={card}>
        <div style={{minHeight:320,border:'1px solid #33333c',borderRadius:18,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:24,background:'radial-gradient(circle at 50% 40%,rgba(191,2,201,.15),transparent 45%),#0e0e12'}}>
          <div style={eyebrow}>{winner?'WINNER':drawing?'DRAWING...':'READY'}</div>
          <div style={{fontSize:'clamp(48px,9vw,96px)',fontWeight:900,letterSpacing:'-0.06em',margin:'12px 0',wordBreak:'break-word'}}>{rolling?'@'+rolling.username:'@username'}</div>
          <div style={{color:'#a5a5b0',maxWidth:720,lineHeight:1.5}}>{rolling?.text||'Komentar pobjednika će se pojaviti ovdje.'}</div>
        </div>
        <button onClick={draw} disabled={!eligible.length||drawing} style={{...button,width:'100%',marginTop:12,background:'#BF02C9'}}>{drawing?'Drawing...':winner?'Draw again':'Start draw'}</button>
      </section>

      {!!comments.length&&<section style={card}>
        <div style={eyebrow}>COMMENTS</div>
        <div style={{display:'grid',gap:8,marginTop:14,maxHeight:380,overflow:'auto'}}>{comments.slice(0,500).map(c=><div key={c.id} style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:12,padding:12,border:'1px solid #292932',borderRadius:12,background:'#101014'}}><strong>@{c.username}</strong><span style={{color:'#a5a5b0'}}>{c.text}</span></div>)}</div>
      </section>}
    </div>
  </main>
}

const card:React.CSSProperties={background:'#15151a',border:'1px solid #2c2c34',borderRadius:22,padding:24,boxShadow:'0 20px 50px rgba(0,0,0,.25)'};
const eyebrow:React.CSSProperties={fontSize:11,fontWeight:800,letterSpacing:'.16em',color:'#e995ee'};
const input:React.CSSProperties={minHeight:52,borderRadius:14,border:'1px solid #34343d',background:'#0d0d11',color:'#fff',padding:'0 15px',fontSize:16};
const button:React.CSSProperties={minHeight:52,border:0,borderRadius:14,padding:'0 20px',fontWeight:800,color:'#fff',background:'#2b2b34',cursor:'pointer'};
