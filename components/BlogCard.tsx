'use client';

import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  category: string;
  date: string;
}

const thumbGradient: Record<string, string> = {
  Jobs:       'from-lime/30 to-lime/5',
  'AI Tools': 'from-blue-400/30 to-blue-400/5',
  Roadmap:    'from-amber-400/30 to-amber-400/5',
  Career:     'from-purple-400/30 to-purple-400/5',
};

const thumbColor: Record<string, string> = {
  Jobs: 'text-lime',
  'AI Tools': 'text-blue-600',
  Roadmap: 'text-amber-600',
  Career: 'text-purple-brand',
};

const categoryBadgeColor: Record<string, string> = {
  Jobs:       'text-lime border-lime/30',
  'AI Tools': 'text-blue-400 border-blue-400/30',
  Roadmap:    'text-amber-400 border-amber-400/30',
};

export default function BlogCard({ slug, title, category, date }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article
        className="rounded-2xl p-5 flex flex-col gap-3 h-full cursor-pointer
                   hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        style={{ background: '#111111', border: '1px solid #2A2A2A' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(155,127,232,0.4)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'}
      >
        <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${thumbGradient[category] || 'from-surface-tertiary to-surface-border'}
                         flex items-center justify-center overflow-hidden`}>
          <span className={`text-4xl font-poppins font-black ${thumbColor[category] || 'text-ink-faint'}`}>
            {category.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit border ${categoryBadgeColor[category]}`}
              style={{ background: 'rgba(255,255,255,0.04)' }}>
          {category}
        </span>
        <h3 className="font-poppins font-semibold text-ink text-sm leading-snug
                       hover:text-lime transition-colors">
          {title}
        </h3>
        <p className="text-ink-faint text-xs mt-auto flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {date} · techwithshailu
        </p>
      </article>
    </Link>
  );
}
