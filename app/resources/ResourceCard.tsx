'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface ResourceCardProps {
  href: string;
  label: string;
  description: string;
  dotColor: string;
  icon: ReactNode;
}

export default function ResourceCard({ href, label, description, dotColor, icon }: ResourceCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex items-start gap-4 rounded-2xl p-6 transition-all duration-200 overflow-hidden"
      style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${dotColor}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${dotColor}14`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* corner glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 0% 0%, ${dotColor}10 0%, transparent 60%)` }}
      />

      {/* icon bubble */}
      <div
        className="relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${dotColor}15`, color: dotColor, border: `1px solid ${dotColor}25` }}
      >
        {icon}
      </div>

      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
          <span className="font-poppins font-semibold text-ink group-hover:text-lime transition-colors">
            {label}
          </span>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
      </div>

      <svg
        className="relative w-4 h-4 text-ink-faint group-hover:text-lime transition-all duration-200 group-hover:translate-x-0.5 flex-shrink-0 mt-1"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
