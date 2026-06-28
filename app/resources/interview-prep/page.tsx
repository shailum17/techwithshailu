'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedBg from '@/components/AnimatedBg';

// Animated Q&A cards floating with a question/answer reveal loop
function InterviewAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      const createTimeline = mod.createTimeline;
      if (!animate || !createTimeline) return;
      const el = ref.current;
      if (!el) return;

      // Cards float up independently
      const cards = el.querySelectorAll('.qa-card');
      cards.forEach((card, i) => {
        animate(card as HTMLElement, {
          translateY: [{ to: -10 }, { to: 0 }],
          duration: 2200 + i * 400,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
          delay: i * 300,
        });
      });

      // Progress bar fills then resets
      const bar = el.querySelector('#prog-bar') as HTMLElement;
      if (bar) {
        animate(bar, {
          width: [{ from: '0%', to: '100%' }],
          duration: 3000,
          loop: true,
          ease: 'inOutQuart',
          delay: 400,
        });
      }

      // Dots pulse stagger
      const dots = el.querySelectorAll('.pulse-dot');
      dots.forEach((d, i) => {
        animate(d as HTMLElement, {
          scale: [{ to: 1.5 }, { to: 1 }],
          opacity: [{ to: 0.3 }, { to: 1 }],
          duration: 900,
          loop: true,
          alternate: true,
          delay: i * 200,
          ease: 'inOutSine',
        });
      });

      // Checkmarks pop in sequence
      const checks = el.querySelectorAll('.check-item');
      const tl = createTimeline({ defaults: { ease: 'outBack' } });
      checks.forEach((c, i) => {
        (c as HTMLElement).style.opacity = '0';
        (c as HTMLElement).style.transform = 'translateX(-12px)';
        tl.add(c as HTMLElement, {
          opacity: [{ from: 0, to: 1 }],
          translateX: [{ from: -12, to: 0 }],
          duration: 500,
          delay: i * 350 + 600,
        });
      });
    });
  }, []);

  const color = '#fbbf24';

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto relative" style={{ height: 320 }}>

      {/* Central question bubble */}
      <div className="qa-card absolute left-1/2 top-8 -translate-x-1/2 px-6 py-4 rounded-2xl text-center"
        style={{ background: `${color}12`, border: `1.5px solid ${color}40`, minWidth: 200 }}>
        <p className="text-xs font-mono mb-1" style={{ color: `${color}80` }}>Question 01</p>
        <p className="text-sm font-semibold text-ink">Explain Big O Notation</p>
      </div>

      {/* Answer card left */}
      <div className="qa-card absolute left-0 top-36 px-4 py-3 rounded-xl"
        style={{ background: '#111', border: '1.5px solid #2a2a2a', maxWidth: 148 }}>
        <p className="text-xs font-mono mb-1 text-ink-faint">Time complexity</p>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1e1e' }}>
          <div id="prog-bar" className="h-full rounded-full" style={{ background: color, width: '0%' }} />
        </div>
      </div>

      {/* Answer card right */}
      <div className="qa-card absolute right-0 top-32 px-4 py-3 rounded-xl"
        style={{ background: '#111', border: '1.5px solid #2a2a2a', maxWidth: 148 }}>
        <p className="text-xs font-mono mb-2 text-ink-faint">Complexity</p>
        <div className="flex gap-1.5 items-end">
          {[3, 5, 4, 7, 6, 8, 5].map((h, i) => (
            <div key={i} className="w-3 rounded-sm" style={{ height: h * 4, background: `${color}${50 + i * 10}` }} />
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-2" style={{ minWidth: 200 }}>
        {['DSA Patterns', 'System Design', 'Behavioral Q&A', 'Mock Rounds'].map((item, i) => (
          <div key={i} className="check-item flex items-center gap-2">
            <div className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ background: `${color}20`, border: `1px solid ${color}60` }} />
            <span className="text-xs text-ink-muted">{item}</span>
          </div>
        ))}
      </div>

      {/* Pulse dots */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        ))}
      </div>

    </div>
  );
}

export default function InterviewPrepPage() {
  return (
    <div className="pt-20 min-h-screen pb-20 relative" style={{ background: '#0A0A0A' }}>
      <AnimatedBg variant="grid" color="#fbbf24" opacity={0.35} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <nav className="text-sm text-ink-muted mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">Interview Prep</span>
        </nav>
        <div className="flex flex-col items-center text-center gap-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', letterSpacing: '0.08em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              INTERVIEW PREP
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full">
            <InterviewAnimation />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-ink mb-3">Coming Soon</h1>
            <p className="text-ink-muted text-sm max-w-sm mx-auto leading-relaxed">Don&apos;t sweat it — we&apos;re building a complete interview prep hub with DSA patterns, system design, mock rounds and behavioral Q&amp;As.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="flex flex-col sm:flex-row gap-3 items-center">
            <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer" className="btn-purple text-sm py-2.5 px-6">Get Notified</a>
            <Link href="/resources" className="text-sm text-ink-muted hover:text-lime transition-colors">
              ← Back to Resources
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
