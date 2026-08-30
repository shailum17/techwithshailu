'use client';

/**
 * app/admin/jobs/pending/page.tsx
 *
 * Admin panel — Pending Jobs Review
 * Approve ✅ → moves to live jobs table
 * Reject  ❌ → permanently deleted
 *
 * Protected by admin key stored in sessionStorage (same pattern as main admin panel).
 */

import { useEffect, useState } from 'react';

/* ── types ─────────────────────────────────────────────────── */
interface PendingJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  description: string;
  apply_link: string;
  source: string;
  fetched_at: string;
  status: string;
}

/* ── shared styles (matches main admin) ─────────────────────── */
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

/* ── login screen ────────────────────────────────────────────── */
function LoginScreen({ onAuth }: { onAuth: (k: string) => void }) {
  const [key, setKey] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
      <div style={{
        background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 360,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div className="flex items-center gap-2.5 mb-8">
          <span className="font-poppins font-bold text-lg text-lime">techwithshailu</span>
          <span style={{
            background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.25)',
            color: '#A8E63D', fontSize: 10, padding: '2px 8px', borderRadius: 20,
            fontWeight: 700, letterSpacing: '0.06em',
          }}>ADMIN</span>
        </div>
        <h2 className="font-poppins font-bold text-white mb-2" style={{ fontSize: 20 }}>Pending Jobs</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>
          Enter your admin key to review pending jobs.
        </p>
        <form onSubmit={e => { e.preventDefault(); onAuth(key); }}>
          <input type="password" placeholder="Admin secret key" value={key}
            onChange={e => setKey(e.target.value)} style={{ ...IS, marginBottom: 12 }} required />
          <button type="submit" className="btn-lime w-full py-3 text-sm">Access Panel</button>
        </form>
      </div>
    </div>
  );
}

/* ── main component ──────────────────────────────────────────── */
export default function PendingJobsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [authed, setAuthed]     = useState(false);
  const [jobs, setJobs]         = useState<PendingJob[]>([]);
  const [loading, setLoading]   = useState(false);
  const [toasts, setToasts]     = useState<{ id: string; msg: string; ok: boolean }[]>([]);

  // Try to restore key from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_key');
    if (saved) { setAdminKey(saved); setAuthed(true); }
  }, []);

  // Load pending jobs when authed
  useEffect(() => {
    if (authed) fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  function handleAuth(key: string) {
    sessionStorage.setItem('admin_key', key);
    setAdminKey(key);
    setAuthed(true);
  }

  function toast(msg: string, ok = true) {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs/pending', {
        headers: { 'x-admin-key': adminKey },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        toast('Failed to load pending jobs', false);
      }
    } catch {
      toast('Network error', false);
    } finally {
      setLoading(false);
    }
  }

  async function approve(jobId: string) {
    const res = await fetch('/api/admin/jobs/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) {
      setJobs(j => j.filter(x => x.id !== jobId));
      toast('Job approved & live!');
    } else {
      toast('Approve failed', false);
    }
  }

  async function reject(jobId: string) {
    if (!confirm('Reject and permanently delete this job?')) return;
    const res = await fetch('/api/admin/jobs/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) {
      setJobs(j => j.filter(x => x.id !== jobId));
      toast('Job rejected');
    } else {
      toast('Reject failed', false);
    }
  }

  if (!authed) return <LoginScreen onAuth={handleAuth} />;

  return (
    <div style={{ background: '#080808', minHeight: '100vh', padding: '32px 24px', fontFamily: 'var(--font-outfit)' }}>
      {/* Toast stack */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.ok ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
            border: `1px solid ${t.ok ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
            color: t.ok ? '#4ade80' : '#f87171',
            borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <a href="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>
                ← Admin
              </a>
            </div>
            <h1 className="font-poppins font-bold text-white" style={{ fontSize: 22 }}>
              Pending Jobs
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500, fontSize: 16, marginLeft: 10 }}>
                ({jobs.length})
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>
              Auto-fetched via RapidAPI — review before publishing live.
            </p>
          </div>
          <button onClick={fetchPending} disabled={loading}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '9px 18px',
              fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'Loading…' : '↻ Refresh'}
          </button>
        </div>

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div style={{
            background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 60, textAlign: 'center',
          }}>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 16, marginBottom: 6 }}>
              All caught up!
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              No pending jobs waiting for review.
            </p>
          </div>
        )}

        {/* Job cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobs.map(job => (
            <div key={job.id} style={{
              background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                {/* Left — job info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <h3 className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>
                      {job.title}
                    </h3>
                    {job.type && (
                      <span style={{
                        background: 'rgba(168,230,61,0.1)', color: '#A8E63D',
                        border: '1px solid rgba(168,230,61,0.25)',
                        borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                      }}>
                        {job.type}
                      </span>
                    )}
                    <span style={{
                      background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 20, padding: '2px 10px', fontSize: 11,
                    }}>
                      via {job.source}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{job.company}</span>
                    {job.location && (
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{job.location}</span>
                    )}
                    {job.salary && (
                      <span style={{ color: '#A8E63D', fontSize: 13 }}>{job.salary}</span>
                    )}
                  </div>

                  {job.description && (
                    <p style={{
                      color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.6,
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: 10,
                    }}>
                      {job.description.replace(/<[^>]+>/g, '').slice(0, 300)}…
                    </p>
                  )}

                  {job.apply_link && (
                    <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#A8E63D', fontSize: 12, textDecoration: 'underline' }}>
                      View apply link ↗
                    </a>
                  )}

                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 8 }}>
                    Fetched: {new Date(job.fetched_at).toLocaleString()}
                  </p>
                </div>

                {/* Right — actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => approve(job.id)} style={{
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                    color: '#4ade80', borderRadius: 10, padding: '9px 20px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(74,222,128,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(74,222,128,0.1)')}>
                    Approve
                  </button>
                  <button onClick={() => reject(job.id)} style={{
                    background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                    color: '#f87171', borderRadius: 10, padding: '9px 20px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
