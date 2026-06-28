'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import DSAFlowchart from './DSAFlowchart';
import ComingSoonVector from '@/components/ComingSoonVector';
import type { RoadmapCategory } from '../data';

export default function RoadmapCategoryClient({ category: cat }: { category: RoadmapCategory }) {
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
