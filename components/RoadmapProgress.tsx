'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  totalCompleted: number;
  totalModules:   number;
  inProgress:     number;
  remaining:      number;
  roadmaps: { id: string; title: string; icon?: string }[];
}

function DonutChart({ pct }: { pct: number }) {
  const r  = 42;
  const cx = 56;
  const cy = 56;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="112" height="112" viewBox="0 0 112 112">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2A2A2A" strokeWidth="8" />
        {/* Active arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#A8E63D"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          style={{ transition: 'stroke-dasharray 0.8s ease', filter: 'drop-shadow(0 0 6px rgba(168,230,61,0.5))' }}
        />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#F0F0F0"
          fontSize="20" fontWeight="800" fontFamily="Poppins, sans-serif">
          {pct}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#606060" fontSize="10" fontFamily="Poppins, sans-serif">
          Progress
        </text>
      </svg>
    </div>
  );
}

export default function RoadmapProgress({ totalCompleted, totalModules, inProgress, remaining, roadmaps }: Props) {
  const pct      = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;
  const pathname = usePathname();

  return (
    <div className="rounded-2xl p-5 sticky top-24 space-y-6"
         style={{ background: '#111111', border: '1px solid #2A2A2A', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
      <DonutChart pct={pct} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl py-2"
             style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.2)' }}>
          <p className="font-poppins font-bold text-base text-lime">{totalCompleted}</p>
          <p className="text-ink-muted text-xs mt-0.5">Done</p>
        </div>
        <div className="rounded-xl py-2"
             style={{ background: 'rgba(155,127,232,0.08)', border: '1px solid rgba(155,127,232,0.2)' }}>
          <p className="font-poppins font-bold text-purple-brand text-base">{inProgress}</p>
          <p className="text-ink-muted text-xs mt-0.5">Active</p>
        </div>
        <div className="rounded-xl py-2"
             style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <p className="font-poppins font-bold text-ink text-base">{remaining}</p>
          <p className="text-ink-muted text-xs mt-0.5">Left</p>
        </div>
      </div>

      {/* Roadmap nav */}
      {roadmaps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">
            Roadmap Paths
          </p>
          {roadmaps.map(({ id, title }) => {
            const isActive = pathname === `/resources/${id}`;
            return (
              <Link key={id} href={`/resources/${id}`}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'text-lime font-medium'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                }`}
                style={isActive ? { background: 'rgba(168,230,61,0.08)' } : {}}>
                <span className="truncate">{title}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-lime flex-shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
