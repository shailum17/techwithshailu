'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedBg from '@/components/AnimatedBg';

// Animated code snippet cards orbiting a central terminal
function CheatSheetsAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  const snippets = [
    { label: 'JS',  code: 'arr.map(fn)',         color: '#fbbf24' },
    { label: 'PY',  code: 'list(map(f,l))',       color: '#60a5fa' },
    { label: 'SQL', code: 'SELECT * FROM',         color: '#4ade80' },
    { label: 'GIT', code: 'git stash pop',         color: '#f472b6' },
    { label: 'CSS', code: 'display:grid',          color: '#a78bfa' },
    { label: 'TS',  code: 'type T = A & B',        color: '#fb923c' },
  ];

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      if (!animate) return;
      const el = ref.current;
      if (!el) return;

      // Each card floats independently
      const cards = el.querySelectorAll('.snippet-card');
      cards.forEach((card, i) => {
        animate(card as HTMLElement, {
          translateY: [{ to: -8 }, { to: 4 }],
          translateX: [{ to: i % 2 === 0 ? 4 : -4 }],
          duration: 1800 + i * 300,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
          delay: i * 200,
        });
      });

      // Center terminal cursor blinks
      const cursor = el.querySelector('#term-cursor') as HTMLElement;
      if (cursor) {
        animate(cursor, {
          opacity: [{ to: 0 }, { to: 1 }],
          duration: 500,
          loop: true,
          alternate: true,
          ease: 'steps(1)',
        });
      }

      // Typing line grows
      const typeLine = el.querySelector('#type-line') as HTMLElement;
      if (typeLine) {
        animate(typeLine, {
          width: [{ from: '0%', to: '80%' }, { to: '0%' }],
          duration: 2800,
          loop: true,
          ease: 'inOutQuart',
          delay: 600,
        });
      }

      // Tag badges pop in
      const tags = el.querySelectorAll('.lang-tag');
      tags.forEach((t, i) => {
        animate(t as HTMLElement, {
          scale: [{ from: 0.7, to: 1 }],
          opacity: [{ from: 0, to: 1 }],
          duration: 400,
          delay: i * 120 + 300,
          ease: 'outBack',
        });
      });
    });
  }, []);

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto relative" style={{ height: 340 }}>

      {/* Central terminal */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden z-10"
        style={{ background: '#0d1117', border: '1.5px solid #4ade8040', width: 180 }}>
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: '#161b22', borderBottom: '1px solid #1e2a3a' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div className="p-3 font-mono text-xs">
          <div className="flex items-center gap-1 mb-2">
            <span style={{ color: '#4ade80' }}>$</span>
            <div id="type-line" className="h-2 rounded-sm" style={{ background: '#4ade8060', width: '0%' }} />
            <span id="term-cursor" className="inline-block w-1.5 h-3.5 ml-0.5 rounded-sm" style={{ background: '#4ade80' }} />
          </div>
          <div className="flex gap-1 flex-wrap mt-1">
            {snippets.map((s, i) => (
              <span key={i} className="lang-tag px-1.5 py-0.5 rounded text-xs font-bold"
                style={{ background: `${s.color}20`, color: s.color, opacity: 0 }}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Orbiting snippet cards */}
      {snippets.map((s, i) => {
        const angle = (i / snippets.length) * 360;
        const rad   = angle * (Math.PI / 180);
        const rx = 130, ry = 110;
        const x = 160 + Math.cos(rad) * rx - 60;
        const y = 160 + Math.sin(rad) * ry - 24;
        return (
          <div key={i} className="snippet-card absolute px-3 py-2 rounded-xl"
            style={{ left: x, top: y, background: '#111', border: `1px solid ${s.color}35`, minWidth: 110 }}>
            <p className="text-xs font-bold mb-0.5" style={{ color: s.color }}>{s.label}</p>
            <p className="text-xs font-mono text-ink-faint">{s.code}</p>
          </div>
        );
      })}

    </div>
  );
}

export default function CheatSheetsPage() {
  return (
    <div className="pt-20 min-h-screen pb-20 relative" style={{ background: '#0A0A0A' }}>
      <AnimatedBg variant="particles" color="#4ade80" opacity={0.55} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <nav className="text-sm text-ink-muted mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">Coding Cheat Sheets</span>
        </nav>
        <div className="flex flex-col items-center text-center gap-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', letterSpacing: '0.08em' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} />
              CHEAT SHEETS
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full">
            <CheatSheetsAnimation />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-ink mb-3">Coming Soon</h1>
            <p className="text-ink-muted text-sm max-w-sm mx-auto leading-relaxed">Quick-reference sheets for every language and framework — JavaScript, Python, SQL, Git, CSS, TypeScript and more.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="flex flex-col sm:flex-row gap-3 items-center">
            <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer" className="btn-lime text-sm py-2.5 px-6">Get Notified</a>
            <Link href="/resources" className="text-sm text-ink-muted hover:text-lime transition-colors">
              ← Back to Resources
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
