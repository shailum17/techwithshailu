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

const jobTypes = ['Job', 'Internship', 'Full-time'];
const locations = ['Remote', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi', 'Chennai'];
const batchYears = ['2024', '2025', '2026', '2027'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'deadline', label: 'Deadline Soon' },
];

export default function JobFilters({ current }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [q, setQ]                = useState(current.q || '');
  const [type, setType]          = useState(current.type || '');
  const [location, setLocation]  = useState(current.location || '');
  const [batch, setBatch]        = useState(current.batch_year || '');
  const [sort, setSort]          = useState(current.sort || 'newest');

  function applyFilters() {
    const params = new URLSearchParams();
    if (q)        params.set('q', q);
    if (type)     params.set('type', type);
    if (location) params.set('location', location);
    if (batch)    params.set('batch_year', batch);
    if (sort)     params.set('sort', sort);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearFilters() {
    setQ(''); setType(''); setLocation(''); setBatch(''); setSort('newest');
    startTransition(() => router.push(pathname));
  }

  return (
    <div className="glass-card p-5 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <p className="font-poppins font-semibold text-white text-sm">Filters</p>
        <button
          onClick={clearFilters}
          className="text-xs text-gray-400 hover:text-lime transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Search</label>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Job title, company..."
          className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm
                     text-white placeholder-gray-500 focus:outline-none focus:border-lime/50"
        />
      </div>

      {/* Job type */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Type</label>
        <div className="flex flex-col gap-1.5">
          {jobTypes.map((t) => (
            <button
              key={t}
              onClick={() => setType(type === t ? '' : t)}
              className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                type === t
                  ? 'bg-lime/15 border-lime/30 text-lime'
                  : 'border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm
                     text-white focus:outline-none focus:border-lime/50"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Batch year */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Batch Year</label>
        <div className="flex flex-wrap gap-1.5">
          {batchYears.map((y) => (
            <button
              key={y}
              onClick={() => setBatch(batch === y ? '' : y)}
              className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                batch === y
                  ? 'bg-purple-brand/20 border-purple-brand/40 text-purple-light'
                  : 'border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm
                     text-white focus:outline-none focus:border-lime/50"
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
