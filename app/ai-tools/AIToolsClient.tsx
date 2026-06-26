'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ALL_TOOLS: { name: string; desc: string; cat: string; url: string; free: boolean; votes: number }[] = [];

const CATEGORIES = ['Writing', 'Image', 'Coding', 'Productivity', 'Research'] as const;
type Cat = typeof CATEGORIES[number];

const catCount: Record<string, number> = {};
ALL_TOOLS.forEach(t => { catCount[t.cat] = (catCount[t.cat] || 0) + 1; });

const categoryColors: Record<string, string> = {
  Writing:      'text-blue-600 bg-blue-50 border-blue-200',
  Image:        'text-pink-600 bg-pink-50 border-pink-200',
  Coding:       'text-purple-600 bg-purple-50 border-purple-200',
  Productivity: 'text-amber-600 bg-amber-50 border-amber-200',
  Research:     'text-purple-brand bg-purple-tint border-purple-brand/30',
};

const categoryAvatarBg: Record<string, string> = {
  Writing:      'bg-blue-100 text-blue-600',
  Image:        'bg-pink-100 text-pink-600',
  Coding:       'bg-purple-100 text-purple-600',
  Productivity: 'bg-amber-100 text-amber-600',
  Research:     'bg-purple-tint text-purple-brand',
};

function ToolCard({ name, desc, cat, url, free, votes, active }: {
  name: string; desc: string; cat: string; url: string;
  free: boolean; votes: number; active: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [upvoted, setUpvoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    const y = ((e.clientX - r.left) / r.width  - 0.5) * -10;
    el.style.transform = `perspective(700px) rotateX(${x}deg) rotateY(${y}deg) translateY(-3px)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = ''; };

  const colorClass = categoryColors[cat] || 'text-ink-muted bg-surface-tertiary border-surface-border';
  const avatarClass = categoryAvatarBg[cat] || 'bg-surface-tertiary text-ink-muted';

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvoted) { setLocalVotes(v => v - 1); setUpvoted(false); }
    else { setLocalVotes(v => v + 1); setUpvoted(true); }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.25s ease', transformStyle: 'preserve-3d' }}
      className={`group flex flex-col gap-3 p-4 rounded-2xl cursor-pointer
                  border shadow-card transition-all duration-300 ${
                    active
                      ? 'border-lime shadow-lime-glow'
                      : 'border-surface-border hover:border-lime/50 hover:shadow-[0_8px_28px_rgba(168,230,61,0.15)]'
                  }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {/* Colored avatar bg per category */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                          group-hover:scale-110 transition-transform flex-shrink-0 ${avatarClass}`}>
            {name.slice(0, 2)}
          </div>
          <div>
            <p className="text-ink text-sm font-semibold font-poppins group-hover:text-lime transition-colors">
              {name}
            </p>
            {/* Upvote button — clickable */}
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 text-xs mt-0.5 transition-colors ${
                upvoted ? 'text-lime font-semibold' : 'text-ink-faint hover:text-lime'
              }`}
            >
              <span>▲</span>
              <span>{(localVotes / 1000).toFixed(1)}K</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-ink-muted text-xs leading-relaxed line-clamp-2">{desc}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>{cat}</span>
        {free && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full border text-lime bg-lime-light border-lime/30">
            Free
          </span>
        )}
      </div>

      {/* Lime Try Now button */}
      <a href={url} target="_blank" rel="noopener noreferrer"
         className="text-xs py-2 text-center mt-auto rounded-xl font-semibold transition-all duration-200
                    hover:shadow-lime-glow active:scale-95"
         style={{ background: '#A8E63D', color: '#000' }}
         onClick={e => e.stopPropagation()}>
        Try Now →
      </a>
    </div>
  );
}

