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

const inputClass = `w-full bg-surface-tertiary border border-surface-border rounded-lg px-3 py-2
                    text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-lime/50`;

export default function JobFilters({ current }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [q,        setQ]        = useState(current.q        || '');
  const [type,     setType]     = useState(current.type     || '');
  const [location, setLocation] = useState(current.location || '');
  const [batch,    setBatch]    = useState(current.batch_year || '');
  const [sort,     setSort]     = useState(current.sort     || 'newest');

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
    <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card
                    space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <p className="font-poppins font-semibold text-ink text-sm">Filters</p>
        <button onClick={clearFilters}
          className="text-xs text-purple-brand hover:text-purple-dark transition-colors">
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-2">Search</label>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyFilters()}
          placeholder="Job title, company..."
          className={inputClass}
        />
      </div>

      {/* Job type */}
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-2">Type</label>
        <div className="flex flex-col gap-1.5">
          {jobTypes.map(t => (
            <button key={t} onClick={() => setType(type === t ? '' : t)}
              className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                type === t
                  ? 'bg-lime-light border-lime/40 text-lime font-medium'
                  : 'border-surface-border text-ink-muted hover:border-ink-faint hover:text-ink'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-2">Location</label>
        <select value={location} onChange={e => setLocation(e.target.value)} className={inputClass}>
          <option value="">All Locations</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Batch year */}
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-2">Batch Year</label>
        <div className="flex flex-wrap gap-1.5">
          {batchYears.map(y => (
            <button key={y} onClick={() => setBatch(batch === y ? '' : y)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                batch === y
                  ? 'bg-purple-tint border-purple-brand/40 text-purple-brand font-medium'
                  : 'border-surface-border text-ink-muted hover:border-ink-faint hover:text-ink'
              }`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-2">Sort By</label>
        <select value={sort} onChange={e => setSort(e.target.value)} className={inputClass}>
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
