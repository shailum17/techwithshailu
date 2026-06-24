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

/* ── Placeholder jobs matching §12.4 mockup ─────────────────── */
const PLACEHOLDER_JOBS: Job[] = [
  { _id: 'j1', title: 'Software Engineering Intern', company: 'Google',    location: 'Remote',     type: 'Internship', salary: '₹50K–₹80K/mo', tags: ['Python','ML','GCP'],       is_featured: true,  batch_year: 2026 },
  { _id: 'j2', title: 'Software Developer Intern',   company: 'Microsoft', location: 'Hyderabad',  type: 'Internship', salary: '₹60K–₹90K/mo', tags: ['C#','Azure','.NET'],       is_featured: true,  batch_year: 2026 },
  { _id: 'j3', title: 'SDE Intern',                  company: 'Amazon',    location: 'Bengaluru',  type: 'Internship', salary: '₹45K–₹70K/mo', tags: ['Java','AWS','DSA'],        is_featured: false, batch_year: 2025 },
  { _id: 'j4', title: 'Ninja Intern',                company: 'TCS',       location: 'Pune',       type: 'Internship', salary: '₹30K–₹50K/mo', tags: ['Java','SQL','Spring'],     is_featured: false, batch_year: 2025 },
  { _id: 'j5', title: 'Backend Developer Intern',    company: 'LinkedIn',  location: 'Remote',     type: 'Internship', salary: '₹60K–₹90K/mo', tags: ['Node.js','GraphQL','AWS'], is_featured: true,  batch_year: 2026 },
  { _id: 'j6', title: 'Software Engineering Intern', company: 'JPMorgan',  location: 'Mumbai',     type: 'Internship', salary: '₹55K–₹85K/mo', tags: ['Java','Spring','DSA'],     is_featured: false, batch_year: 2026 },
  { _id: 'j7', title: 'Data Analyst Intern',         company: 'ZS Associates', location: 'Pune',  type: 'Internship', salary: '₹40K–₹60K/mo', tags: ['Python','SQL','Excel'],    is_featured: false, batch_year: 2025 },
  { _id: 'j8', title: 'Software Intern',             company: 'Paytm',     location: 'Noida',      type: 'Internship', salary: '₹35K–₹55K/mo', tags: ['Java','Android','SQL'],    is_featured: false, batch_year: 2025 },
  { _id: 'j9', title: 'SWE Intern',                  company: 'Ola',       location: 'Bengaluru',  type: 'Internship', salary: '₹40K–₹60K/mo', tags: ['React','Node.js','AWS'],   is_featured: false, batch_year: 2026 },
];

