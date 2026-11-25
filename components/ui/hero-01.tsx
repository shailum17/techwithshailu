'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Cta, type CtaProps } from '@/components/ui/hero-01-utils/cta'
import { IntegrationCloud } from '@/components/ui/hero-01-utils/integration-cloud'

export interface Hero01Props {
  title: string
  titleLine2?: string
  description: string
  washImage?: string
  animation?: 'none' | 'subtle'
  primaryCTA: CtaProps
  secondaryCTA?: CtaProps['secondaryCTA']
  integrationRows: string[][]
  variant?: 'standard' | 'compact'
  badge?: string
  footnote?: string
}

const variantStyles = {
  standard: {
    section: 'py-20 sm:py-28',
    title: 'text-3xl sm:text-4xl md:text-5xl',
    description: 'max-w-md text-sm sm:text-base',
    content: 'gap-8',
  },
  compact: {
    section: 'py-14 sm:py-20',
    title: 'text-2xl sm:text-3xl md:text-4xl',
    description: 'max-w-sm text-sm',
    content: 'gap-6',
  },
} as const

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function Reveal({
  active,
  className,
  children,
}: Readonly<{ active: boolean; className?: string; children: React.ReactNode }>) {
  if (!active) return <div className={className}>{children}</div>
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

export function Hero01({
  title,
  titleLine2,
  description,
  washImage,
  animation = 'none',
  primaryCTA,
  secondaryCTA,
  integrationRows,
  variant = 'standard',
  badge,
  footnote,
}: Readonly<Hero01Props>) {
  const reduce = useReducedMotion()
  const animate = animation === 'subtle' && !reduce
  const vs = variantStyles[variant]

  // Merge secondaryCTA into primaryCTA object so Cta component renders it
  const ctaProps: CtaProps = { ...primaryCTA, secondaryCTA }

  const backgroundElement = washImage && (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 mx-auto h-full w-full opacity-40"
      style={{
        maskImage:
          'radial-gradient(70% 90% at 50% top, black 60%, transparent 90%), linear-gradient(to bottom, black 60%, transparent 85%)',
        WebkitMaskImage:
          'radial-gradient(70% 90% at 50% top, black 60%, transparent 90%), linear-gradient(to bottom, black 60%, transparent 85%)',
        WebkitMaskComposite: 'destination-in',
        maskComposite: 'intersect',
      }}
    >
      {/* Decorative full-bleed background; next/image adds nothing here */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={washImage}
        alt=""
        className="absolute inset-0 size-full object-cover object-top"
      />
      <div className="absolute inset-0" style={{ background: 'rgba(8,8,8,0.35)' }} />
    </div>
  )

  const titleElement = title && (
    <h2
      className={cn(
        'font-poppins font-bold tracking-tight text-balance text-white',
        vs.title,
      )}
    >
      {title}
      {titleLine2 && (
        <>
          <br />
          {titleLine2}
        </>
      )}
    </h2>
  )

  const descriptionElement = description && (
    <p className={cn('text-white/45 leading-relaxed', vs.description)}>{description}</p>
  )

  return (
    <div className="relative overflow-hidden">
      {backgroundElement}

      <motion.div
        className={cn(
          'relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center',
          vs.section,
          vs.content,
        )}
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-80px' }}
      >
        {badge && (
          <Reveal active={animate}>
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2"
              style={{
                background: 'rgba(168,230,61,0.08)',
                color: '#A8E63D',
                border: '1px solid rgba(168,230,61,0.2)',
              }}
            >
              {badge}
            </span>
          </Reveal>
        )}

        <Reveal active={animate} className="flex flex-col items-center gap-5">
          {titleElement}
          {descriptionElement}
        </Reveal>

        <Reveal active={animate}>{<Cta cta={ctaProps} />}</Reveal>

        {footnote && (
          <Reveal active={animate}>
            <p className="text-white/18 text-xs mt-2">{footnote}</p>
          </Reveal>
        )}

        <Reveal active={animate} className="w-full">
          <IntegrationCloud rows={integrationRows} />
        </Reveal>
      </motion.div>
    </div>
  )
}

export default Hero01
