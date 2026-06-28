'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Animated code editor with typing effect + tool cards
function DevToolsAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  const tools = [
    { name: 'VS Code',    desc: 'Editor',     color: '#60a5fa' },
    { name: 'Postman',    desc: 'API testing', color: '#fb923c' },
    { name: 'Docker',     desc: 'Containers',  color: '#60a5fa' },
    { name: 'GitHub CLI', desc: 'Version ctrl',color: '#4ade80' },
    { name: 'Warp',       desc: 'Terminal',    color: '#a78bfa' },
    { name: 'Fig',        desc: 'Autocomplete',color: '#fbbf24' },
  ];

  const codeLines = [
    { text: 'const tools = [',   color: '#e2e8f0' },
    { text: '  "VS Code",',      color: '#fb923c' },
    { text: '  "Postman",',      color: '#fb923c' },
    { text: '  "Docker",',       color: '#fb923c' },
    { text: '  // + many more',  color: '#4a5568' },
    { text: '];',                color: '#e2e8f0' },
    { text: '// Coming soon ✨', color: '#4ade80' },
  ];

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      const createTimeline = mod.createTimeline;
      if (!animate || !createTimeline) return;
      const el = ref.current;
      if (!el) return;

      // Type code lines one by one
      const lines = el.querySelectorAll('.code-line');
      lines.forEach((line, i) => {
        (line as HTMLElement).style.opacity = '0';
        animate(line as HTMLElement, {
          opacity: [{ from: 0, to: 1 }],
          duration: 200,
          delay: i * 280 + 400,
          ease: 'linear',
        });
      });

      // Cursor blink
      const cursor = el.querySelector('#code-cursor') as HTMLElement;
      if (cursor) {
        animate(cursor, {
          opacity: [{ to: 0 }, { to: 1 }],
          duration: 530,
          loop: true,
          alternate: true,
          ease: 'steps(1)',
        });
      }

      // Tool pills float in
      const pills = el.querySelectorAll('.tool-pill');
      pills.forEach((p, i) => {
        (p as HTMLElement).style.opacity = '0';
        animate(p as HTMLElement, {
          opacity:    [{ from: 0, to: 1 }],
          translateY: [{ from: 10, to: 0 }],
          duration: 400,
          delay: i * 100 + 2400,
          ease: 'outBack',
        });
      });

      // Screen glow pulse
      const glow = el.querySelector('#editor-glow') as HTMLElement;
      if (glow) {
        animate(glow, {
          opacity: [{ to: 0.03 }, { to: 0.08 }],
          duration: 2000,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        });
      }
    });
  }, []);

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto flex flex-col gap-4">

      {/* Code editor */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: '#0d1117', border: '1px solid rgba(251,146,60,0.2)' }}>
        <div id="editor-glow" className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: '#fb923c', opacity: 0.05 }} />
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: '#161b22', borderBottom: '1px solid #1e2a3a' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          <span className="ml-3 text-xs font-mono" style={{ color: '#4a5568' }}>devtools.ts</span>
        </div>
        {/* Code */}
        <div className="p-4 font-mono text-sm">
          <div className="flex gap-4">
            <div className="flex flex-col text-right select-none text-xs leading-6" style={{ color: '#2d3748', minWidth: '1rem' }}>
              {codeLines.map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <div className="flex-1">
              {codeLines.map((line, i) => (
                <div key={i} className="code-line leading-6" style={{ color: line.color }}>
                  {line.text}
                  {i === codeLines.length - 1 && (
                    <span id="code-cursor" className="inline-block w-2 h-4 ml-0.5 align-middle rounded-sm"
                      style={{ background: '#fb923c' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tool pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {tools.map((t, i) => (
          <div key={i} className="tool-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${t.color}12`, border: `1px solid ${t.color}35`, color: t.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
            {t.name}
            <span className="text-xs opacity-60">· {t.desc}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function DeveloperToolsPage() {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <nav className="text-sm text-ink-muted mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">Developer Tools</span>
        </nav>
        <div className="flex flex-col items-center text-center gap-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c', letterSpacing: '0.08em' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#fb923c' }} />
              DEVELOPER TOOLS
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full">
            <DevToolsAnimation />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-ink mb-3">Coming Soon</h1>
            <p className="text-ink-muted text-sm max-w-sm mx-auto leading-relaxed">Extensions, debuggers, API clients and productivity tools — curated to make you a faster, sharper developer.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="flex flex-col sm:flex-row gap-3 items-center">
            <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer" className="btn-purple text-sm py-2.5 px-6">Get Notified</a>
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
