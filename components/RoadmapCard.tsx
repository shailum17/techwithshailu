'use client';

import Link from 'next/link';

interface RoadmapCardProps {
  id: string;
  title: string;
  level: string;
  modules: number;
  time: string;
  color: string;
}

const levelConfig: Record<string, { accent: string; label: string }> = {
  Beginner:     { accent: '#A8E63D', label: 'Beginner' },
  Intermediate: { accent: '#FBBF24', label: 'Intermediate' },
  Advanced:     { accent: '#F87171', label: 'Advanced' },
};

export default function RoadmapCard({ id, title, level, modules, time, color }: RoadmapCardProps) {
  const cfg = levelConfig[level] ?? { accent: '#A8E63D', label: level };

  return (
    <Link href={`/resources/${id}`} className="block h-full group">
      <div
        className="rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col relative overflow-hidden"
        style={{
          background: '#0E0E0E',
          border: `1px solid rgba(255,255,255,0.07)`,
          borderLeft: `3px solid ${cfg.accent}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(${cfg.accent === '#A8E63D' ? '168,230,61' : cfg.accent === '#FBBF24' ? '251,191,36' : '248,113,113'},0.12)`;
          (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,255,255,0.12)`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        }}
      >
        {/* Accent dot */}
        <div className="w-2 h-2 rounded-full mb-3 flex-shrink-0"
          style={{ background: cfg.accent }} />

        <h3 className="font-poppins font-semibold text-white text-sm mb-2 group-hover:text-lime transition-colors leading-snug">
          {title}
        </h3>

        <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-3 ${color}`}
          style={{ background: `${cfg.accent}14`, color: cfg.accent, border: `1px solid ${cfg.accent}30` }}>
          {cfg.label}
        </span>

        <div className="flex items-center gap-3 text-slate-600 text-xs mt-auto pt-3 font-light"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span>{modules} modules</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
}
