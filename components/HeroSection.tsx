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
      const num = 90;
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
        ctx!.strokeStyle = 'rgba(168, 230, 61, 0.07)';
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

          // Glow particle
          const grd = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 5);
          grd.addColorStop(0, 'rgba(168,230,61,0.9)');
          grd.addColorStop(1, 'rgba(168,230,61,0)');
          ctx!.fillStyle = grd;
          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
          ctx!.fill();

          // Bright dot core
          ctx!.fillStyle = 'rgba(200,255,100,0.95)';
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
      style={{ zIndex: 1 }}
    />
  );
}

/* ─── Number Ticker ──────────────────────────────────────────── */
function NumberTicker({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  const mVal   = useMotionValue(0);
  const spring = useSpring(mVal, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true });
  useEffect(() => { if (inView) mVal.set(value); }, [inView, mVal, value]);
  useEffect(() =>
    spring.on('change', v => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix; }),
    [spring, suffix]
  );
  return <span ref={ref}>0{suffix}</span>;
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

/* ─── Floating card ──────────────────────────────────────────── */
function FloatCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ delay: 1.4 + delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`hidden xl:flex items-center gap-2.5 absolute px-3.5 py-2.5 rounded-2xl text-xs font-medium select-none ${className}`}
      style={{
        background: 'rgba(8,8,8,0.75)',
        border: '1px solid rgba(168,230,61,0.2)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(168,230,61,0.06)',
      }}
    >
      {children}
    </motion.div>
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
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

      {/* ── Floating context cards ── */}
      <FloatCard className="top-[22%] left-[5%] -rotate-3" delay={0}>
        <span className="w-2 h-2 rounded-full bg-lime animate-pulse flex-shrink-0" />
        <span className="text-ink">200+ Jobs this week</span>
      </FloatCard>
      <FloatCard className="top-[30%] right-[5%] rotate-2" delay={0.12}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 text-purple-brand flex-shrink-0">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <span className="text-ink">New AI Tool: Gemini 2.5</span>
      </FloatCard>
      <FloatCard className="bottom-[32%] left-[4%] rotate-2" delay={0.24}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 text-lime flex-shrink-0">
          <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3"/>
        </svg>
        <span className="text-ink">DSA Roadmap updated</span>
      </FloatCard>
      <FloatCard className="bottom-[28%] right-[4%] -rotate-2" delay={0.36}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 text-lime flex-shrink-0">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span className="text-ink">2000+ students joined</span>
      </FloatCard>

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
            className="font-poppins font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.1]"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-white block">Your One-Stop Hub</span>
            <span className="text-white">for Tech </span>
            <RotatingWord />
          </motion.h1>
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-5 mb-10 leading-relaxed font-light"
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
            className="inline-block px-10 py-4 text-base rounded-xl font-semibold text-slate-300 hover:text-lime transition-all duration-200"
            style={{ border: '1px solid rgba(168,230,61,0.2)', background: 'rgba(168,230,61,0.03)' }}
          >
            Explore Resources
          </MagneticButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2.5">
            {[
              { bg: 'bg-purple-brand', t: 'R' },
              { bg: 'bg-lime',         t: 'A' },
              { bg: 'bg-blue-500',     t: 'S' },
              { bg: 'bg-pink-500',     t: 'P' },
              { bg: 'bg-amber-400',    t: 'M' },
            ].map(({ bg, t }, i) => (
              <div key={i}
                className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-xs font-bold text-black`}
                style={{ border: '2px solid #080808' }}>
                {t}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.25)' }}>
              2K+
            </span>
            <span className="text-slate-500 text-sm font-light">students learning together</span>
          </div>
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
              <p className="text-slate-500 text-xs mt-1 font-light">{label}</p>
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
