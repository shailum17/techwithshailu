'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

/* ─── Card animation variant ─────────────────────────────────── */
const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ─── Shared card shell ──────────────────────────────────────── */
function BentoCard({
  children,
  href,
  className = '',
  index = 0,
  accent = '#A8E63D',
}: {
  children: React.ReactNode
  href: string
  className?: string
  index?: number
  accent?: string
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      <Link
        href={href}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(14,14,14,0.85)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out pointer-events-none z-10"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
        {/* Hover radial glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 65% 55% at 10% 90%, ${accent}12, transparent)` }}
        />
        {children}
      </Link>
    </motion.div>
  )
}

/* ─── Component ──────────────────────────────────────────────── */
export default function WhatIsInsideBento() {
  return (
    <div>
      {/* Section header */}
      <div className="text-center mb-12">
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
          style={{ background: 'rgba(168,230,61,0.08)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.2)' }}
        >
          Everything in one place
        </span>
        <h2 className="section-title">What&apos;s Inside</h2>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(160px,auto)]">

        {/* ── Card 1: Jobs — wide (col-span-2) + tall ── */}
        <BentoCard href="/jobs" className="sm:col-span-2 row-span-2" index={0} accent="#A8E63D">
          <div className="relative flex flex-col h-full p-7 gap-4">
            {/* Large bg icon */}
            <div
              className="absolute -right-6 -bottom-6 opacity-[0.04] pointer-events-none"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.8} className="w-56 h-56" style={{ color: '#A8E63D' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>

            {/* Tag */}
            <span
              className="self-start text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.2)' }}
            >
              Updated daily
            </span>

            {/* Icon */}
            <div style={{ color: '#A8E63D' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="font-poppins font-bold text-white text-2xl mb-3">Tech Jobs &amp; Internships</h3>
              <p className="text-white/45 text-sm leading-relaxed max-w-sm">
                Freshers-friendly listings updated daily from top product companies and startups. Never miss an opportunity again.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {[['500+', 'Jobs listed'], ['Daily', 'Updates'], ['Free', 'Access']].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col">
                  <span className="font-poppins font-bold text-lg" style={{ color: '#A8E63D' }}>{val}</span>
                  <span className="text-white/30 text-[10px] mt-0.5">{lbl}</span>
                </div>
              ))}
            </div>

            <span className="text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 inline-block" style={{ color: '#A8E63D' }}>
              Browse jobs →
            </span>
          </div>
        </BentoCard>

        {/* ── Card 2: AI Tools ── */}
        <BentoCard href="/ai-tools" className="" index={1} accent="#9B7FE8">
          <div className="relative flex flex-col h-full p-6 gap-3">
            <div
              className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.8} className="w-32 h-32" style={{ color: '#9B7FE8' }}>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div style={{ color: '#9B7FE8' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <h3 className="font-poppins font-semibold text-white text-lg">AI Tools Directory</h3>
            <p className="text-white/40 text-sm leading-relaxed flex-1">
              Hand-picked AI tools every CS student should have in their toolkit.
            </p>
            <span className="text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 inline-block" style={{ color: '#9B7FE8' }}>
              Explore tools →
            </span>
          </div>
        </BentoCard>

        {/* ── Card 3: Study Roadmaps ── */}
        <BentoCard href="/resources/roadmaps" className="" index={2} accent="#A8E63D">
          <div className="relative flex flex-col h-full p-6 gap-3">
            <div
              className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.8} className="w-32 h-32" style={{ color: '#A8E63D' }}>
                <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3"/>
              </svg>
            </div>
            <div style={{ color: '#A8E63D' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3"/>
              </svg>
            </div>
            <h3 className="font-poppins font-semibold text-white text-lg">Study Roadmaps</h3>
            <p className="text-white/40 text-sm leading-relaxed flex-1">
              Structured paths for DSA, frontend, backend, and system design.
            </p>
            <span className="text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 inline-block" style={{ color: '#A8E63D' }}>
              View roadmaps →
            </span>
          </div>
        </BentoCard>

        {/* ── Card 4: Resume Hub ── */}
        <BentoCard href="/resources/resume-hub" className="" index={3} accent="#9B7FE8">
          <div className="relative flex flex-col h-full p-6 gap-3">
            <div
              className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.8} className="w-32 h-32" style={{ color: '#9B7FE8' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div style={{ color: '#9B7FE8' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 className="font-poppins font-semibold text-white text-lg">Resume Hub</h3>
            <p className="text-white/40 text-sm leading-relaxed flex-1">
              Free, ATS-ready resume templates for software engineers.
            </p>
            <span className="text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 inline-block" style={{ color: '#9B7FE8' }}>
              Get templates →
            </span>
          </div>
        </BentoCard>

        {/* ── Card 5: Interview Prep ── */}
        <BentoCard href="/resources/interview-prep" className="" index={4} accent="#A8E63D">
          <div className="relative flex flex-col h-full p-6 gap-3">
            <div style={{ color: '#A8E63D' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 className="font-poppins font-semibold text-white text-lg">Interview Prep</h3>
            <p className="text-white/40 text-sm leading-relaxed flex-1">
              Curated questions, tips and mock interview strategies to crack top tech companies.
            </p>
            <span className="text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 inline-block" style={{ color: '#A8E63D' }}>
              Start preparing →
            </span>
          </div>
        </BentoCard>

        {/* ── Card 6: Tech Articles — wide ── */}
        <BentoCard href="/blog" className="sm:col-span-2 lg:col-span-1" index={5} accent="#A8E63D">
          <div className="relative flex flex-col h-full p-6 gap-3">
            <div
              className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.8} className="w-32 h-32" style={{ color: '#A8E63D' }}>
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/>
              </svg>
            </div>
            <div style={{ color: '#A8E63D' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/>
                <path d="M18 14H6"/><path d="M15 18H6"/>
                <path d="M2 13h4"/><path d="M2 17h4"/>
              </svg>
            </div>
            <h3 className="font-poppins font-semibold text-white text-lg">Tech Articles</h3>
            <p className="text-white/40 text-sm leading-relaxed flex-1">
              Tips, interview prep guides and career advice written for freshers.
            </p>
            <span className="text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 inline-block" style={{ color: '#A8E63D' }}>
              Read articles →
            </span>
          </div>
        </BentoCard>

      </div>
    </div>
  )
}
