'use client';

import { useRef, useState } from 'react';

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

// Dark-friendly category colors
const categoryColors: Record<string, string> = {
  Writing:      'text-blue-400 bg-blue-400/10 border-blue-400/25',
  Image:        'text-pink-400 bg-pink-400/10 border-pink-400/25',
  Coding:       'text-purple-400 bg-purple-400/10 border-purple-400/25',
  Productivity: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  Research:     'text-purple-brand bg-purple-tint border-purple-brand/30',
};

const categoryAvatarBg: Record<string, { bg: string; color: string }> = {
  Writing:      { bg: 'rgba(96,165,250,0.12)',  color: '#60A5FA' },
  Image:        { bg: 'rgba(244,114,182,0.12)', color: '#F472B6' },
  Coding:       { bg: 'rgba(192,132,252,0.12)', color: '#C084FC' },
  Productivity: { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24' },
  Research:     { bg: 'rgba(155,127,232,0.12)', color: '#9B7FE8' },
};

export default function ToolCard({ name, description, category, url, icon_url, is_free, is_featured, votes }: ToolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [upvoted, setUpvoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes ?? 0);

  const colorClass = categoryColors[category] || 'text-ink-muted bg-surface-tertiary border-surface-border';
  const avatar = categoryAvatarBg[category] || { bg: '#1A1A1A', color: '#A0A0A0' };

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    const y = ((e.clientX - r.left) / r.width  - 0.5) * -10;
    el.style.transform = `perspective(700px) rotateX(${x}deg) rotateY(${y}deg) translateY(-3px)`;
  };
  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.borderColor = '#2A2A2A';
      cardRef.current.style.boxShadow = '0 1px 4px rgba(0,0,0,0.4)';
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (upvoted) { setLocalVotes(v => v - 1); setUpvoted(false); }
    else { setLocalVotes(v => v + 1); setUpvoted(true); }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,230,61,0.45)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(168,230,61,0.12)';
      }}
      style={{
        transition: 'transform 0.15s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        transformStyle: 'preserve-3d',
        background: '#111111',
        border: '1px solid #2A2A2A',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }}
      className="group flex flex-col gap-3 p-4 rounded-2xl cursor-pointer"
    >
      {/* Icon + title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                     flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
          style={{ background: avatar.bg, color: avatar.color }}
        >
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
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border text-lime border-lime/30"
                    style={{ background: 'rgba(168,230,61,0.1)' }}>
                Free
              </span>
            )}
            {is_featured && (
              <span className="text-xs px-2 py-0.5 rounded-full border text-amber-400 border-amber-400/30"
                    style={{ background: 'rgba(251,191,36,0.1)' }}>
                Top Pick
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Upvote */}
      {localVotes > 0 && (
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-1 text-xs w-fit transition-colors ${
            upvoted ? 'text-lime font-semibold' : 'text-ink-faint hover:text-lime'
          }`}
        >
          <span>▲</span>
          <span>{(localVotes / 1000).toFixed(1)}K upvotes</span>
        </button>
      )}

      <p className="text-ink-muted text-xs leading-relaxed line-clamp-2">{description}</p>

      {/* Lime Try Now */}
      <a href={url} target="_blank" rel="noopener noreferrer"
         className="text-xs py-2 text-center mt-auto rounded-xl font-semibold transition-all duration-200
                    active:scale-95 hover:shadow-lime-glow"
         style={{ background: '#A8E63D', color: '#000' }}
         onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#BFFF4F'}
         onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#A8E63D'}
         onClick={e => e.stopPropagation()}>
        Try Now →
      </a>
    </div>
  );
}
