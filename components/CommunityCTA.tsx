'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* ─── Outward flow canvas (reverse of hero gateway) ─────────── */
function OutwardFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, raf = 0
    let destroyed = false

    interface Particle { t: number; speed: number }
    interface Path { isLeft: boolean; startY: number; particles: Particle[] }
    let paths: Path[] = []

    function resize() {
      const dpr = window.devicePixelRatio || 1
      w = canvas!.offsetWidth
      h = canvas!.offsetHeight
      canvas!.width  = w * dpr
      canvas!.height = h * dpr
      ctx!.scale(dpr, dpr)
      buildPaths()
    }

    function buildPaths() {
      paths = []
      const num = 80
      for (let i = 0; i < num; i++) {
        paths.push({
          isLeft: i % 2 === 0,
          startY: (i / num) * h * 1.4 - h * 0.2,
          particles: [{ t: Math.random(), speed: 0.0010 + Math.random() * 0.0016 }],
        })
      }
    }

    function bezierPoint(
      t: number,
      p0: {x:number;y:number}, p1: {x:number;y:number},
      p2: {x:number;y:number}, p3: {x:number;y:number}
    ) {
      const u = 1 - t
      return {
        x: u**3*p0.x + 3*u**2*t*p1.x + 3*u*t**2*p2.x + t**3*p3.x,
        y: u**3*p0.y + 3*u**2*t*p1.y + 3*u*t**2*p2.y + t**3*p3.y,
      }
    }

    function render() {
      if (destroyed) return
      ctx!.clearRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2

      for (const path of paths) {
        // Opposite of hero: start at center, end at edges
        const p0 = { x: cx, y: cy }
        const p1 = { x: path.isLeft ? cx * 0.85 : w - cx * 0.85, y: cy }
        const p2 = { x: path.isLeft ? cx * 0.45 : w - cx * 0.45, y: path.startY }
        const p3 = { x: path.isLeft ? 0 : w, y: path.startY }

        // Draw path line
        ctx!.beginPath()
        ctx!.moveTo(p0.x, p0.y)
        ctx!.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
        ctx!.strokeStyle = 'rgba(168,230,61,0.06)'
        ctx!.lineWidth = 0.8
        ctx!.setLineDash([2, 6])
        ctx!.stroke()
        ctx!.setLineDash([])

        // Particles
        for (const p of path.particles) {
          p.t += p.speed
          if (p.t > 1) {
            p.t = 0
            path.startY += (Math.random() - 0.5) * 10
          }
          const pos = bezierPoint(p.t, p0, p1, p2, p3)

          // Fade out as particle travels away from center
          const alpha = 0.9 * (1 - p.t * 0.6)

          const grd = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 5)
          grd.addColorStop(0, `rgba(168,230,61,${alpha})`)
          grd.addColorStop(1, 'rgba(168,230,61,0)')
          ctx!.fillStyle = grd
          ctx!.beginPath()
          ctx!.arc(pos.x, pos.y, 5, 0, Math.PI * 2)
          ctx!.fill()

          ctx!.fillStyle = `rgba(200,255,100,${alpha})`
          ctx!.fillRect(pos.x - 1, pos.y - 1, 2, 2)
        }
      }

      raf = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    render()

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  )
}

const PLATFORMS = [
  {
    name: 'Telegram',
    href: 'https://t.me/techwithshailu',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.51l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.076z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://chat.whatsapp.com/KnzRYRlTS5jA86Ozo71vlr',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const iconItem = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function CommunityCTA() {
  const reduce = useReducedMotion()

  return (
    <section className="relative w-full py-24 sm:py-32">

      {/* ── Canvas animated background ── */}
      <OutwardFlowCanvas />

      {/* Noise grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '150px',
        }}
      />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <span
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(168,230,61,0.07)',
              border: '1px solid rgba(168,230,61,0.22)',
              color: '#A8E63D',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8E63D] animate-pulse" />
            Free · Forever
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-white mb-5"
        >
          Stay Ahead —<br />Join the Community
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="text-white/45 text-sm sm:text-base max-w-md leading-relaxed mb-10"
        >
          Daily job alerts, AI tool drops, and interview tips straight to your
          phone via{' '}
          <span className="text-white/70 font-medium">Telegram</span> and{' '}
          <span className="text-white/70 font-medium">WhatsApp</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-5"
        >
          <a
            href="https://t.me/techwithshailu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime btn-primary-pulse inline-flex items-center justify-center gap-2 px-10 py-3.5 font-bold text-sm rounded-xl"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.51l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.076z" />
            </svg>
            Join Telegram
          </a>
          <a
            href="https://chat.whatsapp.com/KnzRYRlTS5jA86Ozo71vlr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:text-white hover:border-white/25"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join WhatsApp
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          variants={fadeUp}
          className="text-xs mb-14"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          2,000+ students already joined · Free forever
        </motion.p>

        {/* Platform icons */}
        <motion.div variants={fadeUp} className="w-full">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Find us on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PLATFORMS.map((p) => (
              <motion.a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={iconItem}
                whileHover={reduce ? {} : { scale: 1.12, y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group flex flex-col items-center gap-2"
                title={p.name}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(14,14,14,0.9)',
                    border: '1px solid rgba(168,230,61,0.15)',
                    color: 'rgba(168,230,61,0.6)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.border = '1px solid rgba(168,230,61,0.5)'
                    el.style.color = '#A8E63D'
                    el.style.boxShadow = '0 0 16px rgba(168,230,61,0.2), 0 4px 16px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.border = '1px solid rgba(168,230,61,0.15)'
                    el.style.color = 'rgba(168,230,61,0.6)'
                    el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  {p.icon}
                </div>
                <span
                  className="text-[10px] font-medium tracking-wide transition-opacity duration-200 opacity-40 group-hover:opacity-80"
                  style={{ color: '#A8E63D' }}
                >
                  {p.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
