'use client';

/* Admin panel shell: auth, navigation and view switching.
   Each view lives in ./_components/. */

import { useState, useEffect } from 'react';
import { AutomationView } from './_components/AutomationView';
import { BlogView } from './_components/BlogView';
import { DashboardView } from './_components/DashboardView';
import { DatabaseView } from './_components/DatabaseView';
import { JobsView } from './_components/JobsView';
import { LoginScreen } from './_components/LoginScreen';
import { AnalyticsView, PlaceholderView, ReportsView, RoadmapsView, SecurityView, SettingsView, UsersView } from './_components/MiscViews';
import { PendingJobsView } from './_components/PendingJobsView';
import { ToolsView } from './_components/ToolsView';
import { AdminBlogPost, Job, Tool, View } from './_components/shared';

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
  // null = still checking for an existing session cookie
  const [authed,   setAuthed]   = useState<boolean | null>(null);
  const [view,     setView]     = useState<View>('dashboard');
  const [jobs,     setJobs]     = useState<Job[]>([]);
  const [tools,    setTools]    = useState<Tool[]>([]);
  const [blogs,    setBlogs]    = useState<AdminBlogPost[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  async function fetchData() {
    setLoading(true);
    // Admin endpoints return drafts / non-live rows that the public API hides
    const asList = async (r: Response) => {
      const d = await r.json().catch(() => []);
      return Array.isArray(d) ? d : [];
    };
    try {
      const [jr, tr, br] = await Promise.all([
        fetch('/api/admin/jobs'), fetch('/api/admin/tools'), fetch('/api/admin/blogs'),
      ]);
      setJobs(await asList(jr));
      setTools(await asList(tr));
      setBlogs(await asList(br));
    } finally {
      setLoading(false);
    }
  }

  async function fetchPendingCount() {
    try {
      const res = await fetch('/api/admin/jobs/pending');
      if (res.ok) { const d = await res.json(); setPendingCount(d.length); }
    } catch { /* silent */ }
  }

  function enterDashboard() {
    setAuthed(true);
    fetchData();
    fetchPendingCount();
  }

  // Restore an existing session (httpOnly cookie) on page load
  useEffect(() => {
    fetch('/api/admin/verify')
      .then(res => (res.ok ? enterDashboard() : setAuthed(false)))
      .catch(() => setAuthed(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Exchanges the key for an httpOnly session cookie. The key itself is not
   * kept anywhere in the page. Returns an error message, or null on success.
   */
  async function handleAuth(k: string): Promise<string | null> {
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: k }),
      });
      if (res.status === 401) return 'Invalid admin key.';
      if (res.status === 429) return 'Too many attempts. Wait a minute and try again.';
      if (!res.ok)            return 'Server error — check ADMIN_SECRET is configured.';
    } catch {
      return 'Cannot reach the server.';
    }
    enterDashboard();
    return null;
  }

  async function logout() {
    await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => {});
    setAuthed(false);
  }

  if (authed === null) {
    return <div className="min-h-screen" style={{ background: '#080808' }} aria-busy="true" />;
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
    blog:       'Write and publish blog posts.',
    database:   'Monitor your Supabase connection and configuration.',
  };

  function renderView() {
    if (view === 'dashboard') return <DashboardView pendingCount={pendingCount} onGoToPending={() => setView('pending')} />;
    if (view === 'jobs')      return <JobsView  jobs={jobs}  loading={loading} onRefresh={fetchData} />;
    if (view === 'pending')    return <PendingJobsView onBadgeUpdate={setPendingCount} />;
    if (view === 'automation') return <AutomationView />;
    if (view === 'tools')     return <ToolsView tools={tools} loading={loading} onRefresh={fetchData} />;
    if (view === 'database')  return <DatabaseView />;
    if (view === 'blog')      return <BlogView blogs={blogs} loading={loading} onRefresh={fetchData} />;
    if (view === 'analytics') return <AnalyticsView />;
    if (view === 'roadmaps')  return <RoadmapsView />;
    if (view === 'users')     return <UsersView />;
    if (view === 'reports')   return <ReportsView />;
    if (view === 'settings')  return <SettingsView />;
    if (view === 'security')  return <SecurityView />;
    return <PlaceholderView title={titles[view]} />;
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808', fontFamily:'var(--font-outfit)' }}>

      {/* ══════════════════════════════════════════════════════
          FLOATING SIDEBAR — gap from edges, rounded card
          ══════════════════════════════════════════════════════ */}
      <aside style={{
        width: 256, flexShrink: 0,
        padding: '16px 0 16px 16px',
        position: 'fixed', top: 0, left: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
        zIndex: 50,
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
              onClick={logout}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: '16px 16px 16px 8px', marginLeft: 256 }}>

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
