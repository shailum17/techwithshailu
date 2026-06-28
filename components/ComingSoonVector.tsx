'use client';

import { useEffect, useRef } from 'react';

interface Props {
  color?: string;
}

export default function ComingSoonVector({ color = '#a8e63d' }: Props) {
  const lampRef        = useRef<SVGGElement>(null);
  const beamRef        = useRef<SVGPolygonElement>(null);
  const glowRef        = useRef<SVGEllipseElement>(null);
  const ringRef        = useRef<SVGEllipseElement>(null);
  const wire1Ref       = useRef<SVGPathElement>(null);
  const wire2Ref       = useRef<SVGPathElement>(null);
  const text1Ref       = useRef<SVGTextElement>(null);
  const text2Ref       = useRef<SVGTextElement>(null);
  const subtitleRef    = useRef<SVGTextElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      if (!animate) return;

      // ── Lamp swing ──
      animate(lampRef.current!, {
        rotate: [{ to: '-4deg' }, { to: '4deg' }],
        duration: 3200,
        alternate: true,
        loop: true,
        ease: 'inOutSine',
      });

      // ── Beam flicker ──
      animate(beamRef.current!, {
        opacity: [{ to: 0.75 }, { to: 0.55 }, { to: 0.8 }, { to: 0.6 }],
        duration: 4000,
        alternate: true,
        loop: true,
        ease: 'inOutQuad',
      });

      // ── Floor glow pulse ──
      animate(glowRef.current!, {
        rx: [{ to: 62 }, { to: 52 }],
        opacity: [{ to: 0.32 }, { to: 0.18 }],
        duration: 3200,
        alternate: true,
        loop: true,
        ease: 'inOutSine',
      });

      // ── Lamp ring pulse ──
      animate(ringRef.current!, {
        rx: [{ to: 33 }, { to: 28 }],
        opacity: [{ to: 1 }, { to: 0.6 }],
        duration: 3200,
        alternate: true,
        loop: true,
        ease: 'inOutSine',
      });

      // ── Wire 1 draw ──
      const w1 = wire1Ref.current;
      if (w1) {
        const len = w1.getTotalLength();
        w1.style.strokeDasharray  = String(len);
        w1.style.strokeDashoffset = String(len);
        animate(w1, {
          strokeDashoffset: [{ from: len, to: 0 }],
          duration: 1800,
          ease: 'inOutQuart',
          delay: 200,
        });
      }

      // ── Wire 2 draw ──
      const w2 = wire2Ref.current;
      if (w2) {
        const len = w2.getTotalLength();
        w2.style.strokeDasharray  = String(len);
        w2.style.strokeDashoffset = String(len);
        animate(w2, {
          strokeDashoffset: [{ from: len, to: 0 }],
          duration: 1800,
          ease: 'inOutQuart',
          delay: 400,
        });
      }

      // ── "COMING" text reveal ──
      animate(text1Ref.current!, {
        opacity: [{ from: 0, to: 1 }],
        translateY: [{ from: 18, to: 0 }],
        duration: 900,
        ease: 'outExpo',
        delay: 1000,
      });

      // ── "SOON" text reveal ──
      animate(text2Ref.current!, {
        opacity: [{ from: 0, to: 1 }],
        translateY: [{ from: 18, to: 0 }],
        duration: 900,
        ease: 'outExpo',
        delay: 1300,
      });

      // ── Subtitle reveal ──
      animate(subtitleRef.current!, {
        opacity: [{ from: 0, to: 0.6 }],
        translateY: [{ from: 10, to: 0 }],
        duration: 800,
        ease: 'outExpo',
        delay: 1700,
      });
    });
  }, []);

  // Hex → rgba helper for the beam fill
  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const c   = color;
  const dim = '#0A0A0A';

  return (
    <div ref={containerRef} className="w-full max-w-sm mx-auto select-none" aria-hidden="true">
      <svg
        viewBox="0 0 400 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* Beam gradient */}
          <radialGradient id="beamGrad" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
            <stop offset="0%"   stopColor={c} stopOpacity="0.55"/>
            <stop offset="60%"  stopColor={c} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={c} stopOpacity="0"/>
          </radialGradient>

          {/* Floor glow gradient */}
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={c} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={c} stopOpacity="0"/>
          </radialGradient>

          {/* Text gradient */}
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={c}/>
            <stop offset="100%" stopColor={hexToRgba(c, 0.7)}/>
          </linearGradient>

          {/* Lamp body gradient */}
          <linearGradient id="lampGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#2a2a2a"/>
            <stop offset="100%" stopColor="#111111"/>
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id="lampShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={c} floodOpacity="0.4"/>
          </filter>

          {/* Text glow */}
          <filter id="textGlow" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Background ── */}
        <rect width="400" height="380" fill={dim}/>

        {/* ── Wires ── */}
        {/* Left wire: from top-left edge down to lamp top */}
        <path
          ref={wire1Ref}
          d="M 0 60 Q 60 60 60 100 Q 60 130 110 130 Q 150 130 175 150"
          stroke={c} strokeWidth="1.5" strokeOpacity="0.5"
          fill="none" strokeLinecap="round"
        />
        {/* Right wire */}
        <path
          ref={wire2Ref}
          d="M 400 60 Q 340 60 340 100 Q 340 130 290 130 Q 250 130 225 150"
          stroke={c} strokeWidth="1.5" strokeOpacity="0.5"
          fill="none" strokeLinecap="round"
        />

        {/* ── Lamp group (swings) ── */}
        <g ref={lampRef} style={{ transformOrigin: '200px 120px' }}>
          {/* Lamp cord */}
          <line x1="200" y1="0" x2="200" y2="150" stroke={c} strokeWidth="1.5" strokeOpacity="0.6"/>

          {/* Lamp shade */}
          <path
            d="M 155 150 L 135 200 Q 200 212 265 200 L 245 150 Z"
            fill="url(#lampGrad)"
            stroke={c} strokeWidth="1.5" strokeOpacity="0.7"
            filter="url(#lampShadow)"
          />
          {/* Lamp shade highlight */}
          <path
            d="M 162 155 L 148 192 Q 200 200 252 192 L 238 155 Z"
            fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          />

          {/* Lamp ring (bottom of shade) */}
          <ellipse
            ref={ringRef}
            cx="200" cy="202" rx="30" ry="7"
            stroke={c} strokeWidth="1.5" fill="none"
            style={{ opacity: 0.8 }}
          />

          {/* Light bulb glint */}
          <circle cx="200" cy="196" r="4" fill={c} fillOpacity="0.9" filter="url(#lampShadow)"/>
        </g>

        {/* ── Beam of light ── */}
        <polygon
          ref={beamRef}
          points="172,206 228,206 290,310 110,310"
          fill="url(#beamGrad)"
          style={{ opacity: 0.65 }}
        />

        {/* ── Floor glow ── */}
        <ellipse
          ref={glowRef}
          cx="200" cy="312" rx="55" ry="10"
          fill="url(#floorGlow)"
          style={{ opacity: 0.22 }}
        />

        {/* ── "COMING" text ── */}
        <text
          ref={text1Ref}
          x="200" y="270"
          textAnchor="middle"
          fontFamily="'Poppins', system-ui, sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="url(#textGrad)"
          filter="url(#textGlow)"
          style={{ opacity: 0 }}
        >
          COMING
        </text>

        {/* ── "SOON" text ── */}
        <text
          ref={text2Ref}
          x="200" y="330"
          textAnchor="middle"
          fontFamily="'Poppins', system-ui, sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="url(#textGrad)"
          filter="url(#textGlow)"
          style={{ opacity: 0 }}
        >
          SOON
        </text>

        {/* ── Subtitle ── */}
        <text
          ref={subtitleRef}
          x="200" y="358"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="400"
          fontSize="12"
          fill={c}
          letterSpacing="3"
          style={{ opacity: 0 }}
        >
          STAY TUNED
        </text>

      </svg>
    </div>
  );
}
