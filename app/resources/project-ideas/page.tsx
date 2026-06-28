'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedBg from '@/components/AnimatedBg';

// Animated kanban-style board with cards sliding between columns
function ProjectIdeasAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  const ideas = [
    { title: 'AI Chat App',     stack: 'Next.js + OpenAI',  color: '#a78bfa' },
    { title: 'Dev Portfolio',   stack: 'React + Tailwind',   color: '#60a5fa' },
    { title: 'REST API',        stack: 'Node + MongoDB',     color: '#4ade80' },
    { title: 'CLI Tool',        stack: 'Python + Click',     color: '#fbbf24' },
    { title: 'Auth System',     stack: 'Next.js + JWT',      color: '#f472b6' },
    { title: 'Discord Bot',     stack: 'discord.js',         color: '#fb923c' },
  ];

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      const createTimeline = mod.createTimeline;
      if (!animate || !createTimeline) return;
      const el = ref.current;
      if (!el) return;

      // Cards slide in from bottom staggered
      const cards = el.querySelectorAll('.idea-card');
      cards.forEach((c, i) => {
        (c as HTMLElement).style.opacity = '0';
        (c as HTMLElement).style.transform = 'translateY(20px)';
        animate(c as HTMLElement, {
          opacity:    [{ from: 0, to: 1 }],
          translateY: [{ from: 20, to: 0 }],
          duration: 500,
          delay: i * 150 + 300,
          ease: 'outBack',
        });
      });

      // Each card gently bobs
      cards.forEach((c, i) => {
        animate(c as HTMLElement, {
          translateY: [{ to: -5 }, { to: 0 }],
          duration: 2000 + i * 200,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
          delay: i * 200 + 1500,
        });
      });

      // Lightbulb pulse
      const bulb = el.querySelector('#bulb-glow') as HTMLElement;
      if (bulb) {
        animate(bulb, {
          scale:   [{ to: 1.15 }, { to: 1 }],
          opacity: [{ to: 0.4  }, { to: 1 }],
          duration: 1800,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        });
      }
    });
  }, []);

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto" style={{ minHeight: 300 }}>

      {/* Lightbulb header */}
      <div className="flex justify-center mb-6">
        <div id="bulb-glow" className="w-14 h-14 rounded-full"
          style={{ background: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.4)' }} />
      </div>

      {/* Idea cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {ideas.map((idea, i) => (
          <div key={i} className="idea-card rounded-xl p-3"
            style={{ background: '#111', border: `1px solid ${idea.color}30` }}>
            <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ background: idea.color }} />
            <p className="text-xs font-semibold text-ink mb-1">{idea.title}</p>
            <p className="text-xs font-mono" style={{ color: idea.color, opacity: 0.7 }}>{idea.stack}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function ProjectIdeasPage() {
  return (
    <div className="pt-20 min-h-screen pb-20 relative" style={{ background: '#0A0A0A' }}>
      <AnimatedBg variant="waves" color="#a78bfa" opacity={0.45} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <nav className="text-sm text-ink-muted mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">Project Ideas</span>
        </nav>
        <div className="flex flex-col items-center text-center gap-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', letterSpacing: '0.08em' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }} />
              PROJECT IDEAS
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full">
            <ProjectIdeasAnimation />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-ink mb-3">Coming Soon</h1>
            <p className="text-ink-muted text-sm max-w-sm mx-auto leading-relaxed">Curated project ideas from beginner to advanced — with tech stack suggestions, feature lists and GitHub starter templates.</p>
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
