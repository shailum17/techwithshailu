'use client';

/* AI tools CRUD. */

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Card, Flash, IS, Thumb, Tool } from './shared';

/* ═══════════════════════════════════════════════════════════════
   JOBS VIEW — create + list live jobs
   ═══════════════════════════════════════════════════════════════ */
export function ToolsView({ tools, loading, onRefresh }: {
  tools: Tool[]; loading: boolean; onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    name:'',description:'',category:'Coding',url:'',icon_url:'',is_free:true,is_featured:false,
  });
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/tools', { method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form) });
    if (res.ok) {
      setMsg('Tool added'); onRefresh();
      setForm({name:'',description:'',category:'Coding',url:'',icon_url:'',is_free:true,is_featured:false});
    } else {
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) setMsg(`DB Error: ${data.detail ?? 'Supabase insert failed. Check your table schema.'}`);
      else if (res.status === 401) setMsg('Wrong admin key');
      else setMsg(`Failed (${res.status})`);
    }
    setTimeout(() => setMsg(''), 5000);
  }

  async function del(id: string) {
    if (!confirm('Delete this tool?')) return;
    await fetch(`/api/tools/${id}`, { method:'DELETE' });
    onRefresh();
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
      <Card>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15,marginBottom:18 }}>Add New AI Tool</p>
        <Flash msg={msg}/>
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:10 }}>
          <ImageUpload value={form.icon_url} onChange={url=>setForm({...form,icon_url:url})}
            label="Tool Icon" hint="optional" size={50}/>
          {([{k:'name',l:'Tool Name',r:true},{k:'url',l:'Tool URL',r:true}] as {k:string;l:string;r?:boolean}[]).map(({k,l,r})=>(
            <input key={k} type="text" placeholder={l} required={r}
              value={(form as Record<string,string|boolean>)[k] as string}
              onChange={e=>setForm({...form,[k]:e.target.value})} style={IS}/>
          ))}
          <textarea placeholder="One-line description" required rows={2}
            value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
            style={{...IS,resize:'none'}}/>
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={IS}>
            {['Coding','Writing','Image','Productivity','Research'].map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{ display:'flex',gap:24 }}>
            {([{l:'Free tool',k:'is_free',v:form.is_free},{l:'Featured',k:'is_featured',v:form.is_featured}] as {l:string;k:string;v:boolean}[]).map(({l,k,v})=>(
              <label key={k} style={{ display:'flex',alignItems:'center',gap:8,
                                       color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer' }}>
                <input type="checkbox" checked={v}
                  onChange={e=>setForm({...form,[k]:e.target.checked})} className="accent-lime"/>
                {l}
              </label>
            ))}
          </div>
          <button type="submit" disabled={loading} className="btn-lime w-full py-2.5 text-sm" style={{ marginTop:4 }}>
            {loading ? 'Adding…' : 'Add Tool'}
          </button>
        </form>
      </Card>

      <div>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15,marginBottom:16 }}>
          All Tools&nbsp;
          <span style={{ color:'rgba(255,255,255,0.3)',fontWeight:500 }}>({tools.length})</span>
        </p>
        <div style={{ display:'flex',flexDirection:'column',gap:8,maxHeight:700,overflowY:'auto' }}
             className="hide-scrollbar">
          {tools.map(t=>(
            <div key={t.id}
              style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)',
                        borderRadius:12, padding:'13px 16px',
                        display:'flex', justifyContent:'space-between',
                        alignItems:'center', gap:12, transition:'border-color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(168,230,61,0.35)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'}>
              <div style={{ display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0 }}>
                <Thumb src={t.icon_url} fallback={t.name.slice(0,2).toUpperCase()} color="#9B7FE8"/>
                <div style={{ minWidth:0 }}>
                  <p className="text-white" style={{ fontSize:13,fontWeight:600,
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{t.name}</p>
                  <p style={{ color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:2 }}>
                    {t.category} · {t.is_free?'Free':'Paid'}
                  </p>
                  {t.is_featured&&(
                    <span className="text-lime inline-flex items-center gap-1" style={{ fontSize:11,marginTop:3,display:'flex' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <button onClick={()=>del(t.id)}
                style={{ color:'#f87171',background:'none',border:'none',cursor:'pointer',
                          fontSize:12,flexShrink:0,padding:'4px 8px',borderRadius:6 }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(248,113,113,0.1)'}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='none'}>
                Delete
              </button>
            </div>
          ))}
          {tools.length===0&&(
            <div style={{ background:'#0E0E0E',border:'1px solid rgba(255,255,255,0.08)',
                           borderRadius:12,padding:'40px',textAlign:'center' }}>
              <p style={{ color:'rgba(255,255,255,0.3)',fontSize:13 }}>No tools yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
