'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface JobCardProps {
  id: string;
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
  created_at?: string | Date;
  logo_url?: string;
  logo_domain?: string;
  apply_link?: string;
}

/* ── helpers ───────────────────────────────────────────────── */
function isNew(createdAt?: string | Date, created_at?: string | Date): boolean {
  const ts = createdAt ?? created_at;
  if (!ts) return false;
  return Date.now() - new Date(ts).getTime() < 24 * 3600 * 1000;
}

// Deterministic color from company name — same company always gets same color
const AVATAR_COLORS = [
  { bg: '#1a2e1a', border: 'rgba(168,230,61,0.35)',  text: '#A8E63D' },
  { bg: '#1a1a2e', border: 'rgba(155,127,232,0.35)', text: '#B49EF0' },
  { bg: '#2e1a1a', border: 'rgba(248,113,113,0.35)', text: '#f87171' },
  { bg: '#1a2a2e', border: 'rgba(96,165,250,0.35)',  text: '#60a5fa' },
  { bg: '#2e2a1a', border: 'rgba(251,191,36,0.35)',  text: '#fbbf24' },
  { bg: '#1a2e2a', border: 'rgba(52,211,153,0.35)',  text: '#34d399' },
  { bg: '#2e1a2a', border: 'rgba(244,114,182,0.35)', text: '#f472b6' },
  { bg: '#252525', border: 'rgba(251,146,60,0.35)',  text: '#fb923c' },
];

function avatarColor(company: string) {
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ── Countdown ─────────────────────────────────────────────── */
function Countdown({ deadline }: { deadline: string | Date }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setTimeLeft(d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!timeLeft || timeLeft === 'Expired') return null;
  const isUrgent = new Date(deadline).getTime() - Date.now() < 3 * 24 * 3600 * 1000;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isUrgent ? 'rgba(248,113,113,0.1)' : 'rgba(251,146,60,0.1)',
        color: isUrgent ? '#f87171' : '#fb923c',
        border: `1px solid ${isUrgent ? 'rgba(248,113,113,0.25)' : 'rgba(251,146,60,0.25)'}`,
      }}>
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
      {timeLeft}
    </span>
  );
}

/* ── CompanyLogo ────────────────────────────────────────────── */
function CompanyLogo({ company, logoUrl }: { company: string; logoUrl?: string }) {
  const [failed, setFailed] = useState(false);
  const color    = avatarColor(company);
  const initials = company.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/)
    .map(w => w[0]).join('').toUpperCase().slice(0, 2) || company.slice(0, 2).toUpperCase();

  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const logoDevSrc = (token && token !== 'pk_your_token_here')
    ? `https://img.logo.dev/name/${encodeURIComponent(company.trim())}?token=${token}&size=64&format=png`
    : null;

  const src = logoUrl || logoDevSrc;

  if (src && !failed) {
    return (
      <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
           style={{ background: '#fff', border: `1px solid ${color.border}`, padding: 5 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={company} className="w-full h-full object-contain"
             onError={() => setFailed(true)} />
      </div>
    );
  }

  // Branded generated avatar — always looks good
  return (
    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                    font-poppins font-bold text-sm select-none"
         style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}>
      {initials}
    </div>
  );
}

/* ── JobCard ────────────────────────────────────────────────── */
export default function JobCard({
  id, title, company, location, type,
  salary, batch_year, deadline, tags = [], is_featured, createdAt, created_at, logo_url,
}: JobCardProps) {
  const jobIsNew      = isNew(createdAt, created_at);
  const showCountdown = deadline && new Date(deadline).getTime() - Date.now() < 3 * 24 * 3600 * 1000;
  const isRemote      = location.toLowerCase().includes('remote');

  return (
    <Link href={`/jobs/${id}`} className="block h-full group">
      <article
        className="relative h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer
                   transition-all duration-300 hover:-translate-y-1"
        style={{
          background: 'linear-gradient(145deg,#111111 0%,#0E0E0E 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(168,230,61,0.3)';
          el.style.boxShadow   = '0 12px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(168,230,61,0.08)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(255,255,255,0.07)';
          el.style.boxShadow   = '0 2px 12px rgba(0,0,0,0.4)';
        }}
      >
        {/* Top shimmer */}
        <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
             style={{ background: 'linear-gradient(90deg,transparent,rgba(168,230,61,0.55),transparent)' }} />

        <div className="flex flex-col flex-1 p-5">

          {/* ── Header: logo + company + badge ── */}
          <div className="flex items-start gap-3 mb-3">
            <CompanyLogo company={company} logoUrl={logo_url} />

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {company}
                </p>
                {jobIsNew ? (
                  <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                        style={{ background: '#A8E63D', color: '#000' }}>New</span>
                ) : is_featured ? (
                  <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                        style={{ background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.22)' }}>Top</span>
                ) : null}
              </div>
              <h3 className="font-poppins font-semibold text-sm leading-snug text-white mt-0.5
                             group-hover:text-lime transition-colors duration-200 line-clamp-2">
                {title}
              </h3>
            </div>
          </div>

          {/* ── Salary — prominent ── */}
          {salary ? (
            <div className="flex items-center gap-1.5 mb-3">
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#B49EF0' }}
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold" style={{ color: '#B49EF0' }}>{salary}</span>
            </div>
          ) : (
            <div className="mb-3" />
          )}

          {/* ── Location + batch ── */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-4"
               style={{ color: 'rgba(255,255,255,0.32)' }}>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </span>
            {batch_year && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-4.5l4 2.5 4-2.5" />
                </svg>
                Batch {batch_year}
              </span>
            )}
          </div>

          {/* ── Chips: type · remote · countdown ── */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(168,230,61,0.08)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.18)' }}>
              {type}
            </span>
            {isRemote && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(96,165,250,0.08)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.18)' }}>
                Remote
              </span>
            )}
            {showCountdown && deadline && <Countdown deadline={deadline} />}
          </div>

          {/* ── Tags ── */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-md" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  +{tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="flex items-center justify-between px-5 py-3"
             style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {type === 'Internship' ? '🎓 Internship' : '💼 Full-time'}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-lime
                           group-hover:gap-2 transition-all duration-200">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
