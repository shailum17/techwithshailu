'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';

/* ── Static tool data (mirrors §12.3 mockup) ────────────────── */
const ALL_TOOLS = [
  // Row 1
  { name: 'ChatGPT',        desc: 'Conversational AI for writing, coding, research and more.',   cat: 'Writing',      url: 'https://chat.openai.com',    free: true,  votes: 12400, icon: '🤖' },
  { name: 'Midjourney',     desc: 'Generate stunning professional images from text prompts.',    cat: 'Image',        url: 'https://midjourney.com',     free: false, votes: 9800,  icon: '🎨' },
  { name: 'GitHub Copilot', desc: 'AI pair programmer that writes code as you type.',            cat: 'Coding',       url: 'https://copilot.github.com', free: false, votes: 8600,  icon: '💻' },
  { name: 'Notion AI',      desc: 'Smart writing assistant built into your Notion workspace.',   cat: 'Productivity', url: 'https://notion.so',          free: true,  votes: 6500,  icon: '📝' },
  // Row 2
  { name: 'Jasper',         desc: 'AI content writer for blog posts, ads, and social media.',   cat: 'Writing',      url: 'https://jasper.ai',          free: false, votes: 5400,  icon: '✍️' },
  { name: 'Canva AI',       desc: 'Design anything with AI-powered templates and tools.',        cat: 'Image',        url: 'https://canva.com',          free: true,  votes: 4800,  icon: '🖼️' },
  { name: 'Tabnine',        desc: 'AI code completion for all major IDEs and 30+ languages.',   cat: 'Coding',       url: 'https://tabnine.com',        free: true,  votes: 4200,  icon: '⚡' },
  { name: 'Grammarly',      desc: 'AI grammar checker and writing assistant.',                  cat: 'Writing',      url: 'https://grammarly.com',      free: true,  votes: 3900,  icon: '📖' },
  // Row 3
  { name: 'Perplexity AI',  desc: 'AI search engine with cited real-time answers.',             cat: 'Research',     url: 'https://perplexity.ai',      free: true,  votes: 3600,  icon: '🔬' },
  { name: 'Suno',           desc: 'Generate full songs with AI — melody, lyrics, vocals.',      cat: 'Productivity', url: 'https://suno.ai',            free: true,  votes: 3200,  icon: '🎵' },
  { name: 'Claude',         desc: "Anthropic's AI assistant — safe, helpful, and honest.",      cat: 'Writing',      url: 'https://claude.ai',          free: true,  votes: 2900,  icon: '🧠' },
  { name: 'Replit',         desc: 'Code, collaborate, and deploy apps in the browser.',         cat: 'Coding',       url: 'https://replit.com',         free: true,  votes: 2600,  icon: '🛠️' },
  // Extras
  { name: 'Codeium',        desc: 'Free AI code completion — Copilot alternative for 70+ langs.', cat: 'Coding',    url: 'https://codeium.com',        free: true,  votes: 2300,  icon: '🚀' },
  { name: 'Consensus',      desc: 'AI search for scientific papers with instant summaries.',    cat: 'Research',     url: 'https://consensus.app',      free: true,  votes: 2100,  icon: '📚' },
  { name: 'Leonardo AI',    desc: 'AI image generation for art, designs and game assets.',      cat: 'Image',        url: 'https://leonardo.ai',        free: true,  votes: 1900,  icon: '🖌️' },
  { name: 'Otter.ai',       desc: 'AI meeting recorder and transcription tool.',                cat: 'Productivity', url: 'https://otter.ai',           free: true,  votes: 1700,  icon: '🎙️' },
];

const CATEGORIES = ['Writing', 'Image', 'Coding', 'Productivity', 'Research'] as const;
type Cat = typeof CATEGORIES[number];

const catCount: Record<string, number> = {};
ALL_TOOLS.forEach(t => { catCount[t.cat] = (catCount[t.cat] || 0) + 1; });

/* ── 3-D tilt tool card ─────────────────────────────────────── */
function ToolCard({ name, desc, cat, url, free, votes, icon, active }: {
  name: string; desc: string; cat: string; url: string;
  free: boolean; votes: number; icon: string; active: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top)  / r.height - 0.5) * 16;
    const y = ((e.clientX - r.left) / r.width  - 0.5) * -16;
    el.style.transform = `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) translateY(-4px) scale(1.02)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = ''; };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d' }}
      className={`group flex flex-col gap-3 p-4 rounded-2xl bg-[#0D0D0D] cursor-pointer
                  border transition-colors ${
                    active
                      ? 'border-lime shadow-[0_0_0_1px_#A8E63D,0_0_24px_rgba(168,230,61,0.2)]'
                      : 'border-[#1f1f1f] hover:border-purple-brand hover:shadow-[0_0_0_1px_#6A4CC3,0_0_28px_rgba(106,76,195,0.35)]'
                  }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-dark-border flex items-center justify-center text-xl
                          group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div>
            <p className="text-white text-sm font-semibold font-poppins group-hover:text-lime transition-colors">
              {name}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              {(votes / 1000).toFixed(1)}K upvotes
            </p>
          </div>
        </div>
        {/* Upvote button */}
        <button className="flex items-center gap-1 text-gray-500 hover:text-lime text-xs
                           border border-white/10 rounded-lg px-2 py-1 hover:border-lime/30 transition-colors">
          ↑ {Math.round(votes / 100) / 10}K
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">#{cat}</span>
        {free && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">Free</span>}
      </div>

      {/* CTA */}
      <a href={url} target="_blank" rel="noopener noreferrer"
         className="flex items-center justify-center gap-1.5 bg-lime text-dark font-semibold
                    text-xs py-2 rounded-xl hover:bg-lime-bright transition-colors mt-auto"
         onClick={e => e.stopPropagation()}>
        Try Now
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </motion.div>
  );
}

