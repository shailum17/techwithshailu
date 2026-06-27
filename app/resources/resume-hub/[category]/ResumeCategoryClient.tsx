'use client';

import Link from 'next/link';
import type { ResumeCategory } from '../data';

export default function ResumeCategoryClient({ category: cat }: { category: ResumeCategory }) {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources/resume-hub" className="hover:text-lime transition-colors">Resume Hub</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">{cat.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dotColor }} />
            <h1 className="font-poppins font-bold text-3xl text-ink">{cat.title}</h1>
          </div>
          <p className="text-ink-muted text-base">{cat.subtitle}</p>
        </div>

        {/* Two-column layout: tools left, pro tip right */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Tool list */}
          <div className="flex-1 flex flex-col gap-3">
            {cat.tools.map((tool, i) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl p-5 transition-all duration-200"
                style={{ background: '#111111', border: '1px solid #2A2A2A' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#3A3A3A';
                  (e.currentTarget as HTMLElement).style.background = '#161616';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A';
                  (e.currentTarget as HTMLElement).style.background = '#111111';
                }}
              >
                {/* Number */}
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#888' }}
                >
                  {i + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <span className="font-poppins font-semibold text-ink group-hover:text-lime transition-colors text-base">
                      {tool.name}
                    </span>
                    {tool.tags.map(tag => (
                      <span
                        key={tag.label}
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ color: tag.color, background: tag.bg }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-ink-muted text-sm leading-relaxed mb-2">{tool.description}</p>
                  <span className="text-xs text-ink-faint flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {tool.domain}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Right sidebar — pro tip + back link */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">
            {cat.proTip && (
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                  </svg>
                  <span className="font-semibold text-ink text-sm">Pro tip</span>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {cat.proTip.linkLabel && cat.proTip.linkUrl
                    ? (() => {
                        const parts = cat.proTip.text.split(cat.proTip.linkLabel!);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href={cat.proTip.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {cat.proTip.linkLabel}
                            </a>
                            {parts[1]}
                          </>
                        );
                      })()
                    : cat.proTip.text
                  }
                </p>
              </div>
            )}

            <Link
              href="/resources/resume-hub"
              className="text-sm text-ink-muted hover:text-lime transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Resume Hub
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
