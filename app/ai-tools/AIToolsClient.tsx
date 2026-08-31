'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/* ── Types ────────────────────────────────────────────────────── */
export interface AiTool {
  id?: string;
  name: string;
  description: string;
  category: string;
  url: string;
  logo?: string | null;
  is_free: boolean;
  votes: number;
  is_featured?: boolean;
}

/* ── Category config ──────────────────────────────────────────── */
const CATEGORIES = [
  'Chatbots', 'Coding', 'Writing', 'Image', 'Video', 'Audio',
  'Presentations', 'Emails', 'Spreadsheet', 'Meetings',
  'Workflows', 'Scheduling', 'Graphic Design', 'Knowledge',
  'Research', 'Agent',
] as const;
type Cat = typeof CATEGORIES[number];

const categoryColors: Record<string, string> = {
  Chatbots:         'text-emerald-400 bg-emerald-950 border-emerald-800',
  Coding:           'text-purple-400 bg-purple-950 border-purple-800',
  Writing:          'text-blue-400 bg-blue-950 border-blue-800',
  Image:            'text-pink-400 bg-pink-950 border-pink-800',
  Video:            'text-red-400 bg-red-950 border-red-800',
  Audio:            'text-rose-400 bg-rose-950 border-rose-800',
  Presentations:    'text-orange-400 bg-orange-950 border-orange-800',
  Emails:           'text-cyan-400 bg-cyan-950 border-cyan-800',
  Spreadsheet:      'text-green-400 bg-green-950 border-green-800',
  Meetings:         'text-sky-400 bg-sky-950 border-sky-800',
  Workflows:        'text-amber-400 bg-amber-950 border-amber-800',
  Scheduling:       'text-violet-400 bg-violet-950 border-violet-800',
  'Graphic Design': 'text-fuchsia-400 bg-fuchsia-950 border-fuchsia-800',
  Knowledge:        'text-teal-400 bg-teal-950 border-teal-800',
  Research:         'text-indigo-400 bg-indigo-950 border-indigo-800',
  Agent:            'text-lime-400 bg-lime-950/50 border-lime-800/60',
};

const categoryAvatarBg: Record<string, string> = {
  Chatbots:         'bg-emerald-900 text-emerald-400',
  Coding:           'bg-purple-900 text-purple-400',
  Writing:          'bg-blue-900 text-blue-400',
  Image:            'bg-pink-900 text-pink-400',
  Video:            'bg-red-900 text-red-400',
  Audio:            'bg-rose-900 text-rose-400',
  Presentations:    'bg-orange-900 text-orange-400',
  Emails:           'bg-cyan-900 text-cyan-400',
  Spreadsheet:      'bg-green-900 text-green-400',
  Meetings:         'bg-sky-900 text-sky-400',
  Workflows:        'bg-amber-900 text-amber-400',
  Scheduling:       'bg-violet-900 text-violet-400',
  'Graphic Design': 'bg-fuchsia-900 text-fuchsia-400',
  Knowledge:        'bg-teal-900 text-teal-400',
  Research:         'bg-indigo-900 text-indigo-400',
  Agent:            'bg-lime-900/40 text-lime-400',
};

