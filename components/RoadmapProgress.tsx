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
  const r  = 44;
  const cx = 56;
  const cy = 56;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#5C9E00"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#111827"
          fontSize="18" fontWeight="700" fontFamily="Poppins, sans-serif">
          {pct}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#9CA3AF" fontSize="10">
          Progress
        </text>
      </svg>
    </div>
  );
}

export default function RoadmapProgress({ totalCompleted, totalModules, inProgress, remaining, roadmaps }: Props) {
  const pct      = Math.round((totalCompleted / totalModules) * 100) || 68;
  const pathname = usePathname();
  const weekDays  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [0, 1, 2, 3, 4];

  return (
    <div className="glass-card p-5 sticky top-24 space-y-6">
      <DonutChart pct={pct} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-lime-light border border-lime/20 rounded-xl py-2">
          <p className="font-poppins font-bold text-lime text-base">{totalCompleted || 24}</p>
          <p className="text-ink-muted text-xs mt-0.5">Done</p>
        </div>
        <div className="bg-purple-tint border border-purple-brand/20 rounded-xl py-2">
          <p className="font-poppins font-bold text-purple-brand text-base">{inProgress || 8}</p>
          <p className="text-ink-muted text-xs mt-0.5">Active</p>
        </div>
        <div className="bg-surface-tertiary border border-surface-border rounded-xl py-2">
          <p className="font-poppins font-bold text-ink text-base">{remaining || 12}</p>
          <p className="text-ink-muted text-xs mt-0.5">Left</p>
        </div>
      </div>

      {/* Roadmap nav */}
      <div>
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
          Roadmap Paths
        </p>
        {roadmaps.map(({ id, title }) => {
          const isActive = pathname === `/resources/${id}`;
          return (
            <Link key={id} href={`/resources/${id}`}
              className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-lime bg-lime-light font-medium'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
              }`}>
              <span className="truncate">{title}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-lime flex-shrink-0" />}
            </Link>
          );
        })}
      </div>

      {/* Streak widget */}
      <div className="bg-surface-tertiary border border-surface-border rounded-xl p-4">
        <div className="mb-3">
          <p className="text-ink font-semibold text-sm font-poppins">7 Day Streak</p>
          <p className="text-ink-muted text-xs">Keep it up!</p>
        </div>
        <div className="flex gap-1.5 justify-between">
          {weekDays.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeDays.includes(i)
                  ? 'bg-lime text-white'
                  : 'bg-surface-border text-ink-faint'
              }`}>
                {activeDays.includes(i) ? '✓' : ''}
              </div>
              <span className="text-ink-faint text-xs">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
