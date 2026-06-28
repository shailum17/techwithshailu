import type { Metadata } from 'next';
import Link from 'next/link';
import { roadmapCategories } from './data';

export const metadata: Metadata = {
  title: 'Roadmaps — Frontend, DSA, Backend, System Design, AI/ML & DevOps',
  description:
    'Step-by-step learning roadmaps for CS students and developers. Frontend, DSA for placements, backend, system design, AI/ML and DevOps.',
};

export default function RoadmapsPage() {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/resources" className="hover:text-lime transition-colors">Resources</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink">Roadmaps</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-ink mb-3">
            Roadmaps
          </h1>
          <p className="text-ink-muted text-base">
            Step-by-step paths to master every area of tech.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roadmapCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/resources/roadmaps/${cat.id}`}
              className="group flex flex-col gap-3 rounded-2xl p-6 transition-all duration-200"
              style={{ background: '#111111', border: '1px solid #2A2A2A' }}
            >
              {/* Title row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.dotColor }}
                  />
                  <span className="font-poppins font-semibold text-ink group-hover:text-lime transition-colors">
                    {cat.title}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-ink-faint group-hover:text-lime transition-colors flex-shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Description */}
              <p className="text-ink-muted text-sm leading-relaxed">{cat.description}</p>

              {/* Resource count badge */}
              <span
                className="text-xs font-medium self-start px-2.5 py-1 rounded-full"
                style={{ color: cat.dotColor, background: `${cat.dotColor}18` }}
              >
                {cat.resources.length === 0
                  ? 'Coming soon'
                  : `${cat.resources.length} ${cat.resources.length === 1 ? 'resource' : 'resources'}`
                }
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
