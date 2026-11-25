'use client';

/* Supabase connection / configuration panel. */

import { useState, useEffect } from 'react';
import { Card } from './shared';

/* ═══════════════════════════════════════════════════════════════
   DATABASE VIEW
   ═══════════════════════════════════════════════════════════════ */
export function DatabaseView() {
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
  useEffect(() => { testConnection(); }, []);  

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
