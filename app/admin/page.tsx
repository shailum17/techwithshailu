'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

/* ── types ──────────────────────────────────────────────────── */
type View = 'dashboard' | 'jobs' | 'tools' | 'roadmaps' | 'blog' |
            'analytics' | 'users' | 'reports' | 'notifications' | 'settings' | 'security';

interface Job {
  _id: string; title: string; company: string; location: string;
  type: string; salary: string; deadline: string;
  is_featured: boolean; status?: string; logo_url?: string;
}
interface Tool {
  _id: string; name: string; category: string; url: string;
  is_free: boolean; is_featured: boolean; icon_url?: string;
}

/* ── shared input style — matches site inputs ───────────────── */
const IS: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '10px 13px',
  color: '#F0F0F0',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'var(--font-outfit)',
};

/* ── dashboard data ─────────────────────────────────────────── */
const STATS = [
  { label: 'Total jobs',        value: '128', delta: '+12 this week', color: '#A8E63D' },
  { label: 'AI tools listed',   value: '47',  delta: '+5 this week',  color: '#9B7FE8' },
  { label: 'Registered users',  value: '2,341', delta: '+89 today',   color: '#22D3EE' },
  { label: 'Daily visitors',    value: '1,082', delta: '+18% vs yesterday', color: '#F59E0B' },
];
const RECENT_JOBS = [
  { title: 'Software Engineering Intern', company: 'Google',   type: 'Remote', stipend: '₹80K/mo', status: 'Live',    deadline: 'Jul 30' },
  { title: 'SDE Intern',                  company: 'Amazon',   type: 'Remote', stipend: '₹70K/mo', status: 'Live',    deadline: 'Aug 5'  },
  { title: 'Backend Developer Intern',    company: 'LinkedIn', type: 'Hybrid', stipend: '₹90K/mo', status: 'Draft',   deadline: 'Aug 12' },
  { title: 'Ninja Intern',                company: 'TCS',      type: 'Remote', stipend: '₹40K/mo', status: 'Expired', deadline: 'Jul 10' },
];
const ACTIVITY = [
  { dot: '#A8E63D', text: 'New job added — Microsoft SWE Intern',  time: '2 mins ago'  },
  { dot: '#9B7FE8', text: 'Tool submitted — Perplexity AI',         time: '18 mins ago' },
  { dot: '#F59E0B', text: 'User report — broken apply link',        time: '1 hr ago'    },
  { dot: '#A8E63D', text: 'Blog published — DSA tips 2026',         time: '3 hrs ago'   },
  { dot: '#22D3EE', text: 'Roadmap updated — Frontend path',        time: '5 hrs ago'   },
];
const TRAFFIC = [
  { label: 'Jobs',     pct: 72, color: '#60A5FA' },
  { label: 'AI Tools', pct: 54, color: '#A8E63D' },
  { label: 'Roadmaps', pct: 38, color: '#F59E0B' },
  { label: 'Blog',     pct: 22, color: '#F87171' },
  { label: 'Homepage', pct: 14, color: 'rgba(255,255,255,0.15)' },
];

function statusBadge(s = '') {
  if (s === 'Live')    return { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)'  };
  if (s === 'Draft')   return { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)'  };
  if (s === 'Expired') return { bg: 'rgba(248,113,113,0.12)',color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' };
  return { bg: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' };
}

/* ── reusable pieces ────────────────────────────────────────── */
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}
    style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
               textTransform: 'uppercase', marginBottom: 10 }}>
    {children}
  </p>
);

const Flash: React.FC<{ msg: string }> = ({ msg }) => msg ? (
  <div style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.25)',
                color: '#A8E63D', borderRadius: 10, padding: '10px 13px', fontSize: 12, marginBottom: 14 }}>
    {msg}
  </div>
) : null;

function Thumb({ src, fallback, color = '#A8E63D' }: { src?: string; fallback: string; color?: string }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                   border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0,
                   display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }}
               onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        : <span style={{ color, fontSize: 11, fontWeight: 700 }}>{fallback}</span>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN — matches site card style
   ═══════════════════════════════════════════════════════════════ */
