'use client';

import { useRef } from 'react';

interface ToolCardProps {
  name: string;
  description: string;
  category: string;
  url: string;
  icon_url?: string;
  is_free?: boolean;
  is_featured?: boolean;
  votes?: number;
}

const categoryColors: Record<string, string> = {
  Writing:      'text-blue-600 bg-blue-50 border-blue-200',
  Image:        'text-pink-600 bg-pink-50 border-pink-200',
  Coding:       'text-lime bg-lime-light border-lime/30',
  Productivity: 'text-amber-600 bg-amber-50 border-amber-200',
  Research:     'text-purple-brand bg-purple-tint border-purple-brand/30',
};

export default function ToolCard({ name, description, category, url, icon_url, is_free, is_featured, votes }: ToolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const colorClass = categoryColors[category] || 'text-ink-muted bg-surface-tertiary border-surface-border';

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top)  / r.height - 0.5) * 12;
    const y = ((e.clientX - r.left) / r.width  - 0.5) * -12;
    el.style.transform = `perspective(700px) rotateX(${x}deg) rotateY(${y}deg) translateY(-3px)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = ''; };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.25s ease', transformStyle: 'preserve-3d' }}
      className="group flex flex-col gap-3 p-4 rounded-2xl bg-white
                 border border-surface-border shadow-card
                 hover:border-purple-brand/40 hover:shadow-card-hover"
    >
      {/* Icon + title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-tertiary border border-surface-border
                        flex items-center justify-center text-xl flex-shrink-0
                        group-hover:scale-110 transition-transform duration-200">
          {icon_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={icon_url} alt={name} className="w-6 h-6 object-contain" />
            : name.slice(0, 2)
          }
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-poppins font-semibold text-ink text-sm truncate
                         group-hover:text-lime transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
              {category}
            </span>
            {is_free && (
              <span className="text-xs text-green-600 bg-green-50 border border-green-200
                               px-2 py-0.5 rounded-full">
                Free
              </span>
            )}
            {is_featured && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200
                               px-2 py-0.5 rounded-full">
                Top Pick
              </span>
            )}
          </div>
        </div>
      </div>

      {votes !== undefined && (
        <p className="text-xs text-ink-faint">{(votes / 1000).toFixed(1)}K upvotes</p>
      )}

      <p className="text-ink-muted text-xs leading-relaxed line-clamp-2">{description}</p>

      <a href={url} target="_blank" rel="noopener noreferrer"
         className="btn-lime text-xs py-2 text-center mt-auto"
         onClick={e => e.stopPropagation()}>
        Try Now
      </a>
    </div>
  );
}
