'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';
import MagneticButton from './MagneticButton';

/* ─────────────────────────────────────────────────────────────
   GATEWAY FLOW CANVAS
   Bezier paths converging to center with flowing particles.
   Extracted + adapted from the Gateway Flow component.
───────────────────────────────────────────────────────────── */
function GatewayFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let destroyed = false;

    interface Particle { t: number; speed: number }
    interface Path {
      isLeft: boolean;
      startY: number;
      particles: Particle[];
    }

    let paths: Path[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas!.width  = width  * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
      buildPaths();
    }

    function buildPaths() {
      const num = 50;
      paths = [];
      for (let i = 0; i < num; i++) {
        paths.push({
          isLeft: i % 2 === 0,
          startY: (i / num) * height * 1.5 - height * 0.25,
          particles: [{ t: Math.random(), speed: 0.0012 + Math.random() * 0.0018 }],
        });
      }
    }

    function bezierPoint(
      t: number,
      p0: {x:number;y:number}, p1: {x:number;y:number},
      p2: {x:number;y:number}, p3: {x:number;y:number}
    ) {
      const u = 1 - t;
      return {
        x: u**3*p0.x + 3*u**2*t*p1.x + 3*u*t**2*p2.x + t**3*p3.x,
        y: u**3*p0.y + 3*u**2*t*p1.y + 3*u*t**2*p2.y + t**3*p3.y,
      };
    }

    function render() {
      if (destroyed) return;
      ctx!.clearRect(0, 0, width, height);

      const cx = width  / 2;
      const cy = height / 2;

      for (const path of paths) {
        const p0 = { x: path.isLeft ? 0    : width, y: path.startY };
        const p1 = { x: path.isLeft ? cx * 0.45 : width - cx * 0.45, y: path.startY };
        const p2 = { x: path.isLeft ? cx * 0.85 : width - cx * 0.85, y: cy };
        const p3 = { x: cx, y: cy };

        // Draw path line
        ctx!.beginPath();
        ctx!.moveTo(p0.x, p0.y);
        ctx!.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx!.strokeStyle = 'rgba(168, 230, 61, 0.04)';
        ctx!.lineWidth   = 0.8;
        ctx!.setLineDash([2, 6]);
        ctx!.stroke();
        ctx!.setLineDash([]);

        // Move + draw particles
        for (const p of path.particles) {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            path.startY += (Math.random() - 0.5) * 12;
          }
          const pos = bezierPoint(p.t, p0, p1, p2, p3);

          // Fade out particles near center to keep text clean
          const distFromCenter = Math.sqrt((pos.x - cx)**2 + (pos.y - cy)**2);
          const centerFade = Math.min(1, Math.max(0, (distFromCenter - 80) / 120));

          // Glow particle
          const grd = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 5);
          grd.addColorStop(0, `rgba(168,230,61,${0.55 * centerFade})`);
          grd.addColorStop(1, 'rgba(168,230,61,0)');
          ctx!.fillStyle = grd;
          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
          ctx!.fill();

          // Bright dot core
          ctx!.fillStyle = `rgba(200,255,100,${0.6 * centerFade})`;
          ctx!.fillRect(pos.x - 1, pos.y - 1, 2, 2);
        }
      }

      rafId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    render();

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─── Number Ticker ──────────────────────────────────────────── */
// Starts at `value` (never shows 0 on first paint), then re-animates
// from 0 → value once the element scrolls into view.
function NumberTicker({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  // Init at target so SSR / first paint always shows the real number
  const mVal   = useMotionValue(value);
  const spring = useSpring(mVal, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    // Animate from 0 → value when the stat enters the viewport
    mVal.set(0);
    requestAnimationFrame(() => mVal.set(value));
  }, [inView, mVal, value]);

  useEffect(() =>
    spring.on('change', v => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    }),
    [spring, suffix],
  );
  // Render the real number on the server; animation runs on top client-side
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