function LoginScreen({ onAuth }: { onAuth: (k: string) => void }) {
  const [key, setKey] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center pt-16"
         style={{ background: '#0A0A0A' }}>
      {/* ambient glow — same as hero */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(168,230,61,0.06),transparent 70%)',
        }}/>
      </div>

      <div className="w-full max-w-sm mx-4"
           style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20, padding: '40px 36px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="font-poppins font-bold text-lg text-lime">techwithshailu</span>
          <span style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.25)',
                          color: '#A8E63D', fontSize: 10, padding: '2px 8px', borderRadius: 20,
                          fontWeight: 700, letterSpacing: '0.06em' }}>
            ADMIN
          </span>
        </div>
        <h2 className="font-poppins font-bold text-white mb-1.5" style={{ fontSize: 22 }}>
          Welcome back
        </h2>
        <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Enter your admin key to access the dashboard.
        </p>
        <form onSubmit={e => { e.preventDefault(); onAuth(key); }}>
          <input type="password" placeholder="Admin secret key" value={key}
            onChange={e => setKey(e.target.value)}
            style={{ ...IS, marginBottom: 12 }} required />
          <button type="submit" className="btn-lime w-full py-3 text-sm">
            Access Panel
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
   ═══════════════════════════════════════════════════════════════ */
