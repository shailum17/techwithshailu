'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface JobCardProps {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Job' | 'Internship' | 'Full-time';
  salary?: string;
  batch_year?: number;
  deadline?: string | Date;
  tags?: string[];
  is_featured?: boolean;
  createdAt?: string | Date;
}

function isNew(createdAt?: string | Date): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 24 * 3600 * 1000;
}

function Countdown({ deadline }: { deadline: string | Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setTimeLeft(`${d}d ${h}h ${m}m left`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!timeLeft || timeLeft === 'Expired') return null;
  const isUrgent = new Date(deadline).getTime() - Date.now() < 3 * 24 * 3600 * 1000;

  return (
    <p className={`text-xs font-mono mt-2 ${isUrgent ? 'text-red-500' : 'text-ink-faint'}`}>
      {timeLeft}
    </p>
  );
}

export default function JobCard({
  _id, title, company, location, type,
  salary, batch_year, deadline, tags = [], is_featured, createdAt,
}: JobCardProps) {
  const jobIsNew = isNew(createdAt);
  const showCountdown = deadline &&
    new Date(deadline).getTime() - Date.now() < 3 * 24 * 3600 * 1000;

  return (
    <Link href={`/jobs/${_id}`} className="block h-full">
      <article
        className="group relative bg-white border border-surface-border rounded-2xl p-5
                   h-full flex flex-col shadow-card
                   hover:border-lime/40 hover:shadow-card-hover hover:-translate-y-1
                   transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-surface-tertiary border border-surface-border
                          flex items-center justify-center text-lime font-bold text-sm font-poppins
                          flex-shrink-0 group-hover:bg-lime-light transition-colors">
            {company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-poppins font-semibold text-ink text-sm leading-tight truncate
                           group-hover:text-lime transition-colors">
              {title}
            </h3>
            <p className="text-ink-muted text-xs mt-0.5 truncate">{company}</p>
          </div>
          {jobIsNew
            ? <span className="badge-new flex-shrink-0">NEW</span>
            : is_featured
              ? <span className="badge-featured flex-shrink-0">TOP</span>
              : null
          }
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="tag-lime">{type}</span>
          {location.toLowerCase().includes('remote') && <span className="tag-lime">Remote</span>}
          {salary && <span className="tag-purple">{salary}</span>}
        </div>

        {/* Location + batch */}
        <div className="flex items-center gap-3 text-ink-faint text-xs mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {location}
          </span>
          {batch_year && <span>Batch {batch_year}</span>}
        </div>

        {/* Skill tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-surface-border">
            {tags.slice(0, 4).map(tag => (
              <span key={tag}
                className="text-xs text-ink-muted bg-surface-tertiary px-2 py-0.5 rounded-md
                           hover:bg-lime-light hover:text-lime transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        )}

        {showCountdown && deadline && <Countdown deadline={deadline} />}
      </article>
    </Link>
  );
}
