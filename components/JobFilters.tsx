'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';

interface JobFiltersProps {
  current: {
    q?: string;
    type?: string;
    location?: string;
    batch_year?: string;
    sort?: string;
  };
}

const jobTypes    = ['Job', 'Internship', 'Full-time'];
const locations   = ['Remote', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi', 'Chennai'];
const batchYears  = ['2024', '2025', '2026', '2027'];
const sortOptions = [
  { value: 'newest',   label: 'Newest First' },
  { value: 'deadline', label: 'Deadline Soon' },
];

const darkInputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#F0F0F0',
  fontSize: '14px',
  outline: 'none',
};

export default function JobFilters({ current }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [q,        setQ]        = useState(current.q         || '');
  const [type,     setType]     = useState(current.type      || '');
  const [location, setLocation] = useState(current.location  || '');
  const [batch,    setBatch]    = useState(current.batch_year || '');
  const [sort,     setSort]     = useState(current.sort      || 'newest');

  function applyFilters() {
    const params = new URLSearchParams();
    if (q)        params.set('q', q);
    if (type)     params.set('type', type);
    if (location) params.set('location', location);
    if (batch)    params.set('batch_year', batch);
    if (sort)     params.set('sort', sort);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function clearFilters() {
    setQ(''); setType(''); setLocation(''); setBatch(''); setSort('newest');
    startTransition(() => router.push(pathname));
  }

  return (
    <div className="rounded-2xl p-5 space-y-5 sticky top-20"
         style={{ background: '#111111', border: '1px solid #2A2A2A', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>

      <div className="flex items-center justify-between">
        <p className="font-poppins font-semibold text-ink text-sm">Filters</p>
        <button onClick={clearFilters}
          className="text-xs text-lime hover:text-lime-bright transition-colors font-medium">
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-ink-faint uppercase tracking-[0.08em] mb-2">Search</label>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyFilters()}
          placeholder="Job title, company..."
          style={darkInputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,230,61,0.5)')}
          onBlur={e => (e.currentTarget.style.borderColor = '#2A2A2A')}
        />
      </div>

      {/* Job type */}
      <div>
        <label className="block text-xs font-semibold text-ink-faint uppercase tracking-[0.08em] mb-2">Type</label>
        <div className="flex flex-col gap-1.5">
          {jobTypes.map(t => (
            <button
              key={t}
              onClick={() => setType(type === t ? '' : t)}
              className="text-left text-sm px-3 py-2 rounded-lg transition-colors"
              style={
                type === t
                  ? { background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.35)', color: '#A8E63D', fontWeight: 500 }
                  : { background: 'transparent', border: '1px solid #2A2A2A', color: '#A0A0A0' }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-ink-faint uppercase tracking-[0.08em] mb-2">Location</label>
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={darkInputStyle}
        >
          <option value="">All Locations</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Batch year */}
      <div>
        <label className="block text-xs font-semibold text-ink-faint uppercase tracking-[0.08em] mb-2">Batch Year</label>
        <div className="flex flex-wrap gap-1.5">
          {batchYears.map(y => (
            <button
              key={y}
              onClick={() => setBatch(batch === y ? '' : y)}
              className="text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={
                batch === y
                  ? { background: 'rgba(155,127,232,0.12)', border: '1px solid rgba(155,127,232,0.35)', color: '#B49EF0', fontWeight: 500 }
                  : { background: 'transparent', border: '1px solid #2A2A2A', color: '#A0A0A0' }
              }
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-ink-faint uppercase tracking-[0.08em] mb-2">Sort By</label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={darkInputStyle}
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <button onClick={applyFilters} className="btn-lime w-full text-sm py-2.5">
        Apply Filters
      </button>
    </div>
  );
}
