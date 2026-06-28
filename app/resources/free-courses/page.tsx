'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Animated course progress cards with filling bars
function FreeCoursesAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  const courses = [
    { title: 'Web Development',  pct: 88, color: '#f472b6', platform: 'freeCodeCamp'  },
    { title: 'Data Structures',  pct: 72, color: '#60a5fa', platform: 'CS50'           },
    { title: 'Machine Learning', pct: 55, color: '#4ade80', platform: 'fast.ai'        },
    { title: 'System Design',    pct: 40, color: '#fbbf24', platform: 'ByteByteGo'     },
    { title: 'Cloud & DevOps',   pct: 63, color: '#a78bfa', platform: 'AWS Skill Builder' },
  ];

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      const createTimeline = mod.createTimeline;
      if (!animate || !createTimeline) return;
      const el = ref.current;
      if (!el) return;

      // Rows slide in
      const rows = el.querySelectorAll('.course-row');
      rows.forEach((row, i) => {
        (row as HTMLElement).style.opacity = '0';
        animate(row as HTMLElement, {
          opacity:    [{ from: 0, to: 1 }],
          translateX: [{ from: -16, to: 0 }],
          duration: 500,
          delay: i * 180 + 300,
          ease: 'outExpo',
        });
      });

      // Bars fill
      const bars = el.querySelectorAll('.fill-bar') as NodeListOf<HTMLElement>;
      bars.forEach((bar, i) => {
        const target = bar.dataset.pct ?? '50';
        animate(bar, {
          width: [{ from: '0%', to: `${target}%` }],
          duration: 1200,
          delay: i * 180 + 700,
          ease: 'outQuart',
        });
      });

      // Central ring pulses
      const ring = el.querySelector('#progress-ring') as HTMLElement;
      if (ring) {
        animate(ring, {
          scale:   [{ to: 1.06 }, { to: 1 }],
          opacity: [{ to: 0.5  }, { to: 1 }],
          duration: 2000,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        });
      }
    });
  }, []);

  const avg = Math.round(courses.reduce((s, c) => s + c.pct, 0) / courses.length);

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto flex flex-col gap-4">

      {/* Top ring stat */}
      <div className="flex justify-center mb-2">
        <div id="progress-ring" className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'conic-gradient(#f472b6 0% 63%, #1e1e1e 63%)', padding: 3 }}>
          <div className="w-full h-full rounded-full flex flex-col items-center justify-center"
            style={{ background: '#0a0a0a' }}>
            <span className="font-poppins font-bold text-lg" style={{ color: '#f472b6' }}>{avg}%</span>
            <span className="text-xs text-ink-faint">curated</span>
          </div>
        </div>
      </div>

      {/* Course rows */}
      {courses.map((c, i) => (
        <div key={i} className="course-row">
          <div className="flex justify-between items-center mb-1.5">
            <div>
              <span className="text-xs font-semibold text-ink">{c.title}</span>
              <span className="text-xs text-ink-faint ml-2">· {c.platform}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: c.color }}>{c.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
            <div className="fill-bar h-full rounded-full" data-pct={c.pct}
              style={{ background: c.color, width: 0 }} />
          </div>
        </div>
      ))}

    </div>
  );
}

export default function FreeCoursesPage() {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <nav className="text-sm text-ink-muted mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">Free Courses</span>
        </nav>
        <div className="flex flex-col items-center text-center gap-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.3)', color: '#f472b6', letterSpacing: '0.08em' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f472b6' }} />
              FREE COURSES
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full">
            <FreeCoursesAnimation />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-ink mb-3">Coming Soon</h1>
            <p className="text-ink-muted text-sm max-w-sm mx-auto leading-relaxed">Hand-picked free courses from the best platforms — no paywalls, just quality learning from beginner to advanced.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="flex flex-col sm:flex-row gap-3 items-center">
            <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer" className="btn-lime text-sm py-2.5 px-6">Get Notified</a>
            <Link href="/resources" className="text-sm text-ink-muted hover:text-lime transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Resources
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