/* ─── Rotating word ──────────────────────────────────────────── */
const WORDS = ['Jobs', 'Tools', 'Roadmaps', 'Blogs'];
function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ minWidth: '200px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 54, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{ y: -54, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-lime"
        >
          {WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Floating character illustration ───────────────────────── */
function HeroCharacter() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-8 xl:right-16 z-10 hidden lg:block"
      style={{ width: 220 }}
    >
      {/* Lime glow under character */}
      <div
        className="absolute inset-x-4 bottom-0 h-16 rounded-full blur-2xl"
        style={{ background: 'rgba(168,230,61,0.18)' }}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
      {/* Developer sitting at laptop — flat illustration style */}
      <svg viewBox="0 0 220 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-[0_0_28px_rgba(168,230,61,0.2)]">

        {/* ── Chair ── */}
        <rect x="55" y="155" width="110" height="12" rx="6" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
        <rect x="62" y="108" width="11" height="49" rx="5" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
        <line x1="65" y1="167" x2="60" y2="225" stroke="#222" strokeWidth="5" strokeLinecap="round"/>
        <line x1="155" y1="167" x2="160" y2="225" stroke="#222" strokeWidth="5" strokeLinecap="round"/>
        <line x1="60" y1="225" x2="76" y2="225" stroke="#222" strokeWidth="4" strokeLinecap="round"/>
        <line x1="160" y1="225" x2="144" y2="225" stroke="#222" strokeWidth="4" strokeLinecap="round"/>

        {/* ── Person legs ── */}
        <path d="M88 155 Q86 183 82 202 Q80 210 76 213" stroke="#A8E63D" strokeWidth="13" strokeLinecap="round" fill="none"/>
        <path d="M122 155 Q124 183 128 202 Q130 210 134 213" stroke="#A8E63D" strokeWidth="13" strokeLinecap="round" fill="none"/>
        <ellipse cx="74" cy="215" rx="13" ry="6" fill="#1a1a1a"/>
        <ellipse cx="136" cy="215" rx="13" ry="6" fill="#1a1a1a"/>

        {/* ── Laptop ── */}
        <rect x="72" y="134" width="76" height="24" rx="5" fill="#111" stroke="#333" strokeWidth="1.5"/>
        <rect x="76" y="92" width="68" height="44" rx="5" fill="#111" stroke="#A8E63D" strokeWidth="1.5"/>
        <rect x="80" y="96" width="60" height="36" rx="3" fill="rgba(168,230,61,0.06)"/>
        <line x1="84" y1="104" x2="106" y2="104" stroke="#A8E63D" strokeWidth="2" strokeLinecap="round"/>
        <line x1="84" y1="111" x2="118" y2="111" stroke="rgba(168,230,61,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="88" y1="118" x2="113" y2="118" stroke="rgba(168,230,61,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="88" y1="125" x2="107" y2="125" stroke="rgba(168,230,61,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="109" y="125" width="2" height="7" rx="1" fill="#A8E63D" opacity="0.9"/>

        {/* ── Torso ── */}
        <rect x="82" y="88" width="56" height="50" rx="14" fill="#A8E63D"/>
        <path d="M104 88 L110 100 L116 88" fill="#7ab82a"/>

        {/* ── Arms ── */}
        <path d="M138 106 Q148 118 144 136" stroke="#e8c49a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M82 106 Q72 118 76 136" stroke="#e8c49a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <ellipse cx="142" cy="139" rx="9" ry="7" fill="#e8c49a"/>
        <ellipse cx="78" cy="139" rx="9" ry="7" fill="#e8c49a"/>

        {/* ── Neck + Head ── */}
        <rect x="104" y="70" width="12" height="20" rx="6" fill="#e8c49a"/>
        <ellipse cx="110" cy="56" rx="28" ry="26" fill="#e8c49a"/>

        {/* ── Hair ── */}
        <path d="M83 48 Q84 24 110 24 Q136 24 137 48 Q130 36 110 38 Q90 36 83 48Z" fill="#1a0e00"/>
        <path d="M83 48 Q80 58 84 66" stroke="#1a0e00" strokeWidth="4" strokeLinecap="round" fill="none"/>

        {/* ── Face ── */}
        <ellipse cx="100" cy="54" rx="4" ry="4.5" fill="white"/>
        <ellipse cx="120" cy="54" rx="4" ry="4.5" fill="white"/>
        <circle cx="101" cy="55" r="2.5" fill="#1a0e00"/>
        <circle cx="121" cy="55" r="2.5" fill="#1a0e00"/>
        <circle cx="102" cy="54" r="1" fill="white"/>
        <circle cx="122" cy="54" r="1" fill="white"/>
        <path d="M103 64 Q110 69 117 64" stroke="#c47a4a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M96 48 Q100 45 104 48" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M116 48 Q120 45 124 48" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

        {/* ── Headphones ── */}
        <path d="M83 48 Q82 28 110 26 Q138 28 137 48" stroke="#333" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <rect x="79" y="46" width="9" height="11" rx="4" fill="#222" stroke="#A8E63D" strokeWidth="1"/>
        <rect x="132" y="46" width="9" height="11" rx="4" fill="#222" stroke="#A8E63D" strokeWidth="1"/>

        {/* ── Sparkles ── */}
        <circle cx="178" cy="62" r="2.5" fill="#A8E63D" opacity="0.7"/>
        <circle cx="28" cy="88" r="2" fill="#A8E63D" opacity="0.45"/>
        <path d="M190 98 L191 101.5 L194.5 101.5 L192 103.5 L193 107 L190 105 L187 107 L188 103.5 L185.5 101.5 L189 101.5 Z" fill="#A8E63D" opacity="0.55"/>
      </svg>
      </motion.div>
    </div>
  );
}

/* ─── Chip marquee ───────────────────────────────────────────── */
const CHIPS = ['Freshers Jobs','AI Tools','DSA Roadmap','Resume Templates','Free Courses','Interview Prep','Project Ideas','Tech Blogs'];

interface HeroStats {
  students: number;
  jobs:      number;
  tools:     number;
  resources: number;
}

