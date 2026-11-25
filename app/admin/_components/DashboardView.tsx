'use client';

/* Dashboard overview. */

import { useState, useEffect } from 'react';
import { Card, statusBadge } from './shared';

export const STATS: { label: string; value: string; delta: string; color: string }[] = [];
export const RECENT_JOBS: { title: string; company: string; type: string; stipend: string; status: string; deadline: string }[] = [];
export const ACTIVITY: { dot: string; text: string; time: string }[] = [];
export const TRAFFIC: { label: string; pct: number; color: string }[] = [];

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
   ═══════════════════════════════════════════════════════════════ */
export function DashboardView({ pendingCount, onGoToPending }: { pendingCount: number; onGoToPending: () => void }) {
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
