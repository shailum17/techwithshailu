'use client';

/**
 * app/admin/jobs/pending/page.tsx
 *
 * Standalone Pending Jobs Review — /admin/jobs/pending
 * Enhanced design: stats bar, filter bar (search / source / type / sort),
 * improved cards with source colour-coding, NEW badge, hover effects.
 * Approve opens the edit drawer; Reject permanently deletes.
 */

import { useEffect, useState } from 'react';

/* ── types ──────────────────────────────────────────────────── */
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
  status?: string;
}

interface EditDraft {
  id: string; title: string; company: string; location: string;
  type: string; salary: string; apply_link: string; description: string;
  tags: string; deadline: string; batch_year: string; is_featured: boolean;
}

/* ── shared input style ─────────────────────────────────────── */
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

/* ── source colour helper ───────────────────────────────────── */
function srcColor(src: string) {
  if (src === 'unstop')   return { bg: 'rgba(168,230,61,0.1)',  border: 'rgba(168,230,61,0.25)',  color: '#A8E63D' };
  if (src === 'adzuna')   return { bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.25)',  color: '#22D3EE' };
  if (src === 'rapidapi') return { bg: 'rgba(155,127,232,0.1)', border: 'rgba(155,127,232,0.25)', color: '#9B7FE8' };
  return                         { bg: 'rgba(255,255,255,0.05)',border: 'rgba(255,255,255,0.1)',  color: 'rgba(255,255,255,0.4)' };
}

