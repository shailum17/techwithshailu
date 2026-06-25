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
    <p className={`text-xs font-mono mt-2 ${isUrgent ? 'text-red-400' : 'text-ink-faint'}`}>
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
        className="group relative rounded-2xl p-5 h-full flex flex-col cursor-pointer
                   transition-all duration-300 hover:-translate-y-1"
        style={{
          background: '#111111',
          border: '1px solid #2A2A2A',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,230,61,0.5)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(168,230,61,0.12)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.4)';
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center
                          text-lime font-bold text-sm font-poppins flex-shrink-0
                          group-hover:scale-105 transition-transform"
               style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.2)' }}>
            {company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-poppins font-semibold text-ink text-sm leading-tight truncate
                           group-hover:text-lime transition-colors">
              {title}
            </h3>
            <p className="text-ink-muted text-xs mt-0.5 truncate">{company}</p>
          </div>
          {jobIsNew ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0"
                  style={{ background: '#A8E63D', color: '#000' }}>NEW</span>
          ) : is_featured ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0"
                  style={{ background: '#A8E63D', color: '#000' }}>TOP</span>
          ) : null}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="tag-lime">{type}</span>
          {location.toLowerCase().includes('remote') && <span className="tag-lime">Remote</span>}
          {salary && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(155,127,232,0.15)', color: '#B49EF0', border: '1px solid rgba(155,127,232,0.3)' }}>
              {salary}
            </span>
          )}
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
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3"
               style={{ borderTop: '1px solid #2A2A2A' }}>
            {tags.slice(0, 4).map(tag => (
              <span key={tag}
                className="text-xs text-ink-faint px-2 py-0.5 rounded-md transition-colors hover:text-lime"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
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
