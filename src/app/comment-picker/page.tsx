'use client';

import { useMemo, useState } from 'react';

type Comment = { id:string; username:string; text:string; timestamp?:string };

function randomIndex(max:number){if(max<=1)return 0;const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%max}

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
        <p style={{color:'#a5a5b0',fontSize:17}}>Zalijepi link Instagram posta, učitaj komentare i izvuci pobjednika.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10,marginTop:18}}>
          <input value={postUrl} onChange={e=>setPostUrl(e.target.value)} placeholder="https://www.instagram.com/p/..." style={input}/>
          <button onClick={load} disabled={loading||!postUrl.trim()} style={button}>{loading?'Učitavanje...':'Load comments'}</button>
        </div>
        {error&&<div style={{marginTop:12,padding:12,border:'1px solid #6d2d2d',borderRadius:12,color:'#ffb6b6'}}>{error}</div>}
        {!!comments.length&&<div style={{marginTop:12,color:'#bdbdc8'}}>{comments.length} komentara · {eligible.length} eligible entries</div>}
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
        <div style={{display:'grid',gap:8,marginTop:14,maxHeight:380,overflow:'auto'}}>{comments.slice(0,250).map(c=><div key={c.id} style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:12,padding:12,border:'1px solid #292932',borderRadius:12,background:'#101014'}}><strong>@{c.username}</strong><span style={{color:'#a5a5b0'}}>{c.text}</span></div>)}</div>
      </section>}
    </div>
  </main>
}

const card:React.CSSProperties={background:'#15151a',border:'1px solid #2c2c34',borderRadius:22,padding:24,boxShadow:'0 20px 50px rgba(0,0,0,.25)'};
const eyebrow:React.CSSProperties={fontSize:11,fontWeight:800,letterSpacing:'.16em',color:'#e995ee'};
const input:React.CSSProperties={minHeight:52,borderRadius:14,border:'1px solid #34343d',background:'#0d0d11',color:'#fff',padding:'0 15px',fontSize:16};
const button:React.CSSProperties={minHeight:52,border:0,borderRadius:14,padding:'0 20px',fontWeight:800,color:'#fff',background:'#2b2b34',cursor:'pointer'};
