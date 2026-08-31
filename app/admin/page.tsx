'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

/* ── types ──────────────────────────────────────────────────── */
type View = 'dashboard' | 'jobs' | 'pending' | 'automation' | 'tools' | 'roadmaps' | 'blog' |
            'analytics' | 'users' | 'reports' | 'notifications' | 'settings' | 'security' | 'database';

interface Job {
  id: string; title: string; company: string; location: string;
  type: string; salary: string; deadline: string;
  is_featured: boolean; status?: string; logo_url?: string; banner_url?: string;
}
interface Tool {
  id: string; name: string; category: string; url: string;
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

/* ── dashboard data — replaced with empty state (real data comes from DB) ── */
const STATS: { label: string; value: string; delta: string; color: string }[] = [];
const RECENT_JOBS: { title: string; company: string; type: string; stipend: string; status: string; deadline: string }[] = [];
const ACTIVITY: { dot: string; text: string; time: string }[] = [];
const TRAFFIC: { label: string; pct: number; color: string }[] = [];

function statusBadge(s = '') {
  if (s === 'Live')    return { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)'  };
  if (s === 'Draft')   return { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)'  };
  if (s === 'Expired') return { bg: 'rgba(248,113,113,0.12)',color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' };
  return { bg: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' };
}

/* ── reusable pieces ────────────────────────────────────────── */
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}
    style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
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
         style={{ background: '#080808' }}>
      {/* ambient glow — same as hero */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(168,230,61,0.06),transparent 70%)',
        }}/>
      </div>

      <div className="w-full max-w-sm mx-4"
           style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
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
function DashboardView({ pendingCount, onGoToPending }: { pendingCount: number; onGoToPending: () => void }) {
  const [dbStatus, setDbStatus] = useState<'checking'|'ok'|'error'>('checking');
  const [dbMsg, setDbMsg] = useState('');

  useEffect(() => {
    fetch('/api/db-check')
      .then(r => r.json())
      .then(d => { setDbStatus(d.ok ? 'ok' : 'error'); setDbMsg(d.message ?? ''); })
      .catch(() => { setDbStatus('error'); setDbMsg('Cannot reach server'); });
  }, []);

  const dbColour = dbStatus === 'ok' ? '#4ade80' : dbStatus === 'error' ? '#f87171' : '#F59E0B';
  const dbLabel  = dbStatus === 'ok' ? 'Supabase Connected' : dbStatus === 'error' ? 'Supabase Disconnected' : 'Checking…';
  void dbColour; void dbLabel; // used in top bar via prop drilling — declared here for DRY

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* DB status banner — shown only when disconnected */}
      {dbStatus === 'error' && (
        <div style={{
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ color: '#f87171', fontSize: 18, flexShrink: 0 }}>!</span>
          <div>
            <p style={{ color: '#f87171', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
              Supabase is unreachable
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.6 }}>
              {dbMsg && <span style={{ fontFamily: 'monospace', color: '#f87171' }}>{dbMsg}</span>}
              <br/>
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Fix:</strong> Check your{' '}
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
                style={{ color: '#A8E63D', textDecoration: 'underline' }}>
                Supabase dashboard
              </a>{' '}
              → Settings → API → verify env vars in .env.local
            </p>
          </div>
        </div>
      )}

      {/* Pending jobs call-to-action — shown when there are jobs waiting */}
      {pendingCount > 0 && (
        <button onClick={onGoToPending} style={{
          width: '100%', textAlign: 'left',
          background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.3)',
          borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,146,60,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(251,146,60,0.06)')}>
          <span style={{ fontSize: 18, flexShrink: 0, color: '#fb923c' }}>N</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fb923c', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
              {pendingCount} job{pendingCount > 1 ? 's' : ''} waiting for review
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
              Auto-fetched from RapidAPI — approve or reject to publish.
            </p>
          </div>
          <span style={{ color: '#fb923c', fontSize: 18, flexShrink: 0 }}>→</span>
        </button>
      )}

      {/* Stat cards — 4 col grid */}
      {STATS.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {STATS.map(s => (
            <div key={s.label}
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                       borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 4 }}>{s.label}</p>
              <p className="font-poppins font-bold text-white" style={{ fontSize: 26, lineHeight: 1, marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ color: s.color, fontSize: 11, fontWeight: 600 }}>{s.delta}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent jobs table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <p className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>Recent job listings</p>
          <button onClick={() => {}} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '5px 14px',
                            fontSize: 12, cursor: 'pointer' }}>
            View all
          </button>
        </div>
        {RECENT_JOBS.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
            No jobs yet — approve some from Pending Jobs.
          </p>
        ) : (
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
                    <td style={{ padding:'13px 12px', color:'rgba(255,255,255,0.5)', fontSize:13 }}>{j.title}</td>
                    <td style={{ padding:'13px 12px', color:'rgba(255,255,255,0.5)', fontSize:13 }}>{j.company}</td>
                    <td style={{ padding:'13px 12px', color:'rgba(255,255,255,0.5)', fontSize:13 }}>{j.type}</td>
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
        )}
      </Card>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Activity */}
        <Card>
          <p className="font-poppins font-bold text-white" style={{ fontSize:14, marginBottom:16 }}>
            Recent activity
          </p>
          {ACTIVITY.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
              No recent activity.
            </p>
          ) : ACTIVITY.map((a,i)=>(
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
          {TRAFFIC.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
              Traffic data not available.
            </p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {TRAFFIC.map(t=>(
                <div key={t.label} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13, width:78, flexShrink:0 }}>{t.label}</span>
                  <div style={{ flex:1, background:'rgba(255,255,255,0.05)', borderRadius:4, height:6 }}>
                    <div style={{ width:`${t.pct}%`, background:t.color, borderRadius:4, height:'100%' }}/>
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12, width:34, textAlign:'right' }}>{t.pct}%</span>
                </div>
              ))}
            </div>
          )}
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
    description:'', is_featured:false, tags:'', logo_url:'', banner_url:'',
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
              label="Company Logo" hint="shown on card & detail page" size={50}/>
            <ImageUpload value={form.banner_url} onChange={url=>setForm({...form,banner_url:url})}
              label="Banner Image" hint="wide header image on detail page (optional)" size={50}/>
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
                <button onClick={()=>del(j.id)}
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

