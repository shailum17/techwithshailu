'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface CtaProps {
  ctaEnabled?: boolean
  text?: string
  link?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  secondaryCTA?: {
    text: string
    link: string
  }
}

export function Cta({ cta }: { cta: CtaProps }) {
  if (!cta?.ctaEnabled) return null

  const sizeClass = {
    sm: 'px-6 py-2.5 text-xs',
    default: 'px-10 py-3.5 text-sm',
    lg: 'px-12 py-4 text-base',
  }[cta.size ?? 'default']

  const primaryClass =
    cta.variant === 'outline'
      ? cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 border',
          'border-[rgba(168,230,61,0.35)] text-[#A8E63D] hover:border-[#A8E63D] hover:bg-[rgba(168,230,61,0.06)]',
          sizeClass,
        )
      : cn(
          'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 btn-lime',
          sizeClass,
        )

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {cta.text && cta.link !== undefined && (
        <Link href={cta.link || '#'} className={primaryClass}>
          {cta.text}
        </Link>
      )}
      {cta.secondaryCTA && (
        <Link
          href={cta.secondaryCTA.link}
          className={cn(
            'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 border',
            'border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.75)] hover:border-[rgba(255,255,255,0.25)] hover:text-white bg-[rgba(255,255,255,0.04)]',
            sizeClass,
          )}
        >
          {cta.secondaryCTA.text}
        </Link>
      )}
    </div>
  )
}
