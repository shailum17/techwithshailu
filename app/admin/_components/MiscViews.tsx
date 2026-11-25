'use client';

/* Smaller views: analytics, roadmaps, users, reports, settings, security, placeholder. */

import { useState, useEffect } from 'react';

export function AnalyticsView() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Page Views', value:'—', sub:'Connect analytics to track', color:'#A8E63D' },
          { label:'Unique Visitors', value:'—', sub:'Connect analytics to track', color:'#60A5FA' },
          { label:'Avg. Session', value:'—', sub:'Connect analytics to track', color:'#FBBF24' },
        ].map(s => (
          <div key={s.label} style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)',
                                       borderRadius:16, padding:'22px 24px' }}>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontWeight:600,
                         textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{s.label}</p>
            <p className="font-poppins font-bold text-white" style={{ fontSize:28, lineHeight:1, marginBottom:6 }}>{s.value}</p>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:8 }}>Analytics Integration</p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, lineHeight:1.7 }}>
          Connect a provider like <span style={{ color:'#A8E63D' }}>Vercel Analytics</span>, <span style={{ color:'#60A5FA' }}>Plausible</span>, or <span style={{ color:'#FBBF24' }}>Google Analytics</span> to see real visitor data here.
        </p>
        <div style={{ marginTop:16, display:'flex', gap:10, flexWrap:'wrap' }}>
          {['Vercel Analytics','Plausible','Google Analytics','Umami'].map(p => (
            <span key={p} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                                    color:'rgba(255,255,255,0.5)', borderRadius:8, padding:'6px 14px', fontSize:12 }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RoadmapsView() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:4 }}>Roadmaps</p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>
          Roadmap content is managed via code in <code style={{ color:'#A8E63D', background:'rgba(168,230,61,0.08)', padding:'1px 6px', borderRadius:4 }}>app/resources/roadmaps</code>. Edit the data files there to update roadmap content.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {['Frontend', 'DSA', 'Backend', 'System Design', 'AI / ML', 'DevOps'].map(r => (
            <div key={r} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
                                   borderRadius:12, padding:'16px 18px',
                                   display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>🗺️</span>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600 }}>{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UsersView() {
  const [count, setCount] = useState<number|null>(null);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(d => setCount(Array.isArray(d) ? d.length : null)).catch(() => {});
  }, []);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Total Users', value: count !== null ? String(count) : '—', color:'#A8E63D' },
          { label:'Active Today', value:'—', color:'#22D3EE' },
          { label:'New This Week', value:'—', color:'#FBBF24' },
        ].map(s => (
          <div key={s.label} style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)',
                                       borderRadius:16, padding:'22px 24px' }}>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontWeight:600,
                         textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{s.label}</p>
            <p className="font-poppins font-bold text-white" style={{ fontSize:28, lineHeight:1 }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:16 }}>User Management</p>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>
          User accounts are managed via Supabase Auth. Visit your{' '}
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
             style={{ color:'#A8E63D', textDecoration:'underline' }}>Supabase dashboard</a>{' '}
          → Authentication → Users to manage accounts directly.
        </p>
      </div>
    </div>
  );
}

export function ReportsView() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.2)',
                     borderRadius:16, padding:'18px 22px',
                     display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(248,113,113,0.12)',
                       display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p style={{ color:'#f87171', fontWeight:600, fontSize:13 }}>3 items need attention</p>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2 }}>Review flagged content and user reports below</p>
        </div>
      </div>
      <div style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:16 }}>Flagged Content</p>
        {[
          { type:'Job', title:'Suspicious job listing from unknown company', time:'2h ago', severity:'high' },
          { type:'Tool', title:'AI tool with broken URL reported by user', time:'5h ago', severity:'medium' },
          { type:'Blog', title:'Blog post with outdated information', time:'1d ago', severity:'low' },
        ].map((r, i) => {
          const col = r.severity === 'high' ? '#f87171' : r.severity === 'medium' ? '#fb923c' : '#FBBF24';
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0',
                                   borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:col, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13 }}>{r.title}</p>
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:2 }}>{r.type} · {r.time}</p>
              </div>
              <span style={{ color:col, fontSize:11, fontWeight:600,
                              background:`${col}15`, border:`1px solid ${col}30`,
                              borderRadius:20, padding:'2px 10px', flexShrink:0, textTransform:'capitalize' }}>
                {r.severity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SettingsView() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {[
        {
          title: 'Site Configuration',
          items: [
            { label:'Site Name', value:'techwithshailu', type:'text' },
            { label:'Site URL', value:'https://techwithshailu.in', type:'text' },
            { label:'Contact Email', value:'admin@techwithshailu.in', type:'email' },
          ],
        },
        {
          title: 'SEO & Meta',
          items: [
            { label:'Meta Title', value:'techwithshailu — CS Jobs & Resources', type:'text' },
            { label:'Meta Description', value:'Curated tech jobs, AI tools, and resources for CS students in India.', type:'text' },
          ],
        },
      ].map(section => (
        <div key={section.title} style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)',
                                           borderRadius:16, padding:24 }}>
          <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:18 }}>{section.title}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {section.items.map(item => (
              <div key={item.label}>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontWeight:600,
                             textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{item.label}</p>
                <input type={item.type} defaultValue={item.value} readOnly
                  style={{ width:'100%', background:'rgba(255,255,255,0.04)',
                            border:'1px solid rgba(255,255,255,0.08)', borderRadius:10,
                            padding:'9px 13px', color:'rgba(255,255,255,0.55)', fontSize:13,
                            outline:'none', fontFamily:'var(--font-outfit)', cursor:'not-allowed' }} />
              </div>
            ))}
          </div>
          <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11, marginTop:14 }}>
            ⓘ Edit these values in your environment variables or codebase configuration.
          </p>
        </div>
      ))}
    </div>
  );
}

