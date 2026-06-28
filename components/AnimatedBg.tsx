'use client';

import { useEffect, useRef } from 'react';

type Variant = 'grid' | 'particles' | 'waves' | 'matrix' | 'circuit';

interface Props {
  variant: Variant;
  color?: string;
  opacity?: number;
}

/* ── Grid dots ── */
function GridBg({ color, opacity }: { color: string; opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ── Floating particles (canvas) ── */
function ParticlesBg({ color, opacity }: { color: string; opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, [color]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />
  );
}

/* ── Animated SVG waves ── */
function WavesBg({ color, opacity }: { color: string; opacity: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      if (!animate || !ref.current) return;
      const paths = ref.current.querySelectorAll('.wave-path');
      paths.forEach((p, i) => {
        animate(p as SVGElement, {
          translateY: [{ to: -12 }, { to: 12 }],
          duration: 4000 + i * 800,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
          delay: i * 600,
        });
      });
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg ref={ref} width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3].map(i => (
          <ellipse key={i} className="wave-path"
            cx={300 + i * 200} cy={300 + (i % 2 === 0 ? 60 : -60)} rx={400 - i * 30} ry={180 - i * 20}
            fill="none" stroke={color} strokeWidth={0.8} strokeOpacity={0.15 - i * 0.02} />
        ))}
        {[0, 1, 2].map(i => (
          <ellipse key={`b${i}`} className="wave-path"
            cx={600 + i * 150} cy={200 + i * 80} rx={300 - i * 40} ry={120 - i * 15}
            fill="none" stroke={color} strokeWidth={0.6} strokeOpacity={0.1 - i * 0.02} />
        ))}
      </svg>
    </div>
  );
}

/* ── Matrix rain (canvas) ── */
function MatrixBg({ color, opacity }: { color: string; opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const cols  = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = '01アイウ<>{}[]=>+∑∂∇λ';
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    let id: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px monospace';
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(${r},${g},${b},${i % 4 === 0 ? 0.5 : 0.18})`;
        ctx.fillText(ch, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, [color]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />
  );
}

/* ── Circuit board lines (SVG) ── */
function CircuitBg({ color, opacity }: { color: string; opacity: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    import('animejs').then((mod) => {
      const animate = mod.animate;
      if (!animate || !ref.current) return;
      const lines = ref.current.querySelectorAll('.circuit-line') as NodeListOf<SVGPathElement>;
      lines.forEach(el => {
        const len = el.getTotalLength?.() ?? 200;
        el.style.strokeDasharray  = String(len);
        el.style.strokeDashoffset = String(len);
      });
      lines.forEach((el, i) => {
        animate(el as unknown as HTMLElement, {
          strokeDashoffset: [{ to: 0 }, { to: -el.getTotalLength?.() ?? -200 }],
          duration: 3000 + i * 400,
          loop: true,
          ease: 'linear',
          delay: i * 300,
        });
      });

      const dots = ref.current.querySelectorAll('.circuit-dot');
      dots.forEach((d, i) => {
        animate(d as SVGElement, {
          opacity: [{ to: 0.1 }, { to: 0.8 }],
          scale:   [{ to: 0.5 }, { to: 1.2 }],
          duration: 1200 + i * 200,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
          delay: i * 150,
        });
      });
    });
  }, []);

  const lines = [
    'M 0 100 H 120 V 60 H 240 V 160 H 400',
    'M 600 0 V 80 H 500 V 200 H 650 V 300',
    'M 800 150 H 700 V 80 H 1000 V 200 H 1200',
    'M 100 400 H 300 V 320 H 500 V 450 H 700',
    'M 1100 400 H 900 V 350 H 750 V 500',
    'M 200 550 H 400 V 480 H 600 V 600',
    'M 0 300 H 150 V 250 H 350 V 350 H 550',
    'M 1200 250 H 1050 V 180 H 850 V 280',
  ];

  const dots = [
    [120, 60], [240, 60], [240, 160], [500, 80], [500, 200], [700, 80],
    [300, 320], [500, 320], [900, 350], [750, 350], [400, 480], [600, 480],
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg ref={ref} width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        {lines.map((d, i) => (
          <path key={i} className="circuit-line" d={d}
            stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.3" />
        ))}
        {dots.map(([cx, cy], i) => (
          <circle key={i} className="circuit-dot" cx={cx} cy={cy} r="3"
            fill={color} opacity="0.4" />
        ))}
      </svg>
    </div>
  );
}

export default function AnimatedBg({ variant, color = '#a8e63d', opacity = 0.4 }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {variant === 'grid'     && <GridBg      color={color} opacity={opacity} />}
      {variant === 'particles'&& <ParticlesBg color={color} opacity={opacity} />}
      {variant === 'waves'    && <WavesBg     color={color} opacity={opacity} />}
      {variant === 'matrix'   && <MatrixBg    color={color} opacity={opacity} />}
      {variant === 'circuit'  && <CircuitBg   color={color} opacity={opacity} />}
    </div>
  );
}