const LOCATIONS  = ['Remote', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Noida', 'Delhi', 'Chennai'];
const BATCH_YEARS = ['2025', '2026', '2027', '2028+'];
const JOB_TYPES  = ['Job', 'Internship', 'Full-time'];

/* ── Animated job card ──────────────────────────────────────── */
function JobCard({ job }: { job: Job }) {
  const [bookmarked, setBookmarked] = useState(false);

  const isNew = job.createdAt
    ? Date.now() - new Date(job.createdAt).getTime() < 24 * 3600 * 1000
    : false;

  return (
    <Link href={`/jobs/${job._id}`} className="block">
      <div className="group relative glass-card p-5 flex flex-col gap-3 h-full
                      hover:border-lime/40 hover:shadow-[0_0_24px_rgba(168,230,61,0.18)]
                      hover:-translate-y-1 transition-all duration-300 cursor-pointer">

        {/* Bookmark */}
        <button
          onClick={e => { e.preventDefault(); setBookmarked(!bookmarked); }}
          className="absolute top-4 right-4 text-gray-600 hover:text-lime transition-colors"
          aria-label="Bookmark job"
        >
          <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-6">
          {/* Company logo placeholder */}
          <div className="w-10 h-10 rounded-xl bg-dark-border flex-shrink-0
                          flex items-center justify-center text-lime font-bold text-sm font-poppins
                          group-hover:shadow-lime-glow transition-shadow">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-poppins font-semibold text-white text-sm truncate
                           group-hover:text-lime transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">{job.company}</p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          {(isNew || job.is_featured) && (
            <span className="badge-new">{isNew ? 'NEW' : '⭐'}</span>
          )}
          <span className="tag-lime">{job.type}</span>
          {job.location.toLowerCase().includes('remote') && (
            <span className="tag-lime">Remote</span>
          )}
          {job.salary && (
            <span className="tag-purple">{job.salary}</span>
          )}
        </div>

        {/* Location + batch */}
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          {job.batch_year && <span>Batch {job.batch_year}</span>}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 mt-auto border-t border-white/5">
            {job.tags.slice(0, 4).map(tag => (
              <span key={tag}
                className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-md
                           hover:bg-lime/15 hover:text-lime transition-colors">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Main client component ──────────────────────────────────── */
export default function JobsClient({
  initialJobs,
  initialParams,
}: {
  initialJobs: Job[];
  initialParams: { q?: string; type?: string; location?: string; batch_year?: string; sort?: string };
}) {
  const base = initialJobs.length > 0 ? initialJobs : PLACEHOLDER_JOBS;

  const [q, setQ]               = useState(initialParams.q || '');
  const [locations, setLocations] = useState<string[]>(
    initialParams.location ? [initialParams.location] : []
  );
  const [batchYears, setBatchYears] = useState<string[]>(
    initialParams.batch_year ? [initialParams.batch_year] : []
  );
  const [jobType, setJobType]   = useState(initialParams.type || '');
  const [sort, setSort]         = useState(initialParams.sort || 'newest');
  const [showMoreLoc, setShowMoreLoc] = useState(false);

  /* Filter locally */
  const jobs = base
    .filter(j => !q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()))
    .filter(j => locations.length === 0 || locations.some(l => j.location.toLowerCase().includes(l.toLowerCase())))
    .filter(j => batchYears.length === 0 || (j.batch_year && batchYears.includes(String(j.batch_year))))
    .filter(j => !jobType || j.type === jobType)
    .sort((a, b) => sort === 'deadline'
      ? (a.deadline || '').localeCompare(b.deadline || '')
      : (b.createdAt || '').localeCompare(a.createdAt || '')
    );

  const toggleLoc = (loc: string) =>
    setLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);

  const toggleBatch = (y: string) =>
    setBatchYears(prev => prev.includes(y) ? prev.filter(b => b !== y) : [...prev, y]);

  const clearAll = () => { setQ(''); setLocations([]); setBatchYears([]); setJobType(''); };

  const visibleLocs = showMoreLoc ? LOCATIONS : LOCATIONS.slice(0, 5);

  const cardVariants = {
    hidden:  { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Jobs</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Left sidebar (§12.4) ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="glass-card p-5 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-poppins font-semibold text-white">Filters</p>
                <button onClick={clearAll} className="text-xs text-purple-light hover:text-purple-brand transition-colors">
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                </svg>
                <input type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-full bg-dark-card border border-white/10 rounded-lg pl-9 pr-3 py-2
                             text-white placeholder-gray-500 text-sm focus:outline-none focus:border-lime/50" />
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</p>
                {[{ label: 'All Locations', value: '' }, ...visibleLocs.map(l => ({ label: l, value: l }))].map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                    <input type="checkbox"
                      checked={value === '' ? locations.length === 0 : locations.includes(value)}
                      onChange={() => value === '' ? setLocations([]) : toggleLoc(value)}
                      className="accent-lime" />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors flex-1">{label}</span>
                    <span className="text-xs text-gray-600">
                      {value === '' ? base.length : base.filter(j => j.location.includes(value)).length}
                    </span>
                  </label>
                ))}
                <button onClick={() => setShowMoreLoc(!showMoreLoc)}
                  className="text-xs text-lime hover:text-lime-bright transition-colors mt-1">
                  {showMoreLoc ? 'Show less ↑' : 'Show more ↓'}
                </button>
              </div>

              {/* Batch year */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Batch Year</p>
                {[{ label: 'All Years', value: '' }, ...BATCH_YEARS.map(y => ({ label: y, value: y }))].map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                    <input type="checkbox"
                      checked={value === '' ? batchYears.length === 0 : batchYears.includes(value)}
                      onChange={() => value === '' ? setBatchYears([]) : toggleBatch(value)}
                      className="accent-lime" />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors flex-1">{label}</span>
                    <span className="text-xs text-gray-600">
                      {value === '' ? base.length : base.filter(j => j.batch_year && String(j.batch_year) === value).length}
                    </span>
                  </label>
                ))}
              </div>

              {/* Job type */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job Type</p>
                {[{ label: 'All Types', value: '' }, ...JOB_TYPES.map(t => ({ label: t, value: t }))].map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                    <input type="radio" name="jobType" value={value}
                      checked={jobType === value}
                      onChange={() => setJobType(value)}
                      className="accent-lime" />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="font-poppins font-bold text-2xl text-white">Explore Jobs</h1>
              <p className="text-gray-400 text-sm mt-1">Discover opportunities and launch your dream career.</p>
            </div>

            {/* Results + sort */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-400 text-sm">
                <span className="text-lime font-semibold">{jobs.length}</span> jobs found
              </p>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="bg-dark-card border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm
                           focus:outline-none focus:border-lime/50 cursor-pointer">
                <option value="newest">Most Recent</option>
                <option value="deadline">Deadline Soon</option>
              </select>
            </div>

            {/* Job cards */}
            <AnimatePresence mode="wait">
              {jobs.length > 0 ? (
                <motion.div
                  key={`${q}-${locations.join()}-${batchYears.join()}-${jobType}`}
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {jobs.map(job => (
                    <motion.div key={job._id} variants={cardVariants}>
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="font-poppins font-semibold text-white text-lg mb-2">No jobs found</p>
                  <button onClick={clearAll} className="text-lime hover:underline text-sm">
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
