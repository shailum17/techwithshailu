'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Job' | 'Internship' | 'Full-time';
  salary?: string;
  batch_year?: number;
  deadline?: string;
  tags?: string[];
  is_featured?: boolean;
  createdAt?: string;
}

const LOCATIONS   = ['Remote', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Noida', 'Delhi'];
const BATCH_YEARS = ['2025', '2026', '2027', '2028+'];
const JOB_TYPES   = ['Job', 'Internship', 'Full-time'];

/* ─── #5 Card skeleton ─────────────────────────────────────── */
function JobCardSkeleton() {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="skeleton-dark w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-dark h-4 w-3/4 rounded" />
          <div className="skeleton-dark h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton-dark h-5 w-16 rounded-full" />
        <div className="skeleton-dark h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton-dark h-3 w-1/3 rounded" />
      <div className="border-t border-white/10 pt-3 flex gap-2">
        <div className="skeleton-dark h-5 w-12 rounded-md" />
        <div className="skeleton-dark h-5 w-14 rounded-md" />
        <div className="skeleton-dark h-5 w-10 rounded-md" />
      </div>
    </div>
  );
}

/* ─── #4 Custom lime checkbox ──────────────────────────────── */
function LimeCheckbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group select-none">
      {/* Custom checkbox */}
      <span
        onClick={onChange}
        className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center
                    transition-all duration-150 ${
                      checked
                        ? 'bg-lime border-lime'
                        : 'border-white/20 bg-white/5 group-hover:border-lime/60'
                    }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-sm text-white/60 group-hover:text-white transition-colors flex-1">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-white/30 tabular-nums">{count}</span>
      )}
    </label>
  );
}

