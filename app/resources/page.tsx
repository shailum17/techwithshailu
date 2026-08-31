import type { Metadata } from 'next';
import ResourceCard from './ResourceCard';
import ResourcesBackground from './ResourcesBackground';

export const metadata: Metadata = {
  title: 'Resources — Roadmaps, Resume Hub, Interview Prep & More',
  description:
    'Free resources for CS students and developers — learning roadmaps, resume builders, interview prep, cheat sheets, project ideas, free courses and developer tools.',
};

const categories = [
  {
    href: '/resources/roadmaps',
    label: 'Roadmaps',
    description: 'Step-by-step learning paths for frontend, backend, DSA, system design and more.',
    dotColor: '#a8e63d',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    href: '/resources/resume-hub',
    label: 'Resume Hub',
    description: 'Best ATS-friendly resume builders, templates and tips to get you noticed.',
    dotColor: '#60a5fa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/resources/interview-prep',
    label: 'Interview Prep',
    description: 'Top questions, patterns and mock round resources to crack your next interview.',
    dotColor: '#fbbf24',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/resources/cheat-sheets',
    label: 'Coding Cheat Sheets',
    description: 'Quick references for every stack — never forget syntax again.',
    dotColor: '#4ade80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    href: '/resources/project-ideas',
    label: 'Project Ideas',
    description: 'Build real projects that stand out in your portfolio and impress recruiters.',
    dotColor: '#a78bfa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    href: '/resources/free-courses',
    label: 'Free Courses',
    description: 'Hand-picked free courses from the best platforms — no paywalls.',
    dotColor: '#f472b6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/resources/developer-tools',
    label: 'Developer Tools',
    description: 'Tools that boost your productivity and make development smoother.',
    dotColor: '#fb923c',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-20 min-h-screen pb-20 relative overflow-hidden" style={{ background: '#080808' }}>

      {/* ── Animated background ───────────────────────────────── */}
      <ResourcesBackground />

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-semibold"
               style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.2)', color: '#A8E63D' }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Free for every developer</span>
          </div>
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-ink mb-3">
            Resources
          </h1>
          <p className="text-ink-muted text-base max-w-xl mx-auto">
            Everything you need to land your dream tech job — all in one place.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <ResourceCard key={cat.href} {...cat} />
          ))}
        </div>

        <p className="text-center text-ink-faint text-xs mt-10">
          Updated regularly · Free forever · Built for developers
        </p>
      </div>
    </div>
  );
}