/* ── ToolLogo ─────────────────────────────────────────────────── */
function ToolLogo({ name, url, logo, avatarClass }: {
  name: string; url: string; logo?: string | null; avatarClass: string;
}) {
  const [errored, setErrored] = useState(false);
  const domain = logo ?? (() => { try { return new URL(url).hostname; } catch { return ''; } })();
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  if (!errored) {
    return (
      <img
        src={faviconUrl}
        alt={name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-xl object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ background: 'rgba(255,255,255,0.06)', padding: '4px' }}
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                    transition-transform duration-200 group-hover:scale-105 flex-shrink-0 ${avatarClass}`}>
      {name.slice(0, 2)}
    </div>
  );
}

/* ── SpotlightCard — Magic-UI inspired mouse-tracked spotlight ── */
function SpotlightCard({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: -300, y: -300 }); }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
      style={{
        background: '#0E0E0E',
        border: active
          ? '1px solid rgba(168,230,61,0.7)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: active
          ? '0 0 0 1px rgba(168,230,61,0.2), 0 8px 32px rgba(168,230,61,0.15)'
          : isHovered
          ? '0 4px 24px rgba(0,0,0,0.5)'
          : '0 1px 6px rgba(0,0,0,0.35)',
      }}
    >
      {/* Spotlight radial that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px,
            rgba(168,230,61,0.09) 0%,
            rgba(168,230,61,0.03) 45%,
            transparent 70%
          )`,
        }}
      />
      {/* Glowing border highlight that follows the cursor */}
      {!active && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(168,230,61,0.18),
              transparent 70%
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ── ToolCard ─────────────────────────────────────────────────── */
function ToolCard({ tool, active }: { tool: AiTool; active: boolean }) {
  const { name, description, category, url, logo, is_free, votes } = tool;
  const [upvoted, setUpvoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes ?? 0);

  const colorClass  = categoryColors[category]    || 'text-ink-muted bg-surface-tertiary border-surface-border';
  const avatarClass = categoryAvatarBg[category]  || 'bg-surface-tertiary text-ink-muted';

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvoted) { setLocalVotes(v => v - 1); setUpvoted(false); }
    else         { setLocalVotes(v => v + 1); setUpvoted(true); }
  };

  const formatVotes = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);

  return (
    <SpotlightCard active={active}>
      <div className="flex flex-col p-4 gap-0">

        {/* ── Header: logo + name + pricing badge ── */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <ToolLogo name={name} url={url} logo={logo} avatarClass={avatarClass} />
            <div className="min-w-0">
              <p className="text-ink text-sm font-semibold font-poppins group-hover:text-lime
                            transition-colors truncate leading-tight">
                {name}
              </p>
              {/* Upvote row */}
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-1 mt-1 text-xs transition-all duration-200 ${
                  upvoted ? 'text-lime font-semibold' : 'text-ink-faint hover:text-lime'
                }`}
              >
                <svg
                  className={`w-3 h-3 transition-transform ${upvoted ? 'scale-125' : ''}`}
                  viewBox="0 0 24 24"
                  fill={upvoted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <span>{formatVotes(localVotes)}</span>
              </button>
            </div>
          </div>

          {/* Free / Paid pill */}
          {is_free ? (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 leading-5"
              style={{ color: '#A8E63D', background: 'rgba(168,230,61,0.10)', border: '1px solid rgba(168,230,61,0.28)' }}
            >
              Free
            </span>
          ) : (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 leading-5"
              style={{ color: '#FCD34D', background: 'rgba(252,211,77,0.10)', border: '1px solid rgba(252,211,77,0.28)' }}
            >
              Paid
            </span>
          )}
        </div>

        {/* ── Description ── */}
        <p className="text-ink-muted text-xs leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* ── Hairline divider ── */}
        <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* ── Footer: category badge + CTA ── */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0 ${colorClass}`}>
            {category}
          </span>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                       transition-all duration-200 active:scale-95 hover:brightness-110 flex-shrink-0"
            style={{ background: '#A8E63D', color: '#000' }}
          >
            Try Now
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </SpotlightCard>
  );
}

/* ── Main client component ────────────────────────────────────── */
export default function AIToolsClient({
  initialTools,
  initialCategory,
  initialQ,
}: {
  initialTools: AiTool[];
  initialCategory?: string;
  initialQ?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<Cat | 'All'>((initialCategory as Cat) || 'All');
  const [q,       setQ]       = useState(initialQ || '');
  const [pricing, setPricing] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sort,    setSort]    = useState<'popular' | 'newest' | 'az'>('popular');
  const [activeCard, setActiveCard] = useState<string | null>(null);

  /* Derived counts from live data */
  const catCount: Record<string, number> = {};
  initialTools.forEach(t => { catCount[t.category] = (catCount[t.category] || 0) + 1; });

  const filtered = initialTools
    .filter(t => activeCategory === 'All' || t.category === activeCategory)
    .filter(t => pricing === 'All' || (pricing === 'Free' ? t.is_free : !t.is_free))
    .filter(t => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.description.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === 'az'      ? a.name.localeCompare(b.name) :
      sort === 'newest'  ? 0 :
      (b.votes ?? 0) - (a.votes ?? 0)
    );

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
  const cardVariants = {
    hidden:  { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="rounded-2xl p-5 sticky top-24 space-y-6"
                 style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
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
                  { label: 'All Tools', count: initialTools.length },
                  { label: 'Free',      count: initialTools.filter(t => t.is_free).length },
                  { label: 'Paid',      count: initialTools.filter(t => !t.is_free).length },
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
                {(['Free', 'Paid'] as const).map(label => (
                  <label key={label} className="flex items-center justify-between py-1.5 px-2 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox"
                        checked={pricing === label}
                        onChange={() => setPricing(pricing === label ? 'All' : label)}
                        className="accent-lime" />
                      <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{label}</span>
                    </div>
                    <span className="text-xs text-ink-faint">
                      {label === 'Free' ? initialTools.filter(t => t.is_free).length : initialTools.filter(t => !t.is_free).length}
                    </span>
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

          {/* ── Main content ─────────────────────────────────────── */}
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
                      : { borderColor: 'rgba(255,255,255,0.08)', background: 'transparent' }
                  }>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + sort bar */}
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
                  style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,230,61,0.5)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint
                                  rounded px-1.5 py-0.5 font-mono pointer-events-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ⌘K
                </kbd>
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                className="rounded-xl px-4 py-2.5 text-ink text-sm focus:outline-none cursor-pointer"
                style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                  <motion.div
                    key={tool.id ?? tool.name}
                    variants={cardVariants}
                    onClick={() => setActiveCard(activeCard === tool.name ? null : tool.name)}
                  >
                    <ToolCard tool={tool} active={activeCard === tool.name} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="rounded-2xl p-12 text-center"
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
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
