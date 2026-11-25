'use client';

/* Manual job fetch, schedule info and run logs. */

import { useState, useEffect } from 'react';
import { IS } from './shared';

/* ═══════════════════════════════════════════════════════════════
   AUTOMATION VIEW — manual search + cron schedule settings
   ═══════════════════════════════════════════════════════════════ */

export const SEARCH_PRESETS = [
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

export const SCHEDULE_OPTIONS = [
  { label: 'Once a day',     cron: '0 7 * * *',    desc: 'Runs at 7:00 AM UTC' },
  { label: 'Twice a day',    cron: '0 7,19 * * *',  desc: 'Runs at 7 AM & 7 PM UTC' },
  { label: 'Every 6 hours',  cron: '0 */6 * * *',   desc: 'Runs 4× a day' },
  { label: 'Custom cron',    cron: 'custom',         desc: 'Set your own cron expression' },
];

export interface RunLog {
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

export function AutomationView() {
  // Manual search state
  const [query,        setQuery]       = useState('software intern india');
  const [customQuery,  setCustomQuery] = useState('');
  const [running,      setRunning]     = useState(false);
  const [logs,         setLogs]        = useState<RunLog[]>([]);
  const [logsLoading,  setLogsLoading] = useState(false);
  const [expandedRaw,  setExpandedRaw] = useState<string | null>(null);

  // ── Fetch filters ─────────────────────────────────────────
  const [filterJobType,  setFilterJobType]  = useState<'all'|'Internship'|'Job'>('all');
  const [filterSource,   setFilterSource]   = useState<'all'|'unstop'|'adzuna'|'rapidapi'>('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMaxDays,  setFilterMaxDays]  = useState<'7'|'14'|'30'|'all'>('30');
  const [showFilters,    setShowFilters]    = useState(false);

  // ── Log filters ───────────────────────────────────────────
  const [logSearch,      setLogSearch]      = useState('');
  const [logStatusFilter,setLogStatusFilter]= useState<'all'|'ok'|'fail'>('all');
  const [logTriggerFilter,setLogTriggerFilter]=useState<'all'|'cron'|'manual'>('all');

  // Load persisted logs from DB on mount
  useEffect(() => {
    loadDbLogs();
  }, []);  

  async function loadDbLogs() {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/admin/logs?limit=50');
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
          ok:           d.status !== 'error',   // 'skipped' (paused) is not a failure
          error:        d.error_message ?? undefined,
          raw_response: d.raw_response  ?? undefined,
        }));
        setLogs(mapped);
      }
    } catch { /* silent */ }
    setLogsLoading(false);
  }

  // Pause/resume is stored server-side (app_settings) and checked by the cron
  // route. The schedule itself is whatever is deployed in vercel.json.
  const [schedEnabled,  setSchedEnabled]  = useState<boolean | null>(null);
  const [deployedCron,  setDeployedCron]  = useState<string | null>(null);
  const [schedSaving,   setSchedSaving]   = useState(false);
  // Frequency picker only generates a vercel.json snippet (needs a redeploy)
  const [schedPreset,   setSchedPreset]   = useState('0 7 * * *');
  const [customCron,    setCustomCron]    = useState('');
  const [schedHour,     setSchedHour]     = useState('07');
  const [savedMsg,      setSavedMsg]      = useState('');

  useEffect(() => {
    fetch('/api/admin/settings/automation')
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => {
        setSchedEnabled(d.enabled !== false);
        setDeployedCron(d.schedule ?? null);
        if (d.schedule) {
          setSchedPreset(d.schedule);
          const hour = d.schedule.split(' ')[1];
          if (/^\d+$/.test(hour ?? '')) setSchedHour(hour.padStart(2, '0'));
        }
      })
      .catch(() => setSchedEnabled(null));
  }, []);

  const isCustomCron = schedPreset === 'custom';
  const activeCron   = isCustomCron ? customCron : schedPreset;

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

  async function toggleAutoFetch() {
    if (schedEnabled === null || schedSaving) return;
    const next = !schedEnabled;
    setSchedSaving(true);
    try {
      const res = await fetch('/api/admin/settings/automation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error ?? `HTTP ${res.status}`);
      setSchedEnabled(d.enabled);
      setSavedMsg(d.enabled ? 'Auto-fetch resumed' : 'Auto-fetch paused — the cron will skip until resumed');
    } catch (e) {
      setSavedMsg(`Could not save: ${e instanceof Error ? e.message : 'error'}`);
    } finally {
      setSchedSaving(false);
      setTimeout(() => setSavedMsg(''), 4000);
    }
  }

  // Build fetch URL with active filters appended
  function buildFetchUrl(searchQuery: string) {
    const params = new URLSearchParams({ q: searchQuery });
    if (filterJobType  !== 'all')  params.set('type',      filterJobType);
    if (filterSource   !== 'all')  params.set('source',    filterSource);
    if (filterLocation.trim())     params.set('location',  filterLocation.trim());
    if (filterMaxDays  !== 'all')  params.set('max_days',  filterMaxDays);
    return `/api/cron/fetch-jobs?${params.toString()}`;
  }

  async function runFetch(searchQuery: string) {
    if (running) return;
    setRunning(true);
    try {
      const res  = await fetch(buildFetchUrl(searchQuery));
      const data = await res.json();
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
  const hasActiveFilters = filterJobType !== 'all' || filterSource !== 'all' || filterLocation.trim() !== '' || filterMaxDays !== '30';

  // Filtered log list
  const filteredLogs = logs.filter(l => {
    if (logStatusFilter  === 'ok'     && !l.ok)                          return false;
    if (logStatusFilter  === 'fail'   &&  l.ok)                          return false;
    if (logTriggerFilter !== 'all'    && l.trigger_type !== logTriggerFilter) return false;
    if (logSearch && !l.query.toLowerCase().includes(logSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Top 2-col grid ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Manual Fetch card */}
        <div style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
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
                  cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.15s',
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

          {/* ── Fetch Filters toggle ── */}
          <button onClick={() => setShowFilters(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: showFilters ? 'rgba(168,230,61,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${showFilters ? 'rgba(168,230,61,0.2)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10, padding: '9px 13px', cursor: 'pointer',
              fontFamily: 'var(--font-outfit)', marginBottom: 10, width: '100%',
              transition: 'all 0.15s',
            }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7,
                           color: showFilters ? '#A8E63D' : 'rgba(255,255,255,0.5)', fontSize: 12 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Fetch Filters
              {hasActiveFilters && (
                <span style={{
                  background: 'rgba(168,230,61,0.15)', color: '#A8E63D',
                  border: '1px solid rgba(168,230,61,0.3)',
                  borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 700,
                }}>
                  {[filterJobType !== 'all', filterSource !== 'all', filterLocation.trim() !== '', filterMaxDays !== '30'].filter(Boolean).length} active
                </span>
              )}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {showFilters
                ? <path d="M18 15l-6-6-6 6"/>
                : <path d="M6 9l6 6 6-6"/>}
            </svg>
          </button>

          {/* ── Filter panel ── */}
          {showFilters && (
            <div style={{
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '16px', marginBottom: 12,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700,
                           letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                Narrow results before fetching
              </p>

              {/* Job type */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                  Job Type
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['all', 'Internship', 'Job'] as const).map(t => (
                    <button key={t} onClick={() => setFilterJobType(t)}
                      style={{
                        background: filterJobType === t ? 'rgba(168,230,61,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${filterJobType === t ? 'rgba(168,230,61,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        color: filterJobType === t ? '#A8E63D' : 'rgba(255,255,255,0.5)',
                        borderRadius: 8, padding: '5px 12px', fontSize: 12,
                        cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.12s',
                      }}>
                      {t === 'all' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                  Source
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {([
                    { v: 'all',       l: 'All Sources', c: 'rgba(255,255,255,0.5)' },
                    { v: 'unstop',    l: 'Unstop',      c: '#A8E63D' },
                    { v: 'adzuna',    l: 'Adzuna',      c: '#22D3EE' },
                    { v: 'rapidapi',  l: 'RapidAPI',    c: '#9B7FE8' },
                  ] as {v:string;l:string;c:string}[]).map(({ v, l, c }) => (
                    <button key={v} onClick={() => setFilterSource(v as typeof filterSource)}
                      style={{
                        background: filterSource === v ? `${c}1a` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${filterSource === v ? `${c}55` : 'rgba(255,255,255,0.08)'}`,
                        color: filterSource === v ? c : 'rgba(255,255,255,0.5)',
                        borderRadius: 8, padding: '5px 12px', fontSize: 12,
                        cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.12s',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                  Location keyword
                </p>
                <input type="text" placeholder="e.g. Bangalore, Remote, Mumbai…"
                  value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
                  style={{ ...IS, fontSize: 12 }}
                />
              </div>

              {/* Max days old */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                  Max age (Adzuna)
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {([
                    { v: '7',  l: '7 days'  },
                    { v: '14', l: '14 days' },
                    { v: '30', l: '30 days' },
                    { v: 'all',l: 'Any'     },
                  ] as {v:string;l:string}[]).map(({ v, l }) => (
                    <button key={v} onClick={() => setFilterMaxDays(v as typeof filterMaxDays)}
                      style={{
                        background: filterMaxDays === v ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${filterMaxDays === v ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: filterMaxDays === v ? '#22D3EE' : 'rgba(255,255,255,0.5)',
                        borderRadius: 8, padding: '5px 12px', fontSize: 12,
                        cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.12s',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active filter summary */}
              {hasActiveFilters && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                               padding: '8px 12px', background: 'rgba(168,230,61,0.04)',
                               border: '1px solid rgba(168,230,61,0.15)', borderRadius: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    {filterJobType !== 'all' && <span style={{ color: '#A8E63D', marginRight: 8 }}>type:{filterJobType}</span>}
                    {filterSource  !== 'all' && <span style={{ color: '#22D3EE', marginRight: 8 }}>src:{filterSource}</span>}
                    {filterLocation.trim() && <span style={{ color: '#9B7FE8', marginRight: 8 }}>loc:{filterLocation}</span>}
                    {filterMaxDays !== '30' && <span style={{ color: '#F59E0B', marginRight: 8 }}>age:{filterMaxDays === 'all' ? 'any' : `${filterMaxDays}d`}</span>}
                  </span>
                  <button onClick={() => { setFilterJobType('all'); setFilterSource('all'); setFilterLocation(''); setFilterMaxDays('30'); }}
                    style={{
                      background: 'none', border: 'none', color: '#f87171',
                      fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                    }}>
                    Clear all
                  </button>
                </div>
              )}
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
                Run Now {hasActiveFilters && '(with filters)'}
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
            <button onClick={toggleAutoFetch} disabled={schedEnabled === null || schedSaving}
              aria-label={schedEnabled ? 'Pause auto-fetch' : 'Resume auto-fetch'}
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
            {schedEnabled === null
              ? 'Loading… (or settings unavailable — apply the app_settings migration)'
              : schedEnabled
              ? `Active — deployed schedule: ${deployedCron ? nextRunLabel(deployedCron) : 'none in vercel.json'}`
              : 'Paused — scheduled runs are skipped (manual searches still work).'}
          </p>

          {/* Frequency presets */}
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Change frequency (generates vercel.json — needs a redeploy)
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

          {/* Hour picker */}
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
              {`"schedule": "${activeCron}"`}
            </code>
          </div>

          {savedMsg && (
            <div style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.25)',
                          color: '#A8E63D', borderRadius: 9, padding: '8px 12px',
                          fontSize: 12, marginBottom: 10 }}>
              {savedMsg}
            </div>
          )}

        </div>
      </div>

      {/* ── Status bar ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Status',      value: schedEnabled === null ? '—' : schedEnabled ? 'Active' : 'Paused',
            color: schedEnabled ? '#4ade80' : '#f87171' },
          { label: 'Schedule',    value: deployedCron ? nextRunLabel(deployedCron) : '—',
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

        {/* Log header + filter row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 14 }}>Run Log</p>
            <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.3)', borderRadius: 20, padding: '2px 9px', fontSize: 11 }}>
              {filteredLogs.length} / {logs.length}
            </span>
          </div>

          {/* Log search */}
          <div style={{ position: 'relative', flex: '1 1 140px', minWidth: 120 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Filter by query…"
              value={logSearch} onChange={e => setLogSearch(e.target.value)}
              style={{ ...IS, paddingLeft: 28, fontSize: 11, padding: '7px 10px 7px 28px' }}
            />
          </div>

          {/* Status filter chips */}
          {(['all', 'ok', 'fail'] as const).map(s => (
            <button key={s} onClick={() => setLogStatusFilter(s)}
              style={{
                background: logStatusFilter === s
                  ? (s === 'ok' ? 'rgba(74,222,128,0.12)' : s === 'fail' ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.08)')
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${logStatusFilter === s
                  ? (s === 'ok' ? 'rgba(74,222,128,0.3)' : s === 'fail' ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.15)')
                  : 'rgba(255,255,255,0.07)'}`,
                color: logStatusFilter === s
                  ? (s === 'ok' ? '#4ade80' : s === 'fail' ? '#f87171' : 'rgba(255,255,255,0.7)')
                  : 'rgba(255,255,255,0.35)',
                borderRadius: 8, padding: '5px 12px', fontSize: 11,
                cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.12s',
              }}>
              {s === 'all' ? 'All' : s === 'ok' ? '✓ OK' : '✗ Failed'}
            </button>
          ))}

          {/* Trigger filter */}
          <select value={logTriggerFilter} onChange={e => setLogTriggerFilter(e.target.value as typeof logTriggerFilter)}
            style={{ ...IS, width: 'auto', fontSize: 11, padding: '6px 10px' }}>
            <option value="all">All triggers</option>
            <option value="cron">Cron only</option>
            <option value="manual">Manual only</option>
          </select>

          <button onClick={loadDbLogs} disabled={logsLoading}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                     fontSize: 12, cursor: logsLoading ? 'not-allowed' : 'pointer',
                     fontFamily: 'var(--font-outfit)', marginLeft: 'auto', flexShrink: 0 }}>
            {logsLoading ? 'Loading…' : '↻ Refresh'}
          </button>
        </div>

        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
              {logsLoading ? 'Loading logs…' : logs.length === 0 ? 'No runs yet. Hit "Run Now" to fetch jobs.' : 'No logs match your filters.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredLogs.map((log, i) => (
              <div key={log.id ?? i}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 10,
                  background: log.ok ? 'rgba(74,222,128,0.04)' : 'rgba(248,113,113,0.04)',
                  border: `1px solid ${log.ok ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)'}`,
                  cursor: log.raw_response ? 'pointer' : 'default',
                  transition: 'background 0.1s',
                }} onClick={() => log.raw_response && setExpandedRaw(expandedRaw === (log.id ?? String(i)) ? null : (log.id ?? String(i)))}>

                  {/* Status badge */}
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
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, flexShrink: 0, minWidth: 130 }}>
                    {log.ts}
                  </span>

                  {/* Query */}
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, flex: 1,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    &ldquo;{log.query}&rdquo;
                  </span>

                  {/* Result */}
                  {log.ok ? (
                    <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {log.fetched}↓ · {log.added}+ · {log.skipped ?? 0} dup
                    </span>
                  ) : (
                    <span style={{ color: '#f87171', fontSize: 12, flexShrink: 0,
                                    maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.error}
                    </span>
                  )}

                  {/* Expand chevron */}
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
                      Raw API Response
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
