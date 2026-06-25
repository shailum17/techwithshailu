'use client';

import Link from 'next/link';

interface RoadmapCardProps {
  id: string;
  title: string;
  level: string;
  modules: number;
  time: string;
  color: string;
  completionPct?: number;
}

export default function RoadmapCard({ id, title, level, modules, time, color, completionPct = 0 }: RoadmapCardProps) {
  const borderColor =
    level === 'Beginner' ? '#A8E63D' : level === 'Intermediate' ? '#F59E0B' : '#EF4444';

  return (
    <Link href={`/resources/${id}`}>
      <div
        className="rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col"
        style={{
          background: '#111111',
          border: `1px solid #2A2A2A`,
          borderLeftWidth: '4px',
          borderLeftColor: borderColor,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(168,230,61,0.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
      >
        <h3 className="font-poppins font-semibold text-ink text-sm mb-1">{title}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-3 ${color}`}
              style={{ background: 'rgba(255,255,255,0.05)' }}>
          {level}
        </span>
        {completionPct > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-ink-faint mb-1">
              <span>Progress</span>
              <span className="text-lime font-medium">{completionPct}%</span>
            </div>
            <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full bg-lime rounded-full transition-all duration-700"
                   style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 text-ink-faint text-xs mt-auto pt-3"
             style={{ borderTop: '1px solid #2A2A2A' }}>
          <span>{modules} modules</span>
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
}
