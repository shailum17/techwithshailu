'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DSAFlowchart from './DSAFlowchart';
import FrontendFlowchart from './FrontendFlowchart';
import ComingSoonVector from '@/components/ComingSoonVector';
import type { RoadmapCategory } from '../data';

/* ── Legend item ─────────────────────────────────────────── */
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
      <span className="text-xs" style={{ color: '#8ba0be' }}>{label}</span>
    </div>
  );
}

/* ── Full roadmap view ───────────────────────────────────── */
function RoadmapFlowView({
  chart,
  dotColor,
  title,
}: {
  chart: React.ReactNode;
  dotColor: string;
  title: string;
}) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Sticky toolbar */}
      <div
        className="sticky top-20 z-20 flex items-center justify-between px-4 py-2 gap-3 flex-wrap"
        style={{ background: 'rgba(10,10,10,0.92)', borderBottom: '1px solid #1f2937', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <LegendItem color={dotColor}   label="Phase / Section" />
          <LegendItem color="#a78bfa"    label="Topic" />
          <LegendItem color="#1e3a5f"    label="Sub-item" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(1)))}
            className="w-7 h-7 rounded-lg text-white/60 hover:text-white flex items-center justify-center transition-colors text-sm"
            style={{ background: '#111', border: '1px solid #2A2A2A' }}
            aria-label="Zoom out"
          >−</button>
          <span className="text-xs text-white/40 w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))}
            className="w-7 h-7 rounded-lg text-white/60 hover:text-white flex items-center justify-center transition-colors text-sm"
            style={{ background: '#111', border: '1px solid #2A2A2A' }}
            aria-label="Zoom in"
          >+</button>
          <button
            onClick={() => setZoom(1)}
            className="text-xs px-2 py-1 rounded-lg text-white/40 hover:text-lime transition-colors"
            style={{ background: '#111', border: '1px solid #2A2A2A' }}
          >Reset</button>
        </div>
      </div>

      {/* Chart scroll area */}
      <div className="overflow-auto flex-1 px-2 py-6">
        <div
          style={{
            transformOrigin: 'top center',
            transform: `scale(${zoom})`,
            transition: 'transform 0.15s ease',
            width: '100%',
          }}
        >
          {chart}
        </div>
      </div>
    </div>
  );
}


export default function RoadmapCategoryClient({ category: cat }: { category: RoadmapCategory }) {

  /* ── Render real flowchart for available roadmaps ─────── */
  if (cat.id === 'frontend' || cat.id === 'dsa') {
    const chart = cat.id === 'frontend'
      ? <FrontendFlowchart />
      : <DSAFlowchart />;

    return (
      <div className="pt-20 min-h-screen" style={{ background: '#0A0A0A' }}>
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted px-6 pt-6 pb-3 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources/roadmaps" className="hover:text-lime transition-colors">Roadmaps</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">{cat.title}</span>
        </nav>

        <RoadmapFlowView chart={chart} dotColor={cat.dotColor} title={cat.title} />
      </div>
    );
  }

  /* ── Coming soon for other categories ─────────────────── */
  return (
    <div className="pt-20 min-h-screen" style={{ background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>

      {/* ── Blurred flowchart background ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        filter: 'blur(6px)', opacity: 0.3,
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <DSAFlowchart />
      </div>

      {/* ── Vignette ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.94) 75%)',
        pointerEvents: 'none',
      }} />

      {/* ── Content ── */}
      <div className="relative flex flex-col min-h-[calc(100vh-80px)]" style={{ zIndex: 2 }}>

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted px-6 pt-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources/roadmaps" className="hover:text-lime transition-colors">Roadmaps</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">{cat.title}</span>
        </nav>

        {/* Centre stage */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-10">

          {/* Category pill */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-2"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: `${cat.dotColor}15`,
                border: `1px solid ${cat.dotColor}40`,
                color: cat.dotColor,
                letterSpacing: '0.06em',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.dotColor }} />
              {cat.title}
            </span>
          </motion.div>

          {/* Spotlight vector — the hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xs"
          >
            <ComingSoonVector color={cat.dotColor} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="text-ink-muted text-sm text-center max-w-xs leading-relaxed mt-1"
          >
            {cat.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.1 }}
            className="mt-7 flex flex-col sm:flex-row gap-3 items-center"
          >
            <a
              href="https://t.me/techwithshailu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime text-sm py-2.5 px-6"
            >
              Get Notified
            </a>
            <Link
              href="/resources/roadmaps"
              className="text-sm text-ink-muted hover:text-lime transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Roadmaps
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
