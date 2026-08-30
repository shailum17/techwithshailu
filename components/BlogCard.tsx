'use client';

import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  category: string;
  date: string;
}

const categoryAccent: Record<string, { color: string; bg: string; border: string }> = {
  Jobs:       { color: '#A8E63D', bg: 'rgba(168,230,61,0.08)',   border: 'rgba(168,230,61,0.2)'   },
  'AI Tools': { color: '#60A5FA', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.2)'   },
  Roadmap:    { color: '#FBBF24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)'   },
  Career:     { color: '#C084FC', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)'  },
};
const fallbackAccent = { color: '#A0A0A0', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' };

export default function BlogCard({ slug, title, category, date }: BlogCardProps) {
  const accent = categoryAccent[category] ?? fallbackAccent;

  return (
    <Link href={`/blog/${slug}`} className="block h-full group">
      <article
        className="rounded-2xl p-5 flex flex-col gap-3 h-full cursor-pointer
                   hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        style={{
          background: '#0E0E0E',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = accent.border;
          (e.currentTarget as HTMLElement).style.boxShadow  = `0 8px 32px ${accent.bg.replace('0.08', '0.18')}`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
          (e.currentTarget as HTMLElement).style.boxShadow   = '0 2px 8px rgba(0,0,0,0.5)';
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-4 right-4 h-px rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${accent.color}55, transparent)` }} />

        {/* Thumbnail strip */}
        <div
          className="w-full h-24 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
        >
          <span className="font-poppins font-black text-3xl tracking-tight opacity-60"
            style={{ color: accent.color }}>
            {category.slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Category badge */}
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
          style={{ color: accent.color, background: accent.bg, border: `1px solid ${accent.border}` }}>
          {category}
        </span>

        {/* Title */}
        <h3 className="font-poppins font-semibold text-white text-sm leading-snug
                       group-hover:text-lime transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Date */}
        <p className="text-slate-600 text-xs mt-auto flex items-center gap-1.5 font-light">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {date} · techwithshailu
        </p>
      </article>
    </Link>
  );
}