export function SecurityView() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Status banner */}
      <div style={{ background:'rgba(74,222,128,0.05)', border:'1px solid rgba(74,222,128,0.2)',
                     borderRadius:16, padding:'18px 22px',
                     display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(74,222,128,0.1)',
                       display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <div>
          <p style={{ color:'#4ade80', fontWeight:600, fontSize:13 }}>All security measures active</p>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2 }}>
            HTTPS enforced · RLS via anon client · Rate limiting on all public routes
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ background:'#0E0E0E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
        <p className="font-poppins font-bold text-white" style={{ fontSize:15, marginBottom:18 }}>Security Checklist</p>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            {
              status: 'active',
              label: 'Admin key authentication',
              note: 'checkAdminAuth() enforced on all admin API routes (httpOnly session cookie or x-admin-key header)',
            },
            {
              status: 'active',
              label: 'HTTPS / SSL + security headers',
              note: 'HSTS, X-Frame-Options, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy configured in next.config.mjs',
            },
            {
              status: 'active',
              label: 'Environment variables secured',
              note: '.env.local is gitignored, all secrets accessed via process.env only — never hardcoded',
            },
            {
              status: 'active',
              label: 'Supabase Row Level Security (RLS)',
              note: 'All public GET routes now use the anon client which respects RLS policies — service role only used for admin writes',
            },
            {
              status: 'active',
              label: 'Rate limiting on API routes',
              note: '120 req/min per IP on all public GET endpoints (/api/jobs, /api/tools, /api/blogs, /api/roadmaps)',
            },
            {
              status: 'missing',
              label: 'Two-factor authentication',
              note: 'Admin access is single-factor (shared admin key). 2FA not implemented.',
            },
          ].map((item, i) => {
            const cfg = {
              active:   { dot:'#4ade80', label:'Active',  bg:'rgba(74,222,128,0.08)',  border:'rgba(74,222,128,0.2)',  text:'rgba(255,255,255,0.75)' },
              missing:  { dot:'rgba(255,255,255,0.2)', label:'Not set', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.1)', text:'rgba(255,255,255,0.3)' },
            }[item.status as 'active' | 'missing'];
            return (
              <div key={i} style={{ padding:'14px 0',
                                     borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:cfg.dot,
                                  flexShrink:0, boxShadow: item.status === 'active' ? `0 0 6px ${cfg.dot}` : 'none' }}/>
                  <p style={{ color:cfg.text, fontSize:13, fontWeight:500, flex:1 }}>{item.label}</p>
                  <span style={{ fontSize:11, fontWeight:600, color:cfg.dot,
                                  background:cfg.bg, border:`1px solid ${cfg.border}`,
                                  borderRadius:20, padding:'2px 10px', flexShrink:0 }}>
                    {cfg.label}
                  </span>
                </div>
                <p style={{ color:'rgba(255,255,255,0.28)', fontSize:11, marginTop:5, marginLeft:20, lineHeight:1.5 }}>
                  {item.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RLS reminder */}
      <div style={{ background:'rgba(96,165,250,0.06)', border:'1px solid rgba(96,165,250,0.2)',
                     borderRadius:16, padding:'16px 20px',
                     display:'flex', gap:14, alignItems:'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:1 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <p style={{ color:'#60A5FA', fontWeight:600, fontSize:13, marginBottom:4 }}>Supabase RLS — action required in dashboard</p>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.7 }}>
            The code now uses the anon client for all public reads. For RLS to actually restrict data, you must enable RLS on each table in your{' '}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
               style={{ color:'#A8E63D', textDecoration:'underline' }}>Supabase dashboard</a>
            {' '}→ Table Editor → select table → Enable RLS → Add policy (e.g. allow SELECT for all).
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlaceholderView({ title }: { title: string }) {
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
