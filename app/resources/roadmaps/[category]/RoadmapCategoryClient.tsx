'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import DSAFlowchart from './DSAFlowchart';
import FrontendFlowchart from './FrontendFlowchart';
import ComingSoonVector from '@/components/ComingSoonVector';
import ResourceDrawer from '@/components/ResourceDrawer';
import { RESOURCES } from './resources-data';
import type { NodeResources } from './resources-data';
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
  isFrontend,
  onNodeClick,
}: {
  chart: React.ReactNode;
  dotColor: string;
  isFrontend: boolean;
  onNodeClick?: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [optVisible, setOptVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── On mount: scroll horizontally so the core spine
        starts centered in the viewport ─────────────────── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // rAF lets the browser finish its first paint/layout so
    // scrollWidth is accurate before we measure.
    const id = requestAnimationFrame(() => {
      // Core spine CX=440 sits in a W=1400 SVG.
      // We want CX to appear at the horizontal center of the
      // viewport. SVG is rendered at 100% container width but
      // may overflow — use scrollWidth to get the real pixel width.
      const svgWidth = el.scrollWidth;          // real rendered px width
      const viewWidth = el.clientWidth;
      // Core spine sits at CX=700 in a W=1900 SVG → fraction 0.368
      // For DSA (CX=500, W=1000) this is 0.5 — perfectly centered anyway
      const spineFraction = isFrontend ? (700 / 1900) : 0.5;
      const spinePixel = svgWidth * spineFraction;
      // Scroll so the spine is at the horizontal centre of the viewport
      el.scrollLeft = spinePixel - viewWidth / 2;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── Scroll to show / hide optional branch ───────────── */
  const toggleOptional = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!optVisible) {
      // Scroll right so OX=1550 in W=1900 SVG is roughly centred
      const svgWidth = el.scrollWidth;
      const viewWidth = el.clientWidth;
      const optPixel = svgWidth * (1550 / 1900);
      el.scrollTo({ left: optPixel - viewWidth / 2, behavior: 'smooth' });
      setOptVisible(true);
    } else {
      // Scroll back so CX=700 in W=1900 SVG is centred
      const svgWidth = el.scrollWidth;
      const viewWidth = el.clientWidth;
      const spinePixel = svgWidth * (700 / 1900);
      el.scrollTo({ left: spinePixel - viewWidth / 2, behavior: 'smooth' });
      setOptVisible(false);
    }
  }, [optVisible]);

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>

      {/* ── Sticky toolbar ─────────────────────────────── */}
      <div
        className="sticky top-20 z-20 flex items-center justify-between px-4 py-2 gap-3 flex-wrap"
        style={{
          background: 'rgba(10,10,10,0.92)',
          borderBottom: '1px solid #1f2937',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          <LegendItem color={dotColor} label="Phase / Section" />
          <LegendItem color="#a78bfa"  label="Topic" />
          <LegendItem color="#1e3a5f"  label="Sub-item" />
          {isFrontend && (
            <LegendItem color="#F59E0B" label="Advanced Topics" />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Optional branch slide button — Frontend only */}
          {isFrontend && (
            <button
              onClick={toggleOptional}
              title={optVisible ? 'Back to core path' : 'Slide to see advanced topics'}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all select-none"
              style={{
                background: optVisible ? '#2A1A00' : '#111',
                border: `1px solid ${optVisible ? '#F59E0B80' : '#2A2A2A'}`,
                color: optVisible ? '#F59E0B' : '#888',
              }}
            >
              {/* animated arrow icon */}
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden
                style={{
                  transform: optVisible ? 'scaleX(-1)' : 'scaleX(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {optVisible ? 'Back to Core' : 'Advanced Topics →'}
            </button>
          )}

          {/* Zoom controls */}
          <button
            onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(1)))}
            className="w-7 h-7 rounded-lg text-white/60 hover:text-white flex items-center justify-center transition-colors text-sm"
            style={{ background: '#111', border: '1px solid #2A2A2A' }}
            aria-label="Zoom out"
          >−</button>
          <span className="text-xs text-white/40 w-10 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
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

      {/* ── Scroll hint + click hint ──────────────────────── */}
      {isFrontend && !optVisible && (
        <div className="pointer-events-none absolute right-4 top-36 z-10 flex flex-col gap-1.5">
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full animate-pulse"
            style={{ background: '#1A1100', border: '1px solid #F59E0B40', color: '#F59E0B99' }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            scroll → advanced topics
          </div>
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ background: '#0A1A00', border: '1px solid #A8E63D30', color: '#A8E63D77' }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            click node → free resources
          </div>
        </div>
      )}

      {/* ── Chart scroll area ─────────────────────────────
           overflow-x: scroll lets the wide SVG spill right;
           the optional branch at OX=1090 is revealed by
           scrolling horizontally.                          */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          flex: 1,
          paddingTop: '24px',
          paddingBottom: '24px',
          scrollBehavior: 'auto',   // we use el.scrollTo({behavior:'smooth'}) ourselves
        }}
      >
        <div
          style={{
            transformOrigin: 'top left',
            transform: `scale(${zoom})`,
            transition: 'transform 0.15s ease',
            /* Keep the div at full SVG width so the scroll container
               knows how much to scroll. The SVG itself is width:100%
               of this div, which is min-content so it never shrinks
               below the SVG's natural width.                        */
            display: 'inline-block',
            minWidth: '100%',
          }}
        >
          {chart}
        </div>
      </div>
    </div>
  );
}


export default function RoadmapCategoryClient({ category: cat }: { category: RoadmapCategory }) {
  const [activeResource, setActiveResource] = useState<NodeResources | null>(null);

  const handleNodeClick = useCallback((id: string) => {
    const res = RESOURCES[id];
    if (res) setActiveResource(res);
  }, []);

  /* ── Render real flowchart for available roadmaps ─────── */
  if (cat.id === 'frontend' || cat.id === 'dsa') {
    const isFrontend = cat.id === 'frontend';
    const chart = isFrontend
      ? <FrontendFlowchart onNodeClick={handleNodeClick} />
      : <DSAFlowchart />;

    return (
      <div className="pt-20 min-h-screen" style={{ background: '#0A0A0A', position: 'relative' }}>
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

        <RoadmapFlowView
          chart={chart}
          dotColor={cat.dotColor}
          isFrontend={isFrontend}
          onNodeClick={isFrontend ? handleNodeClick : undefined}
        />

        {/* Resource drawer */}
        <ResourceDrawer data={activeResource} onClose={() => setActiveResource(null)} />
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

          {/* Spotlight vector */}
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
