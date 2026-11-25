'use client';

/* Jobs CRUD (all statuses; non-live jobs are flagged). */

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Card, Flash, IS, Job, Thumb, statusBadge } from './shared';

/* ═══════════════════════════════════════════════════════════════
   JOBS VIEW
   ═══════════════════════════════════════════════════════════════ */
export function JobsView({ jobs, loading, onRefresh }: {
  jobs: Job[]; loading: boolean; onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    title:'', company:'', location:'', type:'Internship',
    salary:'', batch_year:'', apply_link:'', deadline:'',
    description:'', is_featured:false, tags:'', logo_url:'', banner_url:'',
  });
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = { ...form,
      batch_year: form.batch_year ? Number(form.batch_year) : undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    const res = await fetch('/api/jobs', { method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body) });
    if (res.ok) {
      setMsg('Job added'); onRefresh();
      setForm({ title:'',company:'',location:'',type:'Internship',salary:'',
                batch_year:'',apply_link:'',deadline:'',description:'',
                is_featured:false,tags:'',logo_url:'',banner_url:'' });
    } else {
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) setMsg(`DB Error: ${data.detail ?? 'Supabase insert failed. Check your table schema.'}`);
      else if (res.status === 401) setMsg('Wrong admin key');
      else setMsg(`Failed (${res.status})`);
    }
    setTimeout(() => setMsg(''), 5000);
  }

  async function del(id: string) {
    if (!confirm('Delete this job?')) return;
    await fetch(`/api/jobs/${id}`, { method:'DELETE' });
    onRefresh();
  }

  async function toggleFeatured(id: string, current: boolean) {
    await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !current }),
    });
    onRefresh();
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* ── Form ── */}
        <Card>
          <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:18 }}>Add New Job</p>
          <Flash msg={msg}/>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <ImageUpload value={form.logo_url} onChange={url=>setForm({...form,logo_url:url})}
              label="Company Logo" hint="shown on card & detail page" size={50}/>
            <ImageUpload value={form.banner_url} onChange={url=>setForm({...form,banner_url:url})}
              label="Banner Image" hint="wide header image on detail page (optional)" size={50}/>
            {([
              {k:'title',      l:'Job Title',             r:true},
              {k:'company',    l:'Company',               r:true},
              {k:'location',   l:'Location',              r:true},
              {k:'batch_year', l:'Batch Year',            tp:'number'},
              {k:'apply_link', l:'Apply Link (URL)',       r:true},
              {k:'deadline',   l:'Deadline',              tp:'date'},
              {k:'tags',       l:'Tags — comma separated'},
            ] as {k:string;l:string;r?:boolean;tp?:string}[]).map(({k,l,r,tp})=>(
              <input key={k} type={tp||'text'} placeholder={l} required={r}
                value={(form as Record<string,string|boolean>)[k] as string}
                onChange={e=>setForm({...form,[k]:e.target.value})} style={IS}/>
            ))}
            {/* Salary — highlighted */}
            <div style={{
              background: 'rgba(155,127,232,0.06)',
              border: '1px solid rgba(155,127,232,0.25)',
              borderRadius: 10, padding: '10px 12px',
            }}>
              <p style={{ color: '#B49EF0', fontSize: 11, fontWeight: 700,
                           letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
                💰 Salary / Stipend
              </p>
              <input type="text" placeholder="e.g. ₹15,000/mo · ₹5L–8L PA · Unpaid"
                value={form.salary}
                onChange={e => setForm({...form, salary: e.target.value})}
                style={{ ...IS, border: form.salary ? '1px solid rgba(155,127,232,0.4)' : '1px solid rgba(155,127,232,0.2)' }}
              />
            </div>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={IS}>
              <option>Internship</option><option>Job</option><option>Full-time</option>
            </select>
            <textarea placeholder="Job description (HTML supported)" required rows={4}
              value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
              style={{...IS,resize:'vertical'}}/>
            <label style={{ display:'flex',alignItems:'center',gap:8,
                             color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer' }}>
              <input type="checkbox" checked={form.is_featured}
                onChange={e=>setForm({...form,is_featured:e.target.checked})} className="accent-lime"/>
              Featured on homepage
            </label>
            <button type="submit" disabled={loading} className="btn-lime w-full py-2.5 text-sm" style={{ marginTop:4 }}>
              {loading ? 'Adding…' : 'Add Job'}
            </button>
          </form>
        </Card>

        {/* ── List ── */}
        <div>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
            <p className="font-poppins font-bold text-white" style={{ fontSize:15 }}>
              All Jobs&nbsp;
              <span style={{ color:'rgba(255,255,255,0.3)',fontWeight:500 }}>({jobs.length})</span>
            </p>
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:8,maxHeight:700,overflowY:'auto' }}
               className="hide-scrollbar">
            {jobs.map(j=>(
              <div key={j.id}
                style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)',
                          borderRadius:12, padding:'13px 16px',
                          display:'flex', justifyContent:'space-between',
                          alignItems:'center', gap:12,
                          transition:'border-color 0.2s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(168,230,61,0.35)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'}>
                <div style={{ display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0 }}>
                  <Thumb src={j.logo_url} fallback={j.company.slice(0,2).toUpperCase()}/>
                  <div style={{ minWidth:0 }}>
                    <p className="text-white" style={{ fontSize:13,fontWeight:600,
                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{j.title}</p>
                    <p style={{ color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:2 }}>
                      {j.company} · {j.location}
                    </p>
                    {j.status && j.status !== 'live' && (() => {
                      // Non-live jobs are hidden on the site; make that obvious here
                      const label = j.status.charAt(0).toUpperCase() + j.status.slice(1);
                      const b = statusBadge(label);
                      return (
                        <span style={{ display:'inline-block', marginTop:3, fontSize:10, fontWeight:700,
                                       padding:'1px 6px', borderRadius:6, background:b.bg, color:b.color, border:b.border }}>
                          {label} · not on site
                        </span>
                      );
                    })()}
                    {j.is_featured&&(
                      <span className="text-lime inline-flex items-center gap-1" style={{ fontSize:11,marginTop:3,display:'flex' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  {/* Feature / Unfeature toggle */}
                  <button
                    onClick={() => toggleFeatured(j.id, !!j.is_featured)}
                    title={j.is_featured ? 'Remove from featured' : 'Add to homepage featured'}
                    style={{
                      background: j.is_featured ? 'rgba(168,230,61,0.12)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${j.is_featured ? 'rgba(168,230,61,0.35)' : 'rgba(255,255,255,0.1)'}`,
                      color: j.is_featured ? '#A8E63D' : 'rgba(255,255,255,0.35)',
                      cursor: 'pointer', borderRadius: 6, padding: '4px 8px',
                      fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,230,61,0.5)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#A8E63D';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = j.is_featured
                        ? 'rgba(168,230,61,0.35)' : 'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLButtonElement).style.color = j.is_featured
                        ? '#A8E63D' : 'rgba(255,255,255,0.35)';
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill={j.is_featured ? 'currentColor' : 'none'}
                         stroke="currentColor" strokeWidth={2}>
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {j.is_featured ? 'Featured' : 'Feature'}
                  </button>
                  <button onClick={()=>del(j.id)}
                    style={{ color:'#f87171',background:'none',border:'none',cursor:'pointer',
                              fontSize:12,flexShrink:0,padding:'4px 8px',borderRadius:6,
                              transition:'background 0.15s' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(248,113,113,0.1)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='none'}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {jobs.length===0&&(
              <div style={{ background:'#0E0E0E',border:'1px solid rgba(255,255,255,0.08)',
                             borderRadius:12,padding:'40px',textAlign:'center' }}>
                <p style={{ color:'rgba(255,255,255,0.3)',fontSize:13 }}>No jobs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