/* ═══════════════════════════════════════════════════════════════
   DATABASE VIEW
   ═══════════════════════════════════════════════════════════════ */
function DatabaseView() {
  const [status,   setStatus]   = useState<'idle'|'checking'|'ok'|'error'>('idle');
  const [msg,      setMsg]      = useState('');
  const [lastCheck,setLastCheck]= useState<string>('');
  const [latency,  setLatency]  = useState<number|null>(null);

  async function testConnection() {
    setStatus('checking');
    setMsg('');
    setLatency(null);
    const t0 = Date.now();
    try {
      const res  = await fetch('/api/db-check');
      const ms   = Date.now() - t0;
      const data = await res.json();
      setLatency(ms);
      setLastCheck(new Date().toLocaleTimeString());
      if (data.ok) { setStatus('ok'); setMsg(''); }
      else         { setStatus('error'); setMsg(data.message ?? 'Unknown error'); }
    } catch {
      setLatency(Date.now() - t0);
      setLastCheck(new Date().toLocaleTimeString());
      setStatus('error');
      setMsg('Cannot reach /api/db-check — server may be down.');
    }
  }

  /* run once on mount */
  useEffect(() => { testConnection(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isOk       = status === 'ok';
  const isErr      = status === 'error';
  const isChecking = status === 'checking';

  const dotColor   = isOk ? '#4ade80' : isErr ? '#f87171' : '#F59E0B';
  const cardBorder = isOk
    ? 'rgba(74,222,128,0.25)'
    : isErr
    ? 'rgba(248,113,113,0.25)'
    : 'rgba(255,255,255,0.08)';

  const DB_METRICS = [
    { label: 'Tables',    value: '5',   sub: 'jobs · tools · roadmaps · blogs · users', color: '#A8E63D' },
    { label: 'Total Rows',value: '—',   sub: 'live count via Supabase',                 color: '#9B7FE8' },
    { label: 'Plan',      value: 'Free',sub: 'Supabase free tier',                      color: '#22D3EE' },
    { label: 'Engine',    value: 'PG',  sub: 'PostgreSQL 15',                           color: '#F59E0B' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* ── Main status card ───────────────────────────────── */}
      <div style={{
        background: '#0E0E0E',
        border: `1px solid ${cardBorder}`,
        borderRadius: 16, padding: '28px 28px 24px',
        transition: 'border-color 0.4s',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle glow behind the card */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 300, height: 300,
          borderRadius: '50%', pointerEvents: 'none',
          background: isOk
            ? 'radial-gradient(circle,rgba(74,222,128,0.06),transparent 70%)'
            : isErr
            ? 'radial-gradient(circle,rgba(248,113,113,0.06),transparent 70%)'
            : 'radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)',
          transform: 'translate(60px,-60px)',
        }}/>

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
          {/* Left — icon + status */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{
              width:52, height:52, borderRadius:14,
              background: isOk
                ? 'rgba(74,222,128,0.1)'
                : isErr
                ? 'rgba(248,113,113,0.1)'
                : 'rgba(245,158,11,0.1)',
              border: `1px solid ${isOk ? 'rgba(74,222,128,0.2)' : isErr ? 'rgba(248,113,113,0.2)' : 'rgba(245,158,11,0.2)'}`,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              {/* Supabase bolt-like icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={isOk ? '#4ade80' : isErr ? '#f87171' : '#F59E0B'} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                {/* animated dot */}
                <span style={{
                  width:8, height:8, borderRadius:'50%',
                  background: dotColor,
                  boxShadow: isChecking ? `0 0 0 0 ${dotColor}` : `0 0 6px ${dotColor}`,
                  display:'inline-block',
                  animation: isChecking ? 'pulse 1s ease-in-out infinite' : 'none',
                }}/>
                <p className="font-poppins font-bold text-white" style={{ fontSize:17 }}>
                  Supabase (PostgreSQL)
                </p>
              </div>
              <p style={{ color: dotColor, fontSize:13, fontWeight:600, marginBottom:4 }}>
                {isChecking ? 'Testing connection…'
                 : isOk     ? 'Connected'
                 : isErr    ? 'Disconnected'
                 :             'Status unknown'}
              </p>
              {lastCheck && (
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>
                  Last checked at {lastCheck}
                  {latency !== null && ` · ${latency} ms`}
                </p>
              )}
            </div>
          </div>

          {/* Right — test button */}
          <button
            onClick={testConnection}
            disabled={isChecking}
            style={{
              background: isChecking ? 'rgba(255,255,255,0.05)' : 'rgba(168,230,61,0.1)',
              border: `1px solid ${isChecking ? 'rgba(255,255,255,0.1)' : 'rgba(168,230,61,0.3)'}`,
              color: isChecking ? 'rgba(255,255,255,0.4)' : '#A8E63D',
              borderRadius:10, padding:'9px 18px', fontSize:13,
              cursor: isChecking ? 'not-allowed' : 'pointer',
              fontFamily:'var(--font-outfit)', fontWeight:600,
              display:'flex', alignItems:'center', gap:8,
              transition:'all 0.2s', flexShrink:0,
            }}
            onMouseEnter={e => {
              if (!isChecking) {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(168,230,61,0.18)';
                b.style.borderColor = 'rgba(168,230,61,0.5)';
              }
            }}
            onMouseLeave={e => {
              if (!isChecking) {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(168,230,61,0.1)';
                b.style.borderColor = 'rgba(168,230,61,0.3)';
              }
            }}>
            {isChecking ? (
              <>
                <span style={{ display:'inline-block', width:12, height:12, border:'2px solid rgba(255,255,255,0.2)',
                                borderTopColor:'rgba(255,255,255,0.7)', borderRadius:'50%',
                                animation:'spin 0.8s linear infinite' }}/>
                Connecting…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                  <path d="M20.5 9A9 9 0 005.2 5.2L1 10m22 4l-4.2 4.8A9 9 0 013.5 15"/>
                </svg>
                Test Connection
              </>
            )}
          </button>
        </div>

        {/* Error detail */}
        {isErr && msg && (
          <div style={{
            marginTop:18, background:'rgba(248,113,113,0.07)',
            border:'1px solid rgba(248,113,113,0.2)',
            borderRadius:10, padding:'12px 16px',
          }}>
            <p style={{ color:'#f87171', fontSize:12, fontWeight:600, marginBottom:4 }}>Error detail</p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontFamily:'monospace', lineHeight:1.7 }}>{msg}</p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:10, lineHeight:1.7 }}>
              <strong style={{ color:'rgba(255,255,255,0.7)' }}>Fix: </strong>
              Check your{' '}
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
                style={{ color:'#A8E63D', textDecoration:'underline' }}>
                Supabase dashboard
              </a>
              {' '}→ Settings → API → verify NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
            </p>
          </div>
        )}

        {/* Success detail */}
        {isOk && (
          <div style={{
            marginTop:18, background:'rgba(74,222,128,0.06)',
            border:'1px solid rgba(74,222,128,0.18)',
            borderRadius:10, padding:'12px 16px',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12 }}>
              Supabase connection is healthy. Read/write operations are available.
            </p>
          </div>
        )}
      </div>

      {/* ── Metric cards ───────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {DB_METRICS.map(m => (
          <div key={m.label} style={{
            background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:14, padding:'18px 20px', position:'relative', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', top:0, right:0, width:70, height:70, borderRadius:'50%',
              background:`radial-gradient(circle,${m.color}1a,transparent 70%)`,
              transform:'translate(20px,-20px)', pointerEvents:'none',
            }}/>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginBottom:8,
                         fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {m.label}
            </p>
            <p className="font-poppins font-bold text-white" style={{ fontSize:22, lineHeight:1, marginBottom:4 }}>
              {m.value}
            </p>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Connection string card ─────────────────────────── */}
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <p className="font-poppins font-bold text-white" style={{ fontSize:15 }}>
            Connection Configuration
          </p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
            style={{
              display:'flex', alignItems:'center', gap:6,
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
              color:'rgba(255,255,255,0.5)', borderRadius:8, padding:'5px 14px',
              fontSize:12, textDecoration:'none', cursor:'pointer',
            }}>
            Open Supabase Console
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { label:'URL Variable',       value:'NEXT_PUBLIC_SUPABASE_URL',      mono:true, color:'#A8E63D' },
            { label:'Anon Key Variable',  value:'NEXT_PUBLIC_SUPABASE_ANON_KEY', mono:true, color:'#A8E63D' },
            { label:'Service Key',        value:'SUPABASE_SERVICE_ROLE_KEY',     mono:true, color:'rgba(255,255,255,0.5)' },
            { label:'Config File',        value:'.env.local',                    mono:true, color:'rgba(255,255,255,0.5)' },
            { label:'Client Library',     value:'@supabase/supabase-js via @/lib/supabase.ts', mono:false, color:'rgba(255,255,255,0.5)' },
            { label:'Connection Strategy',value:'Singleton client — safe for Next.js API routes & Server Components', mono:false, color:'rgba(255,255,255,0.5)' },
          ].map(row => (
            <div key={row.label} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'11px 14px', borderRadius:10,
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.06)',
              gap:12,
            }}>
              <span style={{ color:'rgba(255,255,255,0.35)', fontSize:12, fontWeight:500, flexShrink:0 }}>
                {row.label}
              </span>
              <span style={{
                color: row.color, fontSize:12,
                fontFamily: row.mono ? 'monospace' : 'inherit',
                textAlign:'right',
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Quick-start guide ──────────────────────────────── */}
      <Card>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:16 }}>
          How to connect Supabase
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { step:'1', text:'Create a free project on', link:'https://supabase.com', linkText:'supabase.com' },
            { step:'2', text:'Go to Settings → API and copy your Project URL, anon key, and service_role key' },
            { step:'3', text:'Paste the three values into .env.local (see variable names above)' },
            { step:'4', text:'Open the SQL Editor in Supabase and run the schema from supabase/schema.sql to create all tables' },
            { step:'5', text:'Go to Authentication → Policies and enable Row Level Security if needed' },
            { step:'6', text:'Click "Test Connection" above to verify the connection is live' },
          ].map(({ step, text, link, linkText }) => (
            <div key={step} style={{
              display:'flex', alignItems:'flex-start', gap:12, padding:'10px 14px',
              borderRadius:10, background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                width:22, height:22, borderRadius:6, flexShrink:0,
                background:'rgba(168,230,61,0.1)', border:'1px solid rgba(168,230,61,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span className="font-poppins font-bold text-lime" style={{ fontSize:10 }}>{step}</span>
              </div>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, lineHeight:1.6 }}>
                {text}{' '}
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    style={{ color:'#A8E63D', textDecoration:'underline' }}>
                    {linkText}
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PENDING JOBS VIEW — approve / reject auto-fetched jobs
   ═══════════════════════════════════════════════════════════════ */
interface PendingJob {
  id: string; title: string; company: string; location: string;
  type: string; salary: string | null; description: string;
  apply_link: string; source: string; fetched_at: string;
}

interface EditDraft {
  id: string; title: string; company: string; location: string;
  type: string; salary: string; apply_link: string; description: string;
  tags: string; deadline: string; batch_year: string; is_featured: boolean;
}

function ApproveDrawer({ draft, adminKey, onChange, onClose, onApproved }: {
  draft: EditDraft; adminKey: string;
  onChange: (d: EditDraft) => void;
  onClose: () => void;
  onApproved: (id: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const set = (k: keyof EditDraft, v: string | boolean) => onChange({ ...draft, [k]: v });

  async function confirm() {
    setSaving(true); setErrMsg('');
    try {
      const res = await fetch('/api/admin/jobs/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          jobId: draft.id,
          overrides: {
            title: draft.title, company: draft.company, location: draft.location,
            type: draft.type, salary: draft.salary || null, apply_link: draft.apply_link,
            description: draft.description, is_featured: draft.is_featured,
            tags: draft.tags ? draft.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            deadline: draft.deadline || null,
            batch_year: draft.batch_year ? Number(draft.batch_year) : null,
          },
        }),
      });
      if (res.ok) { onApproved(draft.id); onClose(); }
      else { const d = await res.json().catch(() => ({})); setErrMsg(d.error ?? `Error ${res.status}`); }
    } catch (e) { setErrMsg(e instanceof Error ? e.message : 'Network error'); }
    setSaving(false);
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        zIndex: 100, backdropFilter: 'blur(4px)',
      }}/>
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(580px, 96vw)', background: '#0E0E0E',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 101, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>Review & Edit before Publishing</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>Edit any field then hit Confirm & Publish</p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: 8, width: 32, height: 32,
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }} className="hide-scrollbar">
          {errMsg && (
            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                          color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {errMsg}
            </div>
          )}

          {([
            { k: 'title',      l: 'Job Title',             req: true  },
            { k: 'company',    l: 'Company',               req: true  },
            { k: 'location',   l: 'Location',              req: true  },
            { k: 'salary',     l: 'Salary / Stipend',      req: false },
            { k: 'apply_link', l: 'Apply Link (URL)',      req: true  },
            { k: 'deadline',   l: 'Deadline',              req: false, tp: 'date' },
            { k: 'batch_year', l: 'Batch Year',            req: false, tp: 'number' },
            { k: 'tags',       l: 'Tags — comma separated',req: false },
          ] as { k: keyof EditDraft; l: string; req: boolean; tp?: string }[]).map(({ k, l, req, tp }) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11,
                               fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                {l}{req && <span style={{ color: '#f87171' }}> *</span>}
              </label>
              <input type={tp ?? 'text'} value={draft[k] as string}
                onChange={e => set(k, e.target.value)} style={IS} />
            </div>
          ))}

          {/* Type */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11,
                             fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
              Job Type
            </label>
            <select value={draft.type} onChange={e => set('type', e.target.value)} style={IS}>
              <option>Internship</option><option>Job</option><option>Full-time</option>
            </select>
          </div>

          {/* Featured */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={draft.is_featured}
                onChange={e => set('is_featured', e.target.checked)} className="accent-lime"/>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Featured on homepage</span>
            </label>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11,
                             fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
              Description
              <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400,
                              textTransform: 'none', letterSpacing: 0, marginLeft: 6 }}>(HTML supported)</span>
            </label>
            <textarea value={draft.description} onChange={e => set('description', e.target.value)}
              rows={16} style={{ ...IS, resize: 'vertical', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex', gap: 10, flexShrink: 0, background: '#0E0E0E' }}>
          <button onClick={onClose} style={{
            flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: 11,
            fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-outfit)',
          }}>Cancel</button>
          <button onClick={confirm} disabled={saving} className="btn-lime"
            style={{ flex: 2, padding: 11, fontSize: 13,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {saving ? (
              <><span style={{ width: 13, height: 13, border: '2px solid rgba(0,0,0,0.2)',
                               borderTopColor: '#080808', borderRadius: '50%',
                               animation: 'spin 0.8s linear infinite', display: 'inline-block' }}/>Publishing…</>
            ) : 'Confirm & Publish'}
          </button>
        </div>
      </div>
    </>
  );
}

function PendingJobsView({ adminKey, onBadgeUpdate }: { adminKey: string; onBadgeUpdate: (n: number) => void }) {
  const [jobs,      setJobs]      = useState<PendingJob[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState('');
  const [msgOk,     setMsgOk]     = useState(true);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);

  function flash(text: string, ok = true) { setMsg(text); setMsgOk(ok); setTimeout(() => setMsg(''), 3500); }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs/pending', { headers: { 'x-admin-key': adminKey } });
      if (res.ok) { const data = await res.json(); setJobs(data); onBadgeUpdate(data.length); }
      else flash('Failed to load pending jobs', false);
    } catch { flash('Network error', false); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openEditor(job: PendingJob) {
    setEditDraft({
      id: job.id, title: job.title ?? '', company: job.company ?? '',
      location: job.location ?? 'Remote', type: job.type ?? 'Internship',
      salary: job.salary ?? '', apply_link: job.apply_link ?? '',
      description: job.description ?? '', tags: '', deadline: '', batch_year: '', is_featured: false,
    });
  }

  function handleApproved(jobId: string) {
    const updated = jobs.filter(j => j.id !== jobId);
    setJobs(updated); onBadgeUpdate(updated.length);
    flash('Job approved and published live!');
  }

  async function reject(jobId: string) {
    if (!confirm('Reject and permanently delete this job?')) return;
    const res = await fetch('/api/admin/jobs/reject', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) { const u = jobs.filter(j => j.id !== jobId); setJobs(u); onBadgeUpdate(u.length); flash('Rejected'); }
    else flash('Reject failed', false);
  }

  return (
    <>
      {editDraft && (
        <ApproveDrawer draft={editDraft} adminKey={adminKey}
          onChange={setEditDraft} onClose={() => setEditDraft(null)} onApproved={handleApproved} />
      )}

    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 4 }}>
            Auto-fetched via RapidAPI · review before publishing live
          </p>
        </div>
        <button onClick={load} disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '8px 16px',
            fontSize: 12, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-outfit)',
          }}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{
          background: msgOk ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
          border: `1px solid ${msgOk ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
          color: msgOk ? '#4ade80' : '#f87171',
          borderRadius: 10, padding: '10px 14px', fontSize: 13,
        }}>
          {msg}
        </div>
      )}

      {/* Empty state */}
      {!loading && jobs.length === 0 && (
        <div style={{
          background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: 60, textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>—</p>
          <p className="font-poppins font-bold text-white" style={{ fontSize: 15, marginBottom: 6 }}>
            All caught up!
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No pending jobs waiting for review.
          </p>
        </div>
      )}

      {/* Job cards */}
      {jobs.map(job => (
        <div key={job.id} style={{
          background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '18px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
        }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <p className="font-poppins font-bold text-white" style={{ fontSize: 14 }}>{job.title}</p>
              {job.type && (
                <span style={{
                  background: 'rgba(168,230,61,0.1)', color: '#A8E63D',
                  border: '1px solid rgba(168,230,61,0.25)',
                  borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 600,
                }}>{job.type}</span>
              )}
              <span style={{
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '2px 9px', fontSize: 11,
              }}>via {job.source}</span>
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{job.company}</span>
              {job.location && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{job.location}</span>}
              {job.salary   && <span style={{ color: '#A8E63D', fontSize: 12 }}>{job.salary}</span>}
            </div>

            {job.description && (
              <p style={{
                color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.6,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8,
              }}>
                {job.description.replace(/<[^>]+>/g, '').slice(0, 200)}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {job.apply_link && (
                <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#A8E63D', fontSize: 11, textDecoration: 'underline' }}>
                  View apply link ↗
                </a>
              )}
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                {new Date(job.fetched_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right — action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <button onClick={() => openEditor(job)} style={{
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
              color: '#4ade80', borderRadius: 10, padding: '8px 18px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-outfit)', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(74,222,128,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(74,222,128,0.1)')}>
              Approve
            </button>
            <button onClick={() => reject(job.id)} style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              color: '#f87171', borderRadius: 10, padding: '8px 18px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-outfit)', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUTOMATION VIEW — manual search + cron schedule settings
   ═══════════════════════════════════════════════════════════════ */

const SEARCH_PRESETS = [
  'software developer internship india',
  'frontend developer internship india',
  'backend developer internship india',
  'full stack developer internship india',
  'react developer internship india',
  'python developer internship india',
  'data science internship india',
  'machine learning internship india',
  'android developer internship india',
  'devops internship india',
  'fresher software engineer india',
  'UI UX designer internship india',
];

const SCHEDULE_OPTIONS = [
  { label: 'Once a day',     cron: '0 7 * * *',    desc: 'Runs at 7:00 AM UTC' },
  { label: 'Twice a day',    cron: '0 7,19 * * *',  desc: 'Runs at 7 AM & 7 PM UTC' },
  { label: 'Every 6 hours',  cron: '0 */6 * * *',   desc: 'Runs 4× a day' },
  { label: 'Custom cron',    cron: 'custom',         desc: 'Set your own cron expression' },
];

interface RunLog {
  id?:                string;
  trigger_type?:      string;
  ts:                 string;
  query:              string;
  fetched:            number;
  added:              number;
  skipped?:           number;
  ok:                 boolean;
  error?:             string;
  raw_response?:      string;
}

function AutomationView({ adminKey }: { adminKey: string }) {
  // Manual search state
  const [query,        setQuery]       = useState('software intern india');
  const [customQuery,  setCustomQuery] = useState('');
  const [running,      setRunning]     = useState(false);
  const [logs,         setLogs]        = useState<RunLog[]>([]);
  const [logsLoading,  setLogsLoading] = useState(false);
  const [expandedRaw,  setExpandedRaw] = useState<string | null>(null);

  // Load persisted logs from DB on mount
  useEffect(() => {
    loadDbLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadDbLogs() {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/admin/logs?limit=50', {
        headers: { 'x-admin-key': adminKey },
      });
      if (res.ok) {
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: RunLog[] = (data as any[]).map(d => ({
          id:           d.id,
          trigger_type: d.trigger_type,
          ts:           new Date(d.ran_at).toLocaleString(),
          query:        d.query,
          fetched:      d.fetched,
          added:        d.added_to_pending,
          skipped:      d.skipped_duplicates,
          ok:           d.status === 'success',
          error:        d.error_message ?? undefined,
          raw_response: d.raw_response  ?? undefined,
        }));
        setLogs(mapped);
      }
    } catch { /* silent */ }
    setLogsLoading(false);
  }

  // Schedule state  (persisted in localStorage so it survives page refresh)
  const [schedEnabled,  setSchedEnabled]  = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('auto_sched_enabled') !== 'false';
  });
  const [schedPreset,   setSchedPreset]   = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('auto_sched_preset') ?? '0 7 * * *') : '0 7 * * *'
  );
  const [customCron,    setCustomCron]    = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('auto_custom_cron') ?? '') : ''
  );
  const [schedHour,     setSchedHour]     = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('auto_sched_hour') ?? '07') : '07'
  );
  const [savedMsg,      setSavedMsg]      = useState('');

  const isCustomCron = schedPreset === 'custom';
  const activeCron   = isCustomCron ? customCron : schedPreset;

  // Derive "next run" label from cron
  function nextRunLabel(cron: string) {
    if (!cron || cron === 'custom') return '—';
    const parts = cron.split(' ');
    if (parts.length < 5) return 'Invalid';
    const h = parts[1]; const m = parts[0];
    if (h === '*/6') return 'Every 6 hours';
    if (h.includes(',')) {
      return h.split(',').map(hh => `${hh.padStart(2,'0')}:${m.padStart(2,'0')} UTC`).join(' & ');
    }
    return `${h.padStart(2,'0')}:${m.padStart(2,'0')} UTC daily`;
  }

  function saveSchedule() {
    localStorage.setItem('auto_sched_enabled', String(schedEnabled));
    localStorage.setItem('auto_sched_preset',  schedPreset);
    localStorage.setItem('auto_custom_cron',   customCron);
    localStorage.setItem('auto_sched_hour',    schedHour);
    setSavedMsg('Schedule saved');
    setTimeout(() => setSavedMsg(''), 3000);
  }

  async function runFetch(searchQuery: string) {
    if (running) return;
    setRunning(true);
    try {
      const res  = await fetch(
        `/api/cron/fetch-jobs?q=${encodeURIComponent(searchQuery)}`,
        { headers: { 'x-admin-key': adminKey } }
      );
      const data = await res.json();

      // Build a readable summary from per-source counts
      const src     = data.sources ?? {};
      const srcStr  = src.unstop !== undefined
        ? `Unstop:${src.unstop} Adzuna:${src.adzuna} RapidAPI:${src.rapidapi}`
        : '';

      const entry: RunLog = {
        ts:      new Date().toLocaleString(),
        query:   searchQuery,
        fetched: data.fetched          ?? data.sources?.merged ?? 0,
        added:   data.added_to_pending ?? 0,
        skipped: data.skipped_duplicates ?? 0,
        ok:      !!data.success && !data.error,
        error:   data.error
          ?? (data.insert_errors ? data.insert_errors[0] : undefined)
          ?? (data.success ? undefined : 'Unknown error'),
        raw_response: srcStr || data.note || undefined,
      };
      setLogs(prev => [entry, ...prev].slice(0, 100));
      // Reload from DB after a short delay
      setTimeout(loadDbLogs, 1500);
    } catch (e) {
      const entry: RunLog = {
        ts: new Date().toLocaleString(), query: searchQuery,
        fetched: 0, added: 0, ok: false,
        error: e instanceof Error ? e.message : 'Network error',
      };
      setLogs(prev => [entry, ...prev].slice(0, 100));
    }
    setRunning(false);
  }

  const finalQuery = query === '__custom__' ? customQuery : query;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Top 2-col grid ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Manual Fetch card */}
        <div style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9,
                          background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8E63D"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 14 }}>Manual Search</p>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 14 }}>
            Pick a preset or type a custom query to fetch jobs right now.
          </p>

          {/* Preset chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {SEARCH_PRESETS.map(p => (
              <button key={p} onClick={() => { setQuery(p); setCustomQuery(''); }}
                style={{
                  background: query === p ? 'rgba(168,230,61,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${query === p ? 'rgba(168,230,61,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: query === p ? '#A8E63D' : 'rgba(255,255,255,0.5)',
                  borderRadius: 20, padding: '4px 12px', fontSize: 11,
                  cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                  transition: 'all 0.15s',
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => setQuery('__custom__')}
              style={{
                background: query === '__custom__' ? 'rgba(168,230,61,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${query === '__custom__' ? 'rgba(168,230,61,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: query === '__custom__' ? '#A8E63D' : 'rgba(255,255,255,0.4)',
                borderRadius: 20, padding: '4px 12px', fontSize: 11,
                cursor: 'pointer', fontFamily: 'var(--font-outfit)',
              }}>
              + Custom
            </button>
          </div>

          {/* Custom input */}
          {query === '__custom__' && (
            <input
              type="text" placeholder="e.g. java developer intern bangalore"
              value={customQuery} onChange={e => setCustomQuery(e.target.value)}
              style={{ ...IS, marginBottom: 14 }}
            />
          )}

          {/* Active query preview */}
          {finalQuery && query !== '__custom__' && (
            <div style={{ background: 'rgba(168,230,61,0.05)', border: '1px solid rgba(168,230,61,0.15)',
                          borderRadius: 9, padding: '8px 12px', marginBottom: 14,
                          display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A8E63D"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Query: </span>
              <span style={{ color: '#A8E63D', fontSize: 12, fontWeight: 600 }}>{finalQuery}</span>
            </div>
          )}

          <button
            onClick={() => runFetch(finalQuery)}
            disabled={running || !finalQuery}
            className="btn-lime w-full py-2.5 text-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                     opacity: (!finalQuery) ? 0.5 : 1 }}>
            {running ? (
              <>
                <span style={{ width: 13, height: 13, border: '2px solid rgba(0,0,0,0.2)',
                                borderTopColor: '#080808', borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite', display: 'inline-block' }}/>
                Fetching…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Run Now
              </>
            )}
          </button>
        </div>

        {/* Schedule Settings card */}
        <div style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9,
                            background: 'rgba(155,127,232,0.1)', border: '1px solid rgba(155,127,232,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B7FE8"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <p className="font-poppins font-bold text-white" style={{ fontSize: 14 }}>Auto Schedule</p>
            </div>
            {/* Toggle */}
            <button onClick={() => setSchedEnabled(v => !v)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: schedEnabled ? '#A8E63D' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'background 0.25s', flexShrink: 0,
              }}>
              <span style={{
                position: 'absolute', top: 3, left: schedEnabled ? 22 : 3,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }}/>
            </button>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 16 }}>
            {schedEnabled
              ? `Active — next run: ${nextRunLabel(activeCron)}`
              : 'Disabled — cron will not run automatically.'}
          </p>

          {/* Frequency presets */}
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Frequency
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
            {SCHEDULE_OPTIONS.map(opt => (
              <button key={opt.cron} onClick={() => setSchedPreset(opt.cron)}
                style={{
                  background: schedPreset === opt.cron ? 'rgba(155,127,232,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${schedPreset === opt.cron ? 'rgba(155,127,232,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'var(--font-outfit)', transition: 'all 0.15s',
                }}>
                <span style={{ color: schedPreset === opt.cron ? '#9B7FE8' : 'rgba(255,255,255,0.6)',
                                fontSize: 13, fontWeight: schedPreset === opt.cron ? 600 : 400 }}>
                  {opt.label}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Custom cron input */}
          {isCustomCron && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 6 }}>
                Custom cron expression (UTC)
              </p>
              <input type="text" placeholder="e.g. 0 9 * * 1-5" value={customCron}
                onChange={e => setCustomCron(e.target.value)} style={IS}/>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 5 }}>
                Min · Hour · Day · Month · Weekday
              </p>
            </div>
          )}

          {/* Hour picker (for once/twice presets) */}
          {!isCustomCron && schedPreset === '0 7 * * *' && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600,
                          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Run Hour (UTC)
              </p>
              <select value={schedHour} onChange={e => {
                  setSchedHour(e.target.value);
                  setSchedPreset(`0 ${parseInt(e.target.value)} * * *`);
                }} style={IS}>
                {Array.from({length: 24}, (_,i) => String(i).padStart(2,'0')).map(h => (
                  <option key={h} value={h}>{h}:00 UTC</option>
                ))}
              </select>
            </div>
          )}

          {/* vercel.json reminder */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 9, padding: '10px 12px', marginBottom: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.7 }}>
              Update <span style={{ color: '#A8E63D', fontFamily: 'monospace' }}>vercel.json</span> with the cron below and redeploy for changes to take effect on Vercel.
            </p>
            <code style={{ color: '#9B7FE8', fontSize: 11, fontFamily: 'monospace', display: 'block', marginTop: 6 }}>
              {`"schedule": "${schedEnabled ? activeCron : '(disabled)'}"`}
            </code>
          </div>

          {savedMsg && (
            <div style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.25)',
                          color: '#A8E63D', borderRadius: 9, padding: '8px 12px',
                          fontSize: 12, marginBottom: 10 }}>
              {savedMsg}
            </div>
          )}

          <button onClick={saveSchedule}
            style={{
              width: '100%', background: 'rgba(155,127,232,0.12)',
              border: '1px solid rgba(155,127,232,0.3)', color: '#9B7FE8',
              borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(155,127,232,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(155,127,232,0.12)')}>
            Save Schedule
          </button>
        </div>
      </div>

      {/* ── Status bar ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Status',      value: schedEnabled ? 'Active' : 'Paused',
            color: schedEnabled ? '#4ade80' : '#f87171' },
          { label: 'Schedule',    value: isCustomCron ? (customCron || '—') : nextRunLabel(schedPreset),
            color: '#9B7FE8' },
          { label: 'Total Runs',  value: String(logs.length), color: '#A8E63D' },
          { label: 'Jobs Added',  value: String(logs.reduce((a, l) => a + (l.added ?? 0), 0)), color: '#22D3EE' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6,
                        textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {s.label}
            </p>
            <p className="font-poppins font-bold" style={{ fontSize: 18, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Run log ────────────────────────────────────────── */}
      <div style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 14 }}>Run Log</p>
            <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.3)', borderRadius: 20, padding: '2px 9px', fontSize: 11 }}>
              saved to DB
            </span>
          </div>
          <button onClick={loadDbLogs} disabled={logsLoading}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                     fontSize: 12, cursor: logsLoading ? 'not-allowed' : 'pointer',
                     fontFamily: 'var(--font-outfit)' }}>
            {logsLoading ? 'Loading…' : '↻ Refresh'}
          </button>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
              {logsLoading ? 'Loading logs…' : 'No runs yet. Hit "Run Now" to fetch jobs.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {logs.map((log, i) => (
              <div key={log.id ?? i}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 10,
                  background: log.ok ? 'rgba(74,222,128,0.04)' : 'rgba(248,113,113,0.04)',
                  border: `1px solid ${log.ok ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)'}`,
                  cursor: log.raw_response ? 'pointer' : 'default',
                }} onClick={() => log.raw_response && setExpandedRaw(expandedRaw === (log.id ?? String(i)) ? null : (log.id ?? String(i)))}>

                  {/* Status icon */}
                  <span style={{
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                    color: log.ok ? '#4ade80' : '#f87171',
                    background: log.ok ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                    borderRadius: 4, padding: '1px 6px',
                  }}>{log.ok ? 'OK' : 'FAIL'}</span>

                  {/* Trigger badge */}
                  <span style={{
                    background: log.trigger_type === 'cron' ? 'rgba(155,127,232,0.12)' : 'rgba(168,230,61,0.1)',
                    color: log.trigger_type === 'cron' ? '#9B7FE8' : '#A8E63D',
                    border: `1px solid ${log.trigger_type === 'cron' ? 'rgba(155,127,232,0.25)' : 'rgba(168,230,61,0.25)'}`,
                    borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 600, flexShrink: 0,
                  }}>
                    {log.trigger_type ?? 'manual'}
                  </span>

                  {/* Time */}
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, flexShrink: 0, minWidth: 140 }}>
                    {log.ts}
                  </span>

                  {/* Query */}
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, flex: 1,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    "{log.query}"
                  </span>

                  {/* Result */}
                  {log.ok ? (
                    <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {log.fetched} fetched · {log.added} added · {log.skipped ?? 0} dupes
                    </span>
                  ) : (
                    <span style={{ color: '#f87171', fontSize: 12, flexShrink: 0,
                                    maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.error}
                    </span>
                  )}

                  {/* Expand toggle */}
                  {log.raw_response && (
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, flexShrink: 0, display: 'flex' }}>
                      {expandedRaw === (log.id ?? String(i))
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      }
                    </span>
                  )}
                </div>

                {/* Raw response panel */}
                {log.raw_response && expandedRaw === (log.id ?? String(i)) && (
                  <div style={{
                    margin: '0 0 4px 0', padding: '12px 14px',
                    background: 'rgba(0,0,0,0.4)', borderRadius: '0 0 10px 10px',
                    border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none',
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 6,
                                  fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Raw API Response (first 2000 chars)
                    </p>
                    <pre style={{
                      color: '#A8E63D', fontSize: 11, fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                      maxHeight: 260, overflowY: 'auto', margin: 0,
                    }}>
                      {(() => {
                        try { return JSON.stringify(JSON.parse(log.raw_response!), null, 2); }
                        catch { return log.raw_response; }
                      })()}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
    { id: 'jobs',     label: 'Jobs',         badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
    { id: 'pending',  label: 'Pending Jobs', badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { id: 'automation', label: 'Automation', badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/><rect x="9" y="14" width="6" height="6" rx="1"/><path d="M5 9v3a2 2 0 002 2h10a2 2 0 002-2V9"/><line x1="12" y1="14" x2="12" y2="12"/></svg> },
    { id: 'tools',    label: 'AI Tools',     badge: 0,
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
    { id: 'database', label: 'Database',  badge: 0,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
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
  const [pendingCount, setPendingCount] = useState(0);

  async function fetchData() {
    setLoading(true);
    const [jr, tr] = await Promise.all([fetch('/api/jobs'), fetch('/api/tools')]);
    setJobs(await jr.json());
    setTools(await tr.json());
    setLoading(false);
  }

  async function fetchPendingCount(key: string) {
    try {
      const res = await fetch('/api/admin/jobs/pending', { headers: { 'x-admin-key': key } });
      if (res.ok) { const d = await res.json(); setPendingCount(d.length); }
    } catch { /* silent */ }
  }

  function handleAuth(k: string) {
    setAdminKey(k); setAuthed(true);
    fetchData();
    fetchPendingCount(k);
  }

  if (!authed) return <LoginScreen onAuth={handleAuth} />;

  const titles: Record<View, string> = {
    dashboard:'Dashboard', analytics:'Analytics', jobs:'Jobs',
    pending:'Pending Jobs', automation:'Job Automation',
    tools:'AI Tools', roadmaps:'Roadmaps', blog:'Blog', users:'Users',
    reports:'Reports', notifications:'Notifications', settings:'Settings',
    security:'Security', database:'Database',
  };
  const subtitles: Partial<Record<View, string>> = {
    dashboard:  'Overview of your platform activity.',
    jobs:       'Manage job listings and internships.',
    pending:    'Review auto-fetched jobs before they go live.',
    automation: 'Manually search for jobs or configure the auto-fetch schedule.',
    tools:      'Manage the AI tools directory.',
    database:   'Monitor your Supabase connection and configuration.',
  };

  function renderView() {
    if (view === 'dashboard') return <DashboardView pendingCount={pendingCount} onGoToPending={() => setView('pending')} />;
    if (view === 'jobs')      return <JobsView  jobs={jobs}  loading={loading} adminKey={adminKey} onRefresh={fetchData} />;
    if (view === 'pending')    return <PendingJobsView adminKey={adminKey} onBadgeUpdate={setPendingCount} />;
    if (view === 'automation') return <AutomationView adminKey={adminKey} />;
    if (view === 'tools')     return <ToolsView tools={tools} loading={loading} adminKey={adminKey} onRefresh={fetchData} />;
    if (view === 'database')  return <DatabaseView />;
    return <PlaceholderView title={titles[view]} />;
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808', fontFamily:'var(--font-outfit)' }}>

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
          background: '#0E0E0E',
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

                      {((tab.id === 'pending' ? pendingCount : tab.badge) ?? 0) > 0 && (
                        <span style={{
                          background: tab.id === 'pending' ? 'rgba(251,146,60,0.15)' : 'rgba(248,113,113,0.15)',
                          color: tab.id === 'pending' ? '#fb923c' : '#f87171',
                          border: `1px solid ${tab.id === 'pending' ? 'rgba(251,146,60,0.3)' : 'rgba(248,113,113,0.3)'}`,
                          fontSize: 10, fontWeight: 700,
                          borderRadius: 20, padding: '1px 7px', flexShrink: 0,
                        }}>
                          {tab.id === 'pending' ? pendingCount : tab.badge}
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