/* ═══════════════════════════════════════════════════════════════
   APPROVE DRAWER
   ═══════════════════════════════════════════════════════════════ */
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
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>
              Review & Edit before Publishing
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>
              Edit any field then hit Confirm &amp; Publish
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: 8, width: 32, height: 32,
            cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {errMsg && (
            <div style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
              color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16,
            }}>
              {errMsg}
            </div>
          )}

          {([
            { k: 'title',      l: 'Job Title',              req: true  },
            { k: 'company',    l: 'Company',                req: true  },
            { k: 'location',   l: 'Location',               req: true  },
            { k: 'salary',     l: 'Salary / Stipend',       req: false },
            { k: 'apply_link', l: 'Apply Link (URL)',        req: true  },
            { k: 'deadline',   l: 'Deadline',               req: false, tp: 'date'   },
            { k: 'batch_year', l: 'Batch Year',             req: false, tp: 'number' },
            { k: 'tags',       l: 'Tags — comma separated', req: false },
          ] as { k: keyof EditDraft; l: string; req: boolean; tp?: string }[]).map(({ k, l, req, tp }) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11,
                fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5,
              }}>
                {l}{req && <span style={{ color: '#f87171' }}> *</span>}
              </label>
              <input type={tp ?? 'text'} value={draft[k] as string}
                onChange={e => set(k, e.target.value)} style={IS} />
            </div>
          ))}

          {/* Type */}
          <div style={{ marginBottom: 12 }}>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11,
              fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5,
            }}>
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
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11,
              fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5,
            }}>
              Description
              <span style={{
                color: 'rgba(255,255,255,0.2)', fontWeight: 400,
                textTransform: 'none', letterSpacing: 0, marginLeft: 6,
              }}>(HTML supported)</span>
            </label>
            <textarea value={draft.description} onChange={e => set('description', e.target.value)}
              rows={16} style={{ ...IS, resize: 'vertical', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', gap: 10, flexShrink: 0, background: '#0E0E0E',
        }}>
          <button onClick={onClose} style={{
            flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: 11,
            fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-outfit)',
          }}>Cancel</button>
          <button onClick={confirm} disabled={saving} className="btn-lime"
            style={{
              flex: 2, padding: 11, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            {saving ? (
              <>
                <span style={{
                  width: 13, height: 13, border: '2px solid rgba(0,0,0,0.2)',
                  borderTopColor: '#080808', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block',
                }}/>
                Publishing…
              </>
            ) : 'Confirm & Publish'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════════════════ */
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
        <h2 className="font-poppins font-bold text-white mb-2" style={{ fontSize: 20 }}>
          Pending Jobs
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>
          Enter your admin key to review pending jobs.
        </p>
        <form onSubmit={e => { e.preventDefault(); onAuth(key); }}>
          <input type="password" placeholder="Admin secret key" value={key}
            onChange={e => setKey(e.target.value)} style={{ ...IS, marginBottom: 12 }} required />
          <button type="submit" className="btn-lime w-full py-3 text-sm">
            Access Panel
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function PendingJobsPage() {
  const [adminKey,   setAdminKey]   = useState('');
  const [authed,     setAuthed]     = useState(false);
  const [jobs,       setJobs]       = useState<PendingJob[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [editDraft,  setEditDraft]  = useState<EditDraft | null>(null);
  const [toasts,     setToasts]     = useState<{ id: string; msg: string; ok: boolean }[]>([]);

  /* ── Filter state ─────────────────────────────────────────── */
  const [search,     setSearch]     = useState('');
  const [srcFilter,  setSrcFilter]  = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy,     setSortBy]     = useState<'newest'|'oldest'|'company'>('newest');

  /* ── Restore key from sessionStorage ─────────────────────── */
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_key');
    if (saved) { setAdminKey(saved); setAuthed(true); }
  }, []);

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
      const res = await fetch('/api/admin/jobs/pending', { headers: { 'x-admin-key': adminKey } });
      if (res.ok) setJobs(await res.json());
      else toast('Failed to load pending jobs', false);
    } catch { toast('Network error', false); }
    finally { setLoading(false); }
  }

  function openEditor(job: PendingJob) {
    setEditDraft({
      id: job.id, title: job.title ?? '', company: job.company ?? '',
      location: job.location ?? 'Remote', type: job.type ?? 'Internship',
      salary: job.salary ?? '', apply_link: job.apply_link ?? '',
      description: job.description ?? '', tags: '', deadline: '', batch_year: '', is_featured: false,
    });
  }

  function handleApproved(jobId: string) {
    setJobs(j => j.filter(x => x.id !== jobId));
    toast('Job approved & live! 🎉');
  }

  async function reject(jobId: string) {
    if (!confirm('Reject and permanently delete this job?')) return;
    const res = await fetch('/api/admin/jobs/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) { setJobs(j => j.filter(x => x.id !== jobId)); toast('Job rejected'); }
    else toast('Reject failed', false);
  }

  /* ── Derived data ─────────────────────────────────────────── */
  const cutoff24   = Date.now() - 24 * 60 * 60 * 1000;
  const freshCount = jobs.filter(j => new Date(j.fetched_at).getTime() >= cutoff24).length;
  const allSources = Array.from(new Set(jobs.map(j => j.source))).sort();
  const allTypes   = Array.from(new Set(jobs.map(j => j.type).filter(Boolean))).sort();
  const srcCounts  = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.source] = (acc[j.source] ?? 0) + 1; return acc;
  }, {});

  const filtered = jobs
    .filter(j => {
      if (srcFilter  !== 'all' && j.source !== srcFilter) return false;
      if (typeFilter !== 'all' && j.type   !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.company.toLowerCase().includes(q) &&
          !(j.location ?? '').toLowerCase().includes(q)
        ) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')  return new Date(b.fetched_at).getTime() - new Date(a.fetched_at).getTime();
      if (sortBy === 'oldest')  return new Date(a.fetched_at).getTime() - new Date(b.fetched_at).getTime();
      return a.company.localeCompare(b.company);
    });

  const hasFilters = search || srcFilter !== 'all' || typeFilter !== 'all';

  if (!authed) return <LoginScreen onAuth={handleAuth} />;

  return (
    <div style={{
      background: '#080808', minHeight: '100vh',
      padding: '32px 24px', fontFamily: 'var(--font-outfit)',
    }}>

      {/* ── Toast stack ── */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.ok ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
            border: `1px solid ${t.ok ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
            color: t.ok ? '#4ade80' : '#f87171',
            borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {t.ok
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── Approve drawer ── */}
      {editDraft && (
        <ApproveDrawer
          draft={editDraft} adminKey={adminKey}
          onChange={setEditDraft} onClose={() => setEditDraft(null)}
          onApproved={handleApproved}
        />
      )}

      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── Page header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 24, gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <a href="/admin" style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 7, padding: '4px 10px',
                transition: 'color 0.15s',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5m7-7-7 7 7 7"/>
                </svg>
                Admin
              </a>
            </div>
            <h1 className="font-poppins font-bold text-white" style={{ fontSize: 24, marginBottom: 4 }}>
              Pending Jobs
              <span style={{
                color: 'rgba(255,255,255,0.25)', fontWeight: 400, fontSize: 16, marginLeft: 10,
              }}>
                ({jobs.length})
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Auto-fetched via Unstop · Adzuna · RapidAPI — review before publishing live.
            </p>
          </div>

          <button onClick={fetchPending} disabled={loading} style={{
            background: loading ? 'rgba(255,255,255,0.03)' : 'rgba(168,230,61,0.08)',
            border: `1px solid ${loading ? 'rgba(255,255,255,0.08)' : 'rgba(168,230,61,0.2)'}`,
            color: loading ? 'rgba(255,255,255,0.3)' : '#A8E63D',
            borderRadius: 10, padding: '10px 18px',
            fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
            transition: 'all 0.15s',
          }}>
            {loading
              ? <><span style={{
                  width: 12, height: 12, border: '2px solid rgba(255,255,255,0.15)',
                  borderTopColor: 'rgba(255,255,255,0.5)', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block',
                }}/>Loading…</>
              : <>↻ Refresh</>
            }
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total Pending', value: jobs.length,        color: '#A8E63D', icon: '📋' },
            { label: 'New (24 h)',    value: freshCount,          color: '#4ade80', icon: '✨' },
            { label: 'Sources',       value: allSources.length,   color: '#22D3EE', icon: '🔗' },
            { label: 'After Filter',  value: filtered.length,     color: '#9B7FE8', icon: '🔍' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{s.icon}</span>
              <div>
                <p style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3,
                }}>
                  {s.label}
                </p>
                <p className="font-poppins font-bold" style={{ fontSize: 22, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Source breakdown chips ── */}
        {allSources.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {allSources.map(src => {
              const sc = srcColor(src);
              return (
                <div key={src} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: sc.bg, border: `1px solid ${sc.border}`,
                  borderRadius: 20, padding: '4px 12px',
                }}>
                  <span style={{ color: sc.color, fontSize: 11, fontWeight: 700 }}>{src}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{srcCounts[src] ?? 0}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Filter bar ── */}
        <div style={{
          background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          marginBottom: 16,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text" placeholder="Search title, company, location…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...IS, paddingLeft: 32, fontSize: 12 }}
            />
          </div>

          {/* Source */}
          <select value={srcFilter} onChange={e => setSrcFilter(e.target.value)}
            style={{ ...IS, width: 'auto', flex: '0 0 auto', fontSize: 12, minWidth: 140 }}>
            <option value="all">All Sources</option>
            {allSources.map(s => (
              <option key={s} value={s}>{s} ({srcCounts[s] ?? 0})</option>
            ))}
          </select>

          {/* Type */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ ...IS, width: 'auto', flex: '0 0 auto', fontSize: 12, minWidth: 130 }}>
            <option value="all">All Types</option>
            {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            style={{ ...IS, width: 'auto', flex: '0 0 auto', fontSize: 12, minWidth: 140 }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="company">Company A–Z</option>
          </select>

          {/* Clear */}
          {hasFilters && (
            <button onClick={() => { setSearch(''); setSrcFilter('all'); setTypeFilter('all'); }}
              style={{
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171', borderRadius: 9, padding: '9px 14px',
                fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5,
              }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Empty state — no jobs at all ── */}
        {!loading && jobs.length === 0 && (
          <div style={{
            background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, padding: '64px 40px', textAlign: 'center',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 18, margin: '0 auto 18px',
              background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8E63D"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 16, marginBottom: 6 }}>
              All caught up!
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              No pending jobs waiting for review.
            </p>
          </div>
        )}

        {/* ── Empty state — filter mismatch ── */}
        {!loading && jobs.length > 0 && filtered.length === 0 && (
          <div style={{
            background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '40px 24px', textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 10 }}>
              No jobs match your filters
            </p>
            <button onClick={() => { setSearch(''); setSrcFilter('all'); setTypeFilter('all'); }}
              style={{
                background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.2)',
                color: '#A8E63D', borderRadius: 8, padding: '7px 16px',
                fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-outfit)',
              }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && jobs.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, height: 120,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}/>
            ))}
          </div>
        )}

        {/* ── Result count when filtered ── */}
        {filtered.length > 0 && hasFilters && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 10 }}>
            Showing {filtered.length} of {jobs.length} pending jobs
          </p>
        )}

        {/* ── Job cards ── */}
        {filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(job => {
              const sc      = srcColor(job.source);
              const isFresh = new Date(job.fetched_at).getTime() >= cutoff24;

              return (
                <div key={job.id} style={{
                  background: 'linear-gradient(135deg, #111 0%, #0E0E0E 100%)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 18, overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,230,61,0.28)';
                  (e.currentTarget as HTMLElement).style.boxShadow  = '0 6px 28px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)';
                  (e.currentTarget as HTMLElement).style.boxShadow  = '0 2px 12px rgba(0,0,0,0.3)';
                }}>

                  {/* Top accent bar — lime for fresh, subtle for older */}
                  <div style={{
                    height: 3,
                    background: isFresh
                      ? 'linear-gradient(90deg, #A8E63D 0%, rgba(168,230,61,0.15) 100%)'
                      : 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                  }}/>

                  <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 }}>

                    {/* ── Left ── */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                      {/* Title + badges */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 9 }}>
                        <p className="font-poppins font-bold text-white" style={{ fontSize: 15, flex: 1, minWidth: 0, lineHeight: 1.35 }}>
                          {job.title}
                        </p>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                          {job.type && (
                            <span style={{
                              background: 'rgba(168,230,61,0.1)', color: '#A8E63D',
                              border: '1px solid rgba(168,230,61,0.25)',
                              borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                            }}>{job.type}</span>
                          )}
                          <span style={{
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                            borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                          }}>{job.source}</span>
                          {isFresh && (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.2)',
                              color: '#A8E63D', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700,
                            }}>
                              <span style={{
                                width: 5, height: 5, borderRadius: '50%', background: '#A8E63D',
                                boxShadow: '0 0 4px #A8E63D', display: 'inline-block',
                              }}/>
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 10 }}>
                        {[
                          { icon: '🏢', val: job.company, lime: false },
                          job.location ? { icon: '📍', val: job.location, lime: false } : null,
                          job.salary   ? { icon: '💰', val: job.salary,   lime: true  } : null,
                        ].filter(Boolean).map((m, i) => (
                          <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            color: m!.lime ? '#A8E63D' : 'rgba(255,255,255,0.5)',
                            fontSize: 13, marginRight: 18,
                          }}>
                            <span style={{ fontSize: 12 }}>{m!.icon}</span>
                            {m!.val}
                          </span>
                        ))}
                      </div>

                      {/* Description preview */}
                      {job.description && (
                        <p style={{
                          color: 'rgba(255,255,255,0.3)', fontSize: 12, lineHeight: 1.65,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          marginBottom: 12,
                          padding: '8px 12px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                          {job.description.replace(/<[^>]+>/g, '').slice(0, 240)}
                        </p>
                      )}

                      {/* Footer row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        {job.apply_link && (
                          <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              color: '#A8E63D', fontSize: 12, textDecoration: 'none',
                              background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.15)',
                              borderRadius: 7, padding: '4px 10px',
                            }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Apply link
                          </a>
                        )}
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                          {new Date(job.fetched_at).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* ── Right: actions ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flexShrink: 0, paddingTop: 2 }}>
                      <button onClick={() => openEditor(job)} style={{
                        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
                        color: '#4ade80', borderRadius: 10, padding: '10px 22px',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-outfit)', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background    = 'rgba(74,222,128,0.2)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor   = 'rgba(74,222,128,0.45)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background    = 'rgba(74,222,128,0.1)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor   = 'rgba(74,222,128,0.25)';
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Approve
                      </button>
                      <button onClick={() => reject(job.id)} style={{
                        background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.18)',
                        color: '#f87171', borderRadius: 10, padding: '10px 22px',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-outfit)', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background    = 'rgba(248,113,113,0.15)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor   = 'rgba(248,113,113,0.35)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background    = 'rgba(248,113,113,0.07)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor   = 'rgba(248,113,113,0.18)';
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