/* ── Main page component ────────────────────────────────────── */
export default function AIToolsClient({
  initialCategory,
  initialQ,
}: {
  initialCategory?: string;
  initialQ?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<Cat | 'All'>(
    (initialCategory as Cat) || 'All'
  );
  const [q, setQ]           = useState(initialQ || '');
  const [pricing, setPricing] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sort, setSort]     = useState<'popular' | 'newest' | 'az'>('popular');
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const filtered = ALL_TOOLS
    .filter(t => activeCategory === 'All' || t.cat === activeCategory)
    .filter(t => pricing === 'All' || (pricing === 'Free' ? t.free : !t.free))
    .filter(t => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      if (sort === 'newest') return 0;
      return b.votes - a.votes;
    });

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const cardVariants = {
    hidden:  { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Left sidebar (§12.3) ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="glass-card p-5 sticky top-24 space-y-6">

              {/* Title */}
              <div>
                <h1 className="font-poppins font-bold text-white text-lg">Discover</h1>
                <p className="text-gray-400 text-xs mt-1 leading-snug">
                  Find the best AI tools to boost your productivity.
                </p>
              </div>

              {/* Quick filters */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Filters</p>
                {[
                  { label: 'All Tools',    count: ALL_TOOLS.length,                           key: 'all' },
                  { label: 'Trending',     count: 12,                                          key: 'trending' },
                  { label: 'New Tools',    count: 8,                                           key: 'new' },
                  { label: 'Most Upvoted', count: 24,                                          key: 'upvoted' },
                ].map(({ label, count }) => (
                  <button key={label}
                    className="w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-lg
                               text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left">
                    <span>{label}</span>
                    <span className="text-xs text-gray-600">{count}</span>
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                {CATEGORIES.map(cat => (
                  <button key={cat}
                    onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)}
                    className={`w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-lg
                                transition-colors text-left ${
                                  activeCategory === cat
                                    ? 'text-lime bg-lime/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                    <span>{cat}</span>
                    <span className={`text-xs ${activeCategory === cat ? 'text-lime' : 'text-gray-600'}`}>
                      {catCount[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pricing</p>
                {[
                  { label: 'Free',      count: ALL_TOOLS.filter(t => t.free).length },
                  { label: 'Freemium',  count: 34 },
                  { label: 'Paid',      count: ALL_TOOLS.filter(t => !t.free).length },
                ].map(({ label, count }) => (
                  <label key={label}
                    className="flex items-center justify-between py-1.5 px-2 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox"
                        checked={pricing === label}
                        onChange={() => setPricing(pricing === label ? 'All' : label as 'Free' | 'Paid')}
                        className="accent-lime" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                        {label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{count}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sort By</p>
                {[
                  { label: 'Most Popular', value: 'popular' },
                  { label: 'Newest',       value: 'newest' },
                  { label: 'A–Z',          value: 'az' },
                ].map(({ label, value }) => (
                  <button key={value}
                    onClick={() => setSort(value as typeof sort)}
                    className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${
                      sort === value ? 'text-lime bg-lime/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h2 className="font-poppins font-bold text-2xl text-white">AI Tools Directory</h2>
              <p className="text-gray-400 text-sm mt-1">
                Discover the best AI tools to supercharge your workflow.
              </p>
            </div>

            {/* Category pill tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(['All', ...CATEGORIES] as const).map(cat => (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative text-sm px-4 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'border-lime text-lime bg-lime/10 font-semibold'
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + sort row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                </svg>
                <input
                  type="text"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search AI tools... ⌘K"
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-2.5 pl-10
                             text-white placeholder-gray-500 text-sm focus:outline-none focus:border-lime/50"
                />
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as typeof sort)}
                className="bg-dark-card border border-white/10 rounded-xl px-4 py-2.5 text-white
                           text-sm focus:outline-none focus:border-lime/50 cursor-pointer">
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="az">A–Z</option>
              </select>
            </div>

            {/* Results count */}
            <p className="text-gray-500 text-sm mb-4">
              <span className="text-lime font-semibold">{filtered.length}</span> tools found
            </p>

            {/* Tool cards grid */}
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
                    <ToolCard
                      name={tool.name}
                      desc={tool.desc}
                      cat={tool.cat}
                      url={tool.url}
                      free={tool.free}
                      votes={tool.votes}
                      icon={tool.icon}
                      active={activeCard === tool.name}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-white font-poppins font-semibold">No tools found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
