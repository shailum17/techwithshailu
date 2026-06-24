'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

function useCountUp(end: number, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.28 } },
};
const wordVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const floatingCards = [
  { title: '200+ Courses',      sub: 'Curated for every skill level',          pos: 'top-28 left-4 xl:left-12',  rotate: -4 },
  { title: 'Active Community',  sub: 'Connect. Collaborate. Grow.',            pos: 'top-28 right-4 xl:right-12', rotate:  4 },
  { title: 'Hands-on Projects', sub: 'Build. Ship. Add to portfolio.',         pos: 'bottom-48 left-4 xl:left-16', rotate: 3 },
  { title: 'Track Progress',    sub: 'Stay consistent. Achieve more.',         pos: 'bottom-48 right-4 xl:right-16', rotate: -3 },
];

const statsData = [
  { label: 'Students',       end: 25000, suffix: 'K+', divisor: 1000 },
  { label: 'Courses',        end: 200,   suffix: '+',  divisor: 1 },
  { label: 'Projects Built', end: 1000,  suffix: 'K+', divisor: 1000 },
  { label: 'Expert Mentors', end: 50,    suffix: '+',  divisor: 1 },
];

function StatItem({ label, end, suffix, divisor }: typeof statsData[0]) {
  const raw     = useCountUp(end);
  const display = divisor > 1 ? (raw / divisor).toFixed(0) : raw;
  return (
    <div className="text-center">
      <p className="font-poppins font-bold text-2xl text-lime">{display}{suffix}</p>
      <p className="text-ink-muted text-xs mt-0.5">{label}</p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 bg-white">

      {/* Dot grid */}
      <div className="hero-bg absolute inset-0 opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      {/* Soft purple blob */}
      <div className="absolute top-1/4 left-1/3 w-[480px] h-[480px] bg-purple-tint rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-lime-light rounded-full blur-3xl opacity-70 pointer-events-none" />

      {/* Floating feature cards — desktop only */}
      {floatingCards.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute hidden xl:block glass-card px-4 py-3 w-52 ${c.pos}`}
          style={{ rotate: c.rotate }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 + i * 0.15, duration: 0.5 }}
        >
          <p className="text-ink font-semibold text-xs font-poppins">{c.title}</p>
          <p className="text-ink-muted text-xs mt-0.5 leading-snug">{c.sub}</p>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-lime-light border border-lime/30
                     rounded-full px-4 py-1.5 mb-7"
        >
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="text-lime text-sm font-medium">Empowering CS Students Worldwide</span>
        </motion.div>

        {/* Staggered headline */}
        <motion.h1
          className="font-poppins font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-5
                     flex flex-wrap justify-center gap-x-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {['Learn.', 'Build.'].map(w => (
            <motion.span key={w} variants={wordVariants} className="text-ink">{w}</motion.span>
          ))}
          <motion.span variants={wordVariants} className="text-lime">Grow.</motion.span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-ink-muted text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Your all-in-one platform to{' '}
          <span className="text-ink font-medium">learn computer science</span>,
          build real-world projects, and grow your career.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <MagneticButton
            href="/resources"
            className="btn-purple btn-primary-pulse inline-block px-8 py-3.5 text-base"
          >
            Start Learning Now
          </MagneticButton>
          <MagneticButton
            href="/resources"
            className="border border-surface-border text-ink font-semibold px-8 py-3.5 rounded-xl
                       hover:border-ink-faint hover:bg-surface-hover transition-all duration-200 inline-block text-base"
          >
            Explore Roadmaps
          </MagneticButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.55, duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {['bg-purple-brand', 'bg-lime', 'bg-blue-400', 'bg-pink-400'].map((bg, i) => (
              <div key={i}
                className={`w-8 h-8 rounded-full ${bg} border-2 border-white
                            flex items-center justify-center text-xs font-bold text-white`}>
                {['A','B','C','D'][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-lime-light text-lime text-xs font-bold px-2 py-0.5 rounded-full border border-lime/30">
              2K+
            </span>
            <span className="text-ink-muted text-sm">CS students learning together</span>
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl mx-auto mt-16 px-4"
      >
        <div className="bg-white border border-surface-border rounded-2xl shadow-card
                        px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map(s => <StatItem key={s.label} {...s} />)}
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.5 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-1 text-ink-faint"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