function DashboardView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stat cards — 4 col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {STATS.map(s => (
          <div key={s.label}
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)',
                     borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                           borderRadius: '50%', pointerEvents: 'none',
                           background: `radial-gradient(circle,${s.color}18,transparent 70%)`,
                           transform: 'translate(20px,-20px)' }}/>
            <div style={{ width: 30, height: 30, borderRadius: 8, marginBottom: 14,
                           background: `${s.color}18`, border: `1px solid ${s.color}30`,
                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: s.color, opacity: 0.9 }}/>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 4 }}>{s.label}</p>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 26, lineHeight: 1, marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ color: s.color, fontSize: 11, fontWeight: 600 }}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Recent jobs table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <p className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>Recent job listings</p>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '5px 14px',
                            fontSize: 12, cursor: 'pointer' }}>
            View all
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Job title','Company','Type','Stipend','Status','Deadline',''].map((h,i)=>(
                <th key={i} style={{ textAlign:'left', color:'rgba(255,255,255,0.3)', fontSize:11,
                                      fontWeight:600, padding:'0 12px 12px',
                                      letterSpacing:'0.08em', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_JOBS.map((j,i)=>{
              const s = statusBadge(j.status);
              return (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '13px 12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:28, height:28, borderRadius:6,
                                     background:'rgba(168,230,61,0.1)',
                                     border:'1px solid rgba(168,230,61,0.2)',
                                     display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span className="font-poppins font-bold text-lime" style={{ fontSize:9 }}>
                          {j.company.slice(0,2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white" style={{ fontSize:13, fontWeight:500 }}>{j.title}</span>
                    </div>
                  </td>
                  <td style={{ padding:'13px 12px', color:'rgba(255,255,255,0.5)', fontSize:13 }}>{j.company}</td>
                  <td style={{ padding:'13px 12px' }}>
                    <span style={{ background:'rgba(168,230,61,0.12)', color:'#A8E63D',
                                    border:'1px solid rgba(168,230,61,0.25)',
                                    borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600 }}>
                      {j.type}
                    </span>
                  </td>
                  <td style={{ padding:'13px 12px', color:'rgba(255,255,255,0.7)', fontSize:13 }}>{j.stipend}</td>
                  <td style={{ padding:'13px 12px' }}>
                    <span style={{ background:s.bg, color:s.color, border:s.border,
                                    borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600 }}>
                      {j.status}
                    </span>
                  </td>
                  <td style={{ padding:'13px 12px', color:'rgba(255,255,255,0.3)', fontSize:13 }}>{j.deadline}</td>
                  <td style={{ padding:'13px 12px' }}>
                    <button style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                                      borderRadius:6, width:28, height:28, cursor:'pointer',
                                      color:'rgba(255,255,255,0.4)' }}>⋯</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Activity */}
        <Card>
          <p className="font-poppins font-bold text-white" style={{ fontSize:14, marginBottom:16 }}>
            Recent activity
          </p>
          {ACTIVITY.map((a,i)=>(
            <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 0',
                                   borderBottom: i < ACTIVITY.length-1
                                     ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:a.dot,
                              flexShrink:0, marginTop:4 }}/>
              <div>
                <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>{a.text}</p>
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:2 }}>{a.time}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Traffic */}
        <Card>
          <p className="font-poppins font-bold text-white" style={{ fontSize:14, marginBottom:16 }}>
            Traffic by section
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {TRAFFIC.map(t=>(
              <div key={t.label} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13, width:78, flexShrink:0 }}>{t.label}</span>
                <div style={{ flex:1, background:'rgba(255,255,255,0.05)', borderRadius:4, height:6 }}>
                  <div style={{ width:`${t.pct}%`, background:t.color, borderRadius:4, height:'100%',
                                 transition:'width 1s ease' }}/>
                </div>
                <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12, width:34, textAlign:'right' }}>{t.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   JOBS VIEW
   ═══════════════════════════════════════════════════════════════ */
function JobsView({ jobs, loading, adminKey, onRefresh }: {
  jobs: Job[]; loading: boolean; adminKey: string; onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    title:'', company:'', location:'', type:'Internship',
    salary:'', batch_year:'', apply_link:'', deadline:'',
    description:'', is_featured:false, tags:'', logo_url:'',
  });
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = { ...form,
      batch_year: form.batch_year ? Number(form.batch_year) : undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    const res = await fetch('/api/jobs', { method:'POST',
      headers:{'Content-Type':'application/json','x-admin-key':adminKey},
      body: JSON.stringify(body) });
    if (res.ok) {
      setMsg('Job added ✓'); onRefresh();
      setForm({ title:'',company:'',location:'',type:'Internship',salary:'',
                batch_year:'',apply_link:'',deadline:'',description:'',
                is_featured:false,tags:'',logo_url:'' });
    } else setMsg('Failed — check key');
    setTimeout(() => setMsg(''), 3000);
  }

  async function del(id: string) {
    if (!confirm('Delete this job?')) return;
    await fetch(`/api/jobs/${id}`, { method:'DELETE', headers:{'x-admin-key':adminKey} });
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
              label="Company Logo" hint="optional" size={50}/>
            {([
              {k:'title',      l:'Job Title',             r:true},
              {k:'company',    l:'Company',               r:true},
              {k:'location',   l:'Location',              r:true},
              {k:'salary',     l:'Salary / Stipend'},
              {k:'batch_year', l:'Batch Year',            tp:'number'},
              {k:'apply_link', l:'Apply Link (URL)',       r:true},
              {k:'deadline',   l:'Deadline',              tp:'date'},
              {k:'tags',       l:'Tags — comma separated'},
            ] as {k:string;l:string;r?:boolean;tp?:string}[]).map(({k,l,r,tp})=>(
              <input key={k} type={tp||'text'} placeholder={l} required={r}
                value={(form as Record<string,string|boolean>)[k] as string}
                onChange={e=>setForm({...form,[k]:e.target.value})} style={IS}/>
            ))}
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
              <div key={j._id}
                style={{ background:'#111111', border:'1px solid rgba(255,255,255,0.08)',
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
                    {j.is_featured&&(
                      <span className="text-lime" style={{ fontSize:11,marginTop:3,display:'block' }}>★ Featured</span>
                    )}
                  </div>
                </div>
                <button onClick={()=>del(j._id)}
                  style={{ color:'#f87171',background:'none',border:'none',cursor:'pointer',
                            fontSize:12,flexShrink:0,padding:'4px 8px',borderRadius:6,
                            transition:'background 0.15s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(248,113,113,0.1)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='none'}>
                  Delete
                </button>
              </div>
            ))}
            {jobs.length===0&&(
              <div style={{ background:'#111111',border:'1px solid rgba(255,255,255,0.08)',
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

/* ═══════════════════════════════════════════════════════════════
   TOOLS VIEW
   ═══════════════════════════════════════════════════════════════ */
function ToolsView({ tools, loading, adminKey, onRefresh }: {
  tools: Tool[]; loading: boolean; adminKey: string; onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    name:'',description:'',category:'Coding',url:'',icon_url:'',is_free:true,is_featured:false,
  });
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/tools', { method:'POST',
      headers:{'Content-Type':'application/json','x-admin-key':adminKey},
      body: JSON.stringify(form) });
    if (res.ok) {
      setMsg('Tool added ✓'); onRefresh();
      setForm({name:'',description:'',category:'Coding',url:'',icon_url:'',is_free:true,is_featured:false});
    } else setMsg('Failed — check key');
    setTimeout(() => setMsg(''), 3000);
  }

  async function del(id: string) {
    if (!confirm('Delete this tool?')) return;
    await fetch(`/api/tools/${id}`, { method:'DELETE', headers:{'x-admin-key':adminKey} });
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
            <div key={t._id}
              style={{ background:'#111111', border:'1px solid rgba(255,255,255,0.08)',
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
                    <span className="text-lime" style={{ fontSize:11,marginTop:3,display:'block' }}>★ Featured</span>
                  )}
                </div>
              </div>
              <button onClick={()=>del(t._id)}
                style={{ color:'#f87171',background:'none',border:'none',cursor:'pointer',
                          fontSize:12,flexShrink:0,padding:'4px 8px',borderRadius:6 }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(248,113,113,0.1)'}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='none'}>
                Delete
              </button>
            </div>
          ))}
          {tools.length===0&&(
            <div style={{ background:'#111111',border:'1px solid rgba(255,255,255,0.08)',
                           borderRadius:12,padding:'40px',textAlign:'center' }}>
              <p style={{ color:'rgba(255,255,255,0.3)',fontSize:13 }}>No tools yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── placeholder ─────────────────────────────────────────────── */
function PlaceholderView({ title }: { title: string }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:380 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:56,height:56,borderRadius:14,
                       background:'rgba(168,230,61,0.08)',
                       border:'1px solid rgba(168,230,61,0.2)',
                       display:'flex',alignItems:'center',justifyContent:'center',
                       margin:'0 auto 16px' }}>
          <span className="text-lime" style={{ fontSize:22 }}>⊞</span>
        </div>
        <p className="font-poppins font-bold text-white" style={{ fontSize:18 }}>{title}</p>
        <p style={{ color:'rgba(255,255,255,0.3)',fontSize:13,marginTop:6 }}>This section is coming soon.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE — left sidebar + content area
   ═══════════════════════════════════════════════════════════════ */

const NAV_GROUPS = [
  { section: 'OVERVIEW', tabs: [
    { id: 'dashboard', label: 'Dashboard',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: 'analytics',  label: 'Analytics',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ]},
  { section: 'CONTENT', tabs: [
    { id: 'jobs',     label: 'Jobs',      badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
    { id: 'tools',    label: 'AI Tools',  badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
    { id: 'roadmaps', label: 'Roadmaps',  badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/></svg> },
    { id: 'blog',     label: 'Blog',      badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ]},
  { section: 'USERS', tabs: [
    { id: 'users',   label: 'Users',   badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { id: 'reports', label: 'Reports', badge: 3,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  ]},
  { section: 'SYSTEM', tabs: [
    { id: 'settings', label: 'Settings', badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
    { id: 'security', label: 'Security', badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  ]},
] as const;

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [view,     setView]     = useState<View>('dashboard');
  const [jobs,     setJobs]     = useState<Job[]>([]);
  const [tools,    setTools]    = useState<Tool[]>([]);
  const [loading,  setLoading]  = useState(false);

  async function fetchData() {
    setLoading(true);
    const [jr, tr] = await Promise.all([fetch('/api/jobs'), fetch('/api/tools')]);
    setJobs(await jr.json());
    setTools(await tr.json());
    setLoading(false);
  }

  function handleAuth(k: string) { setAdminKey(k); setAuthed(true); fetchData(); }

  if (!authed) return <LoginScreen onAuth={handleAuth} />;

  const titles: Record<View, string> = {
    dashboard:'Dashboard', analytics:'Analytics', jobs:'Jobs',
    tools:'AI Tools', roadmaps:'Roadmaps', blog:'Blog', users:'Users',
    reports:'Reports', notifications:'Notifications', settings:'Settings', security:'Security',
  };
  const subtitles: Partial<Record<View, string>> = {
    dashboard: 'Overview of your platform activity.',
    jobs:      'Manage job listings and internships.',
    tools:     'Manage the AI tools directory.',
  };

  function renderView() {
    if (view === 'dashboard') return <DashboardView />;
    if (view === 'jobs')      return <JobsView  jobs={jobs}  loading={loading} adminKey={adminKey} onRefresh={fetchData} />;
    if (view === 'tools')     return <ToolsView tools={tools} loading={loading} adminKey={adminKey} onRefresh={fetchData} />;
    return <PlaceholderView title={titles[view]} />;
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0A0A0A', fontFamily:'var(--font-outfit)' }}>

      {/* ══════════════════════════════════════════════════════
          FLOATING SIDEBAR — gap from edges, rounded card
          ══════════════════════════════════════════════════════ */}
      <aside style={{
        width: 256, flexShrink: 0,
        padding: '16px 0 16px 16px',   /* gap on left + top/bottom, no gap on right */
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }} className="hide-scrollbar">

        {/* The floating card itself */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>

          {/* ── Brand ─────────────────────────────────────── */}
          <div style={{
            padding: '20px 18px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p className="font-poppins font-bold text-lime" style={{ fontSize: 16, marginBottom: 8 }}>
              techwithshailu
            </p>
            <span style={{
              background: 'rgba(168,230,61,0.1)',
              border: '1px solid rgba(168,230,61,0.25)',
              color: '#A8E63D', fontSize: 10,
              padding: '3px 10px', borderRadius: 20,
              fontWeight: 700, letterSpacing: '0.07em',
            }}>
              ADMIN PANEL
            </span>
          </div>

          {/* ── Nav ───────────────────────────────────────── */}
          <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }} className="hide-scrollbar">
            {NAV_GROUPS.map(group => (
              <div key={group.section} style={{ marginBottom: 2 }}>

                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '10px 18px 4px',
                  color: 'rgba(255,255,255,0.22)',
                }}>
                  {group.section}
                </p>

                {(group.tabs as ReadonlyArray<{id:string;label:string;badge?:number;icon:React.ReactNode}>).map(tab => {
                  const active = view === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setView(tab.id as View)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 8,
                        padding: '9px 18px', border: 'none', cursor: 'pointer',
                        background: active ? 'rgba(168,230,61,0.09)' : 'transparent',
                        borderLeft: `3px solid ${active ? '#A8E63D' : 'transparent'}`,
                        transition: 'all 0.15s', textAlign: 'left',
                        fontFamily: 'var(--font-outfit)',
                      }}
                      onMouseEnter={e => {
                        if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                      }}
                      onMouseLeave={e => {
                        if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}>

                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        color: active ? '#A8E63D' : 'rgba(255,255,255,0.55)',
                        fontSize: 13, fontWeight: active ? 600 : 400,
                        transition: 'color 0.15s',
                      }}>
                        <span style={{ opacity: active ? 1 : 0.6, lineHeight: 0, flexShrink: 0 }}>
                          {tab.icon}
                        </span>
                        {tab.label}
                      </span>

                      {(tab.badge ?? 0) > 0 && (
                        <span style={{
                          background: 'rgba(248,113,113,0.15)', color: '#f87171',
                          border: '1px solid rgba(248,113,113,0.3)',
                          fontSize: 10, fontWeight: 700,
                          borderRadius: 20, padding: '1px 7px', flexShrink: 0,
                        }}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* ── Logout ────────────────────────────────────── */}
          <div style={{ padding: '10px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => { setAuthed(false); setAdminKey(''); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)', fontSize: 13,
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-outfit)',
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.color = '#A8E63D';
                b.style.borderColor = 'rgba(168,230,61,0.3)';
                b.style.background = 'rgba(168,230,61,0.06)';
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.color = 'rgba(255,255,255,0.4)';
                b.style.borderColor = 'rgba(255,255,255,0.08)';
                b.style.background = 'rgba(255,255,255,0.03)';
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN COLUMN
          ════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: '16px 16px 16px 8px' }}>

        {/* Sticky top bar — page title + actions */}
        <header style={{
          position: 'sticky', top: 16, zIndex: 10,
          background: 'rgba(17,17,17,0.95)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', height: 58,
          marginBottom: 20,
          boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
        }}>
          <div>
            <h1 className="font-poppins font-bold text-white" style={{ fontSize: 18 }}>
              {titles[view]}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {view === 'jobs' && (
              <>
                <button style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '6px 14px',
                  fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Export
                </button>
                <button className="btn-lime text-xs py-2 px-4">+ Add Job</button>
              </>
            )}
            {view === 'tools' && (
              <button className="btn-lime text-xs py-2 px-4">+ Add Tool</button>
            )}
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(168,230,61,0.1)', border: '2px solid rgba(168,230,61,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#A8E63D', fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-poppins)',
            }}>
              AS
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }} className="hide-scrollbar">
          {/* Page subtitle */}
          {subtitles[view] && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>
              {subtitles[view]}
            </p>
          )}
          {renderView()}
        </main>
      </div>
    </div>
  );
}