/* ─── #4 Custom lime radio ─────────────────────────────────── */
function LimeRadio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group select-none">
      <span
        onClick={onChange}
        className={`w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center
                    transition-all duration-150 ${
                      checked
                        ? 'border-lime'
                        : 'border-white/20 bg-white/5 group-hover:border-lime/60'
                    }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-lime" />}
      </span>
      <span className="text-sm text-white/60 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}

/* ─── #2 Job card with glow hover ──────────────────────────── */
function JobCard({ job }: { job: Job }) {
  const [bookmarked, setBookmarked] = useState(false);
  const isNew = job.createdAt
    ? Date.now() - new Date(job.createdAt).getTime() < 24 * 3600 * 1000
    : false;

  return (
    <Link href={`/jobs/${job._id}`} className="block h-full">
      <div
        className="group relative rounded-2xl p-5 flex flex-col gap-3 h-full cursor-pointer
                   transition-all duration-300 hover:-translate-y-1"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.border = '1px solid rgba(168,230,61,0.5)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(168,230,61,0.15)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        }}
      >
        {/* Bookmark */}
        <button
          onClick={e => { e.preventDefault(); setBookmarked(!bookmarked); }}
          className="absolute top-4 right-4 text-white/30 hover:text-lime transition-colors z-10"
          aria-label="Bookmark"
        >
          <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center
                          text-lime font-bold text-sm font-poppins transition-colors"
               style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.2)' }}>
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-poppins font-semibold text-white text-sm truncate
                           group-hover:text-lime transition-colors">
              {job.title}
            </h3>
            <p className="text-white/50 text-xs mt-0.5">{job.company}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {(isNew || job.is_featured) && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{ background: '#A8E63D', color: '#000' }}>
              {isNew ? 'NEW' : 'TOP'}
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(168,230,61,0.12)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.25)' }}>
            {job.type}
          </span>
          {job.location.toLowerCase().includes('remote') && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(168,230,61,0.12)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.25)' }}>
              Remote
            </span>
          )}
          {/* Purple pill salary */}
          {job.salary && (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(106,76,195,0.2)', color: '#A78BFA', border: '1px solid rgba(106,76,195,0.35)' }}>
              {job.salary}
            </span>
          )}
        </div>

        {/* Location + batch */}
        <div className="flex items-center gap-3 text-white/40 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          {job.batch_year && <span>Batch {job.batch_year}</span>}
        </div>

        {/* Skill tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 mt-auto"
               style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {job.tags.slice(0, 4).map(tag => (
              <span key={tag}
                className="text-xs text-white/50 px-2 py-0.5 rounded-md transition-colors
                           hover:text-lime"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Sidebar filters panel ────────────────────────────────── */
function FiltersPanel({
  q, setQ, locations, toggleLoc, setLocations,
  batchYears, toggleBatch, setBatchYears,
  jobType, setJobType,
  showMore, setShowMore,
  clearAll, base,
}: {
  q: string; setQ: (v: string) => void;
  locations: string[]; toggleLoc: (v: string) => void; setLocations: (v: string[]) => void;
  batchYears: string[]; toggleBatch: (v: string) => void; setBatchYears: (v: string[]) => void;
  jobType: string; setJobType: (v: string) => void;
  showMore: boolean; setShowMore: (v: boolean) => void;
  clearAll: () => void; base: Job[];
}) {
  const visibleLocs = showMore ? LOCATIONS : LOCATIONS.slice(0, 5);
  return (
    <div className="rounded-2xl p-5 space-y-6"
         style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between">
        <p className="font-poppins font-semibold text-white">Filters</p>
        <button onClick={clearAll}
          className="text-xs text-lime hover:text-lime-bright transition-colors font-medium">
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
        </svg>
        <input type="text" value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search jobs..."
          className="w-full rounded-lg pl-9 pr-3 py-2 text-white placeholder-white/30 text-sm
                     focus:outline-none transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
      </div>

      {/* Location */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.1em] mb-2">Location</p>
        <LimeCheckbox
          checked={locations.length === 0}
          onChange={() => setLocations([])}
          label="All Locations"
          count={base.length}
        />
        {visibleLocs.map(l => (
          <LimeCheckbox
            key={l}
            checked={locations.includes(l)}
            onChange={() => toggleLoc(l)}
            label={l}
            count={base.filter(j => j.location.includes(l)).length}
          />
        ))}
        <button onClick={() => setShowMore(!showMore)}
          className="text-xs text-lime hover:text-lime-bright transition-colors mt-1 font-medium">
          {showMore ? 'Show less' : 'Show more'}
        </button>
      </div>

      {/* Batch year */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.1em] mb-2">Batch Year</p>
        <LimeCheckbox
          checked={batchYears.length === 0}
          onChange={() => setBatchYears([])}
          label="All Years"
          count={base.length}
        />
        {BATCH_YEARS.map(y => (
          <LimeCheckbox
            key={y}
            checked={batchYears.includes(y)}
            onChange={() => toggleBatch(y)}
            label={y}
            count={base.filter(j => j.batch_year && String(j.batch_year) === y).length}
          />
        ))}
      </div>

      {/* Job type */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.1em] mb-2">Job Type</p>
        <LimeRadio checked={jobType === ''} onChange={() => setJobType('')} label="All Types" />
        {JOB_TYPES.map(t => (
          <LimeRadio key={t} checked={jobType === t} onChange={() => setJobType(t)} label={t} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function JobsClient({ initialJobs, initialParams }: {
  initialJobs: Job[];
  initialParams: { q?: string; type?: string; location?: string; batch_year?: string; sort?: string };
}) {
  const base = initialJobs;

  const [q,          setQ]          = useState(initialParams.q || '');
  const [locations,  setLocations]  = useState<string[]>(initialParams.location ? [initialParams.location] : []);
  const [batchYears, setBatchYears] = useState<string[]>(initialParams.batch_year ? [initialParams.batch_year] : []);
  const [jobType,    setJobType]    = useState(initialParams.type || '');
  const [sort,       setSort]       = useState(initialParams.sort || 'newest');
  const [showMore,   setShowMore]   = useState(false);
  const [loading,    setLoading]    = useState(false);

  /* ─── #8 Mobile filter drawer state ─── */
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleLoc   = (l: string) => setLocations(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const toggleBatch = (y: string) => setBatchYears(p => p.includes(y) ? p.filter(x => x !== y) : [...p, y]);
  const clearAll    = () => { setQ(''); setLocations([]); setBatchYears([]); setJobType(''); };

  /* Simulate loading when filters change */
  const handleFilterChange = (fn: () => void) => {
    setLoading(true);
    fn();
    setTimeout(() => setLoading(false), 400);
  };

  const jobs = base
    .filter(j => !q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()))
    .filter(j => locations.length === 0 || locations.some(l => j.location.toLowerCase().includes(l.toLowerCase())))
    .filter(j => batchYears.length === 0 || (j.batch_year && batchYears.includes(String(j.batch_year))))
    .filter(j => !jobType || j.type === jobType)
    .sort((a, b) => sort === 'deadline'
      ? (a.deadline || '').localeCompare(b.deadline || '')
      : (b.createdAt || '').localeCompare(a.createdAt || ''));

  /* #7 Stagger variants */
  const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const filterProps = {
    q, setQ: (v: string) => handleFilterChange(() => setQ(v)),
    locations,
    toggleLoc: (v: string) => handleFilterChange(() => toggleLoc(v)),
    setLocations: (v: string[]) => handleFilterChange(() => setLocations(v)),
    batchYears,
    toggleBatch: (v: string) => handleFilterChange(() => toggleBatch(v)),
    setBatchYears: (v: string[]) => handleFilterChange(() => setBatchYears(v)),
    jobType,
    setJobType: (v: string) => handleFilterChange(() => setJobType(v)),
    showMore, setShowMore, clearAll, base,
  };

  const activeFilterCount = (locations.length > 0 ? 1 : 0)
    + (batchYears.length > 0 ? 1 : 0)
    + (jobType ? 1 : 0)
    + (q ? 1 : 0);

  return (
    <div className="pt-20 min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-white/40 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/70">Jobs</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersPanel {...filterProps} />
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="font-poppins font-bold text-2xl text-white">Explore Jobs</h1>
              <p className="text-white/50 text-sm mt-1">
                Discover opportunities and launch your dream career.
              </p>
            </div>

            {/* Results bar + mobile filter button */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <p className="text-white/40 text-sm">
                  <span className="text-lime font-semibold">{jobs.length}</span>
                  <span className="text-white/40"> jobs found</span>
                </p>

                {/* Mobile filter button */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm font-medium
                             text-white/50 hover:text-white rounded-lg px-3 py-1.5
                             transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 4h18M7 8h10M11 12h4" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                          style={{ background: '#A8E63D', color: '#000' }}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none cursor-pointer"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="newest">Most Recent</option>
                <option value="deadline">Deadline Soon</option>
              </select>
            </div>

            {/* Skeleton or real grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : jobs.length > 0 ? (
                <motion.div
                  key={`${q}-${locations.join()}-${batchYears.join()}-${jobType}-${sort}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {jobs.map(job => (
                    <motion.div key={job._id} variants={cardVariants}>
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl p-12 text-center"
                  style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="font-poppins font-semibold text-white text-lg mb-2">
                    No jobs found
                  </p>
                  <p className="text-white/50 text-sm mb-4">
                    Try adjusting your filters.
                  </p>
                  <button onClick={clearAll} className="btn-lime text-sm py-2 px-6">
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl max-h-[85vh] overflow-y-auto"
              style={{ background: '#111111', boxShadow: '0 -4px 30px rgba(0,0,0,0.5)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <div className="flex items-center justify-between px-5 py-3"
                   style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-poppins font-semibold text-white">Filters</p>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-5 pb-6">
                <FiltersPanel {...filterProps} />
              </div>
              <div className="sticky bottom-0 px-5 py-4"
                   style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="btn-lime w-full py-3 text-sm"
                >
                  Show {jobs.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