export default function AIToolsClient({ initialCategory, initialQ }: { initialCategory?: string; initialQ?: string }) {
  const [activeCategory, setActiveCategory] = useState<Cat | 'All'>((initialCategory as Cat) || 'All');
  const [q,       setQ]       = useState(initialQ || '');
  const [pricing, setPricing] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sort,    setSort]    = useState<'popular' | 'newest' | 'az'>('popular');
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const filtered = ALL_TOOLS
    .filter(t => activeCategory === 'All' || t.cat === activeCategory)
    .filter(t => pricing === 'All' || (pricing === 'Free' ? t.free : !t.free))
    .filter(t => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : sort === 'newest' ? 0 : b.votes - a.votes);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
  const cardVariants = {
    hidden:  { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Sidebar */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="rounded-2xl p-5 sticky top-24 space-y-6"
                 style={{ background: '#111111', border: '1px solid #2A2A2A', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              <div>
                <h1 className="font-poppins font-bold text-ink text-base">Discover</h1>
                <p className="text-ink-muted text-xs mt-1 leading-snug">
                  Find the best AI tools to boost your productivity.
                </p>
              </div>

              {/* Quick filters */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Quick Filters</p>
                {[
                  { label: 'All Tools',    count: ALL_TOOLS.length },
                  { label: 'Free',         count: ALL_TOOLS.filter(t => t.free).length },
                  { label: 'Paid',         count: ALL_TOOLS.filter(t => !t.free).length },
                ].map(({ label, count }) => (
                  <button key={label}
                    className="w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-lg
                               text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors text-left">
                    <span>{label}</span>
                    <span className="text-xs text-ink-faint">{count}</span>
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Categories</p>
                {CATEGORIES.map(cat => (
                  <button key={cat}
                    onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)}
                    className={`w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-lg
                                transition-colors text-left ${
                                  activeCategory === cat
                                    ? 'text-lime font-medium'
                                    : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                                }`}
                    style={activeCategory === cat ? { background: 'rgba(168,230,61,0.08)' } : {}}>
                    <span>{cat}</span>
                    <span className={`text-xs ${activeCategory === cat ? 'text-lime' : 'text-ink-faint'}`}>
                      {catCount[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Pricing</p>
                {[
                  { label: 'Free', count: ALL_TOOLS.filter(t => t.free).length },
                  { label: 'Paid', count: ALL_TOOLS.filter(t => !t.free).length },
                ].map(({ label, count }) => (
                  <label key={label} className="flex items-center justify-between py-1.5 px-2 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox"
                        checked={pricing === label}
                        onChange={() => setPricing(pricing === label ? 'All' : label as 'Free' | 'Paid')}
                        className="accent-lime" />
                      <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{label}</span>
                    </div>
                    <span className="text-xs text-ink-faint">{count}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Sort By</p>
                {[
                  { label: 'Most Popular', value: 'popular' },
                  { label: 'Newest',       value: 'newest' },
                  { label: 'A–Z',          value: 'az' },
                ].map(({ label, value }) => (
                  <button key={value}
                    onClick={() => setSort(value as typeof sort)}
                    className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${
                      sort === value
                        ? 'text-lime font-medium'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                    }`}
                    style={sort === value ? { background: 'rgba(168,230,61,0.08)' } : {}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="font-poppins font-bold text-2xl text-ink">AI Tools Directory</h2>
              <p className="text-ink-muted text-sm mt-1">
                Discover the best AI tools to supercharge your workflow.
              </p>
            </div>

            {/* Category pill tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(['All', ...CATEGORIES] as const).map(cat => (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'text-lime font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  style={
                    activeCategory === cat
                      ? { borderColor: 'rgba(168,230,61,0.5)', background: 'rgba(168,230,61,0.08)' }
                      : { borderColor: '#2A2A2A', background: 'transparent' }
                  }>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                </svg>
                <input type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search AI tools..."
                  className="w-full rounded-xl px-4 py-2.5 pl-10 pr-16
                             text-ink placeholder-ink-faint text-sm focus:outline-none"
                  style={{ background: '#111111', border: '1px solid #2A2A2A' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,230,61,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2A2A2A')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint
                                  rounded px-1.5 py-0.5 font-mono"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  ⌘K
                </span>
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                className="rounded-xl px-4 py-2.5 text-ink text-sm focus:outline-none cursor-pointer"
                style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="az">A–Z</option>
              </select>
            </div>

            <p className="text-ink-muted text-sm mb-4">
              <span className="text-lime font-semibold">{filtered.length}</span> tools found
            </p>

            {filtered.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`${activeCategory}-${q}-${sort}`}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
              >
                {filtered.map(tool => (
                  <motion.div key={tool.name} variants={cardVariants}
                    onClick={() => setActiveCard(activeCard === tool.name ? null : tool.name)}>
                    <ToolCard {...tool} active={activeCard === tool.name} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="rounded-2xl p-12 text-center"
                   style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="font-poppins font-semibold text-ink">No tools found</p>
                <p className="text-ink-muted text-sm mt-1">Try a different search or category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
