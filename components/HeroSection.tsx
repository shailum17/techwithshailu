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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const floatingCards = [
  { title: '200+ Courses',      sub: 'Curated for every skill level',    pos: 'top-28 left-4 xl:left-12',      rotate: -4 },
  { title: 'Active Community',  sub: 'Connect. Collaborate. Grow.',      pos: 'top-28 right-4 xl:right-12',    rotate:  4 },
  { title: 'Hands-on Projects', sub: 'Build. Ship. Add to portfolio.',   pos: 'bottom-48 left-4 xl:left-16',   rotate:  3 },
  { title: 'Track Progress',    sub: 'Stay consistent. Achieve more.',   pos: 'bottom-48 right-4 xl:right-16', rotate: -3 },
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
             style={{ background: '#0A0A0A' }}>

      {/* Dot grid */}
      <div className="hero-bg absolute inset-0 opacity-40 pointer-events-none" />

      {/* Hero radial glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,230,61,0.12), transparent)' }} />

      {/* Purple blob */}
      <div className="absolute top-1/4 left-1/3 w-[480px] h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
           style={{ background: 'rgba(155,127,232,0.4)' }} />
      {/* Lime blob */}
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
           style={{ background: 'rgba(168,230,61,0.5)' }} />

      {/* Floating feature cards — desktop only */}
      {floatingCards.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute hidden xl:block px-4 py-3 w-52 ${c.pos} rounded-2xl`}
          style={{
            rotate: c.rotate,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(168,230,61,0.18)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
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
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
          style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.3)' }}
        >
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="text-lime text-sm font-medium">Empowering CS Students Worldwide</span>
        </motion.div>

        {/* Staggered headline */}
        <motion.h1
          className="font-poppins font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-5
                     flex flex-wrap justify-center gap-x-4 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Radial glow behind headline */}
          <span className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(168,230,61,0.08), transparent)', zIndex: -1 }} />
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
            className="inline-block px-8 py-3.5 text-base rounded-xl font-semibold
                       text-ink-muted hover:text-ink transition-all duration-200"
            style={{ border: '1px solid #2A2A2A', background: 'transparent' }}
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
            {['bg-purple-brand', 'bg-lime', 'bg-blue-500', 'bg-pink-500'].map((bg, i) => (
              <div key={i}
                className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-xs font-bold text-black`}
                style={{ border: '2px solid #0A0A0A' }}>
                {['A','B','C','D'][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(168,230,61,0.12)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.3)' }}>
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
        <div className="rounded-2xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6"
             style={{ background: '#111111', border: '1px solid #2A2A2A', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
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
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
