'use client';

import { motion } from 'framer-motion';

/* ── individual animated floating icon ───────────────────────── */
function FloatingIcon({
  children,
  x,
  y,
  size,
  color,
  rotate,
  duration,
  delay = 0,
  floatY = 18,
}: {
  children: React.ReactNode;
  x: string;
  y: string;
  size: number;
  color: string;
  rotate: number;
  duration: number;
  delay?: number;
  floatY?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, width: size, height: size, color, rotate: `${rotate}deg`, opacity: 0 }}
      animate={{
        y: [0, -floatY, 0],
        opacity: [0.025, 0.055, 0.025],
        rotate: [rotate, rotate + 8, rotate],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── pulsing glow orb ─────────────────────────────────────────── */
function GlowOrb({
  x, y, size, color, duration, delay = 0,
}: {
  x: string; y: string; size: number; color: string; duration: number; delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y,
        width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── animated dot grid ────────────────────────────────────────── */
function AnimatedGrid() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 85% 70% at 50% 40%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 40%, black 20%, transparent 100%)',
      }}
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── SVG icon definitions ─────────────────────────────────────── */
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);
const BulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);
const CogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.7}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

/* ── main export ──────────────────────────────────────────────── */
export default function ResourcesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>

      {/* animated dot grid */}
      <AnimatedGrid />

      {/* pulsing glow orbs */}
      <GlowOrb x="0%"   y="0%"    size={420} color="rgba(168,230,61,0.06)"   duration={5}   delay={0} />
      <GlowOrb x="100%" y="0%"    size={340} color="rgba(96,165,250,0.06)"   duration={6.5} delay={1} />
      <GlowOrb x="50%"  y="100%"  size={500} color="rgba(167,139,250,0.05)" duration={7}   delay={2} />
      <GlowOrb x="80%"  y="55%"   size={260} color="rgba(251,146,60,0.04)"  duration={5.5} delay={0.5} />
      <GlowOrb x="20%"  y="60%"   size={220} color="rgba(244,114,182,0.04)" duration={8}   delay={1.5} />

      {/* floating icons */}
      <FloatingIcon x="-2%"  y="-2%"  size={200} color="#60a5fa" rotate={-15} duration={7}   delay={0}>   <BookIcon />     </FloatingIcon>
      <FloatingIcon x="78%"  y="-3%"  size={160} color="#a8e63d" rotate={10}  duration={6}   delay={0.8}> <CodeIcon />     </FloatingIcon>
      <FloatingIcon x="-4%"  y="30%"  size={180} color="#fbbf24" rotate={-8}  duration={8}   delay={0.3}> <BulbIcon />     </FloatingIcon>
      <FloatingIcon x="82%"  y="38%"  size={190} color="#f472b6" rotate={12}  duration={7.5} delay={1.2}> <DocIcon />      </FloatingIcon>
      <FloatingIcon x="-3%"  y="68%"  size={170} color="#4ade80" rotate={6}   duration={9}   delay={0.6}> <MapIcon />      </FloatingIcon>
      <FloatingIcon x="78%"  y="72%"  size={200} color="#fb923c" rotate={-18} duration={6.5} delay={0.2}> <CogIcon />      </FloatingIcon>
      <FloatingIcon x="38%"  y="18%"  size={230} color="#a78bfa" rotate={0}   duration={10}  delay={1}   floatY={12}> <QuestionIcon /> </FloatingIcon>
      <FloatingIcon x="55%"  y="60%"  size={140} color="#fbbf24" rotate={20}  duration={7}   delay={2}>   <StarIcon />     </FloatingIcon>
      <FloatingIcon x="12%"  y="85%"  size={150} color="#60a5fa" rotate={-5}  duration={8.5} delay={1.8}> <CodeIcon />    </FloatingIcon>
      <FloatingIcon x="65%"  y="-1%"  size={130} color="#f472b6" rotate={15}  duration={6}   delay={2.5}> <StarIcon />    </FloatingIcon>

    </div>
  );
}