/* ─── HeroSection ────────────────────────────────────────────── */
export default function HeroSection({ stats }: { stats?: HeroStats }) {
  const liveStats = [
    { label: 'Students Reached', value: stats?.students ?? 0,   suffix: '+' },
    { label: 'Jobs Listed',       value: stats?.jobs      ?? 0,  suffix: '+' },
    { label: 'AI Tools',          value: stats?.tools     ?? 0,  suffix: '+' },
    { label: 'Free Resources',    value: stats?.resources ?? 50, suffix: '+' },
  ];
  const containerRef = useRef<HTMLDivElement>(null);

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yStats   = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const fade     = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale    = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  /* Mouse parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smX    = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const smY    = useSpring(mouseY, { stiffness: 50, damping: 25 });
  const bx1    = useTransform(smX, [-400, 400], [-28, 28]);
  const by1    = useTransform(smY, [-400, 400], [-28, 28]);
  const bx2    = useTransform(smX, [-400, 400], [18, -18]);
  const by2    = useTransform(smY, [-400, 400], [18, -18]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth  / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28"
      style={{ background: '#080808' }}
    >
      {/* ── Gateway Flow canvas background ── */}
      <GatewayFlowCanvas />

      {/* ── Dither grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          opacity: 0.04,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23ffffff'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%23ffffff'/%3E%3C/svg%3E\")",
          backgroundSize: '2px 2px',
        }}
      />

      {/* ── Radial center vignette (draws eye to center) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 20%, rgba(8,8,8,0.85) 100%)',
        }}
      />

      {/* ── Top lime atmospheric glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'radial-gradient(ellipse 60% 35% at 50% -5%, rgba(168,230,61,0.12), transparent)',
        }}
      />

      {/* ── Mouse-parallax blobs ── */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          zIndex: 2, width: 600, height: 600,
          top: '5%', left: '18%',
          background: 'radial-gradient(circle, rgba(155,127,232,0.14) 0%, transparent 70%)',
          x: bx1, y: by1,
        }}
      />
      <motion.div
        className="absolute rounded-full blur-2xl pointer-events-none"
        style={{
          zIndex: 2, width: 350, height: 350,
          bottom: '10%', right: '12%',
          background: 'radial-gradient(circle, rgba(168,230,61,0.1) 0%, transparent 70%)',
          x: bx2, y: by2,
        }}
      />

      {/* ── Illustration character ── */}
      <HeroCharacter />

      {/* ── Main content ── */}
      <motion.div
        className="relative text-center px-4 max-w-4xl mx-auto"
        style={{ zIndex: 10, y: yContent, opacity: fade, scale }}
      >
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 cursor-default"
          style={{ background: 'rgba(168,230,61,0.07)', border: '1px solid rgba(168,230,61,0.22)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
          <span className="text-lime text-sm font-medium tracking-wide">Built for CS Students in India</span>
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-poppins font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.1] text-center text-balance"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-white">Your One-Stop Hub for Tech </span>
            <RotatingWord />
          </motion.h1>
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mt-5 mb-10 leading-relaxed font-light"
        >
          Curated{' '}
          <span className="text-lime font-medium">jobs, AI tools, roadmaps & blogs</span>
          {' '}— everything a CS fresher needs to{' '}
          <span className="text-white font-medium">land their dream role.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <MagneticButton href="/jobs" className="btn-lime btn-primary-pulse inline-block px-10 py-4 text-base font-bold rounded-xl">
            Browse Jobs
          </MagneticButton>
          <MagneticButton
            href="/resources"
            className="inline-block px-10 py-4 text-base rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/8 transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)' }}
          >
            Explore Resources
          </MagneticButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="flex items-center justify-center gap-2.5"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
            style={{ background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse"/>
            2K+
          </span>
          <span className="text-gray-400 text-sm">students already learning together</span>
        </motion.div>
      </motion.div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 10, y: yStats }}
        className="relative w-full max-w-3xl mx-auto mt-16 px-4"
      >
        <div
          className="relative rounded-2xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 overflow-hidden"
          style={{
            background: 'rgba(8,8,8,0.9)',
            border: '1px solid rgba(168,230,61,0.12)',
            boxShadow: '0 4px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(168,230,61,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Animated sweep line */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
            <motion.div
              className="h-px w-28 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #A8E63D, transparent)' }}
              animate={{ x: ['-10%', '110%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />
          </div>
          {liveStats.map(({ label, value, suffix }, i) => (
            <motion.div key={label} className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}>
              <p className="font-poppins font-bold text-2xl text-lime tabular-nums">
                <NumberTicker value={value} suffix={suffix} />
              </p>
              <p className="text-gray-400 text-xs mt-1 font-light">{label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Chip marquee ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        style={{ zIndex: 10 }}
        className="relative w-full mt-10 overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #080808, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #080808, transparent)' }} />
        <div className="flex gap-3 w-max animate-marquee-chips">
          {[...CHIPS, ...CHIPS].map((chip, i) => (
            <span key={i}
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-light text-slate-500 flex-shrink-0 tracking-wide"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {chip}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        style={{ zIndex: 10, opacity: fade }}
        className="relative mt-10 flex flex-col items-center gap-1 text-slate-600"
      >
        <span className="text-xs tracking-[0.2em] uppercase font-light">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
