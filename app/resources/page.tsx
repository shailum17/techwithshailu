import type { Metadata } from 'next';
import Link from 'next/link';

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
  },
  {
    href: '/resources/resume-hub',
    label: 'Resume Hub',
    description: 'Best ATS-friendly resume builders, templates and tips to get you noticed.',
    dotColor: '#60a5fa',
  },
  {
    href: '/resources/interview-prep',
    label: 'Interview Prep',
    description: 'Top questions, patterns and mock round resources to crack your next interview.',
    dotColor: '#fbbf24',
  },
  {
    href: '/resources/cheat-sheets',
    label: 'Coding Cheat Sheets',
    description: 'Quick references for every stack — never forget syntax again.',
    dotColor: '#4ade80',
  },
  {
    href: '/resources/project-ideas',
    label: 'Project Ideas',
    description: 'Build real projects that stand out in your portfolio and impress recruiters.',
    dotColor: '#a78bfa',
  },
  {
    href: '/resources/free-courses',
    label: 'Free Courses',
    description: 'Hand-picked free courses from the best platforms — no paywalls.',
    dotColor: '#f472b6',
  },
  {
    href: '/resources/developer-tools',
    label: 'Developer Tools',
    description: 'Tools that boost your productivity and make development smoother.',
    dotColor: '#fb923c',
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-ink mb-3">
            Resources
          </h1>
          <p className="text-ink-muted text-base max-w-xl mx-auto">
            Everything you need to land your dream tech job — all in one place.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(({ href, label, description, dotColor }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 rounded-2xl p-6 transition-all duration-200"
              style={{ background: '#111111', border: '1px solid #2A2A2A' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="font-poppins font-semibold text-ink group-hover:text-lime transition-colors">
                    {label}
                  </span>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
              </div>
              <svg
                className="w-4 h-4 text-ink-faint group-hover:text-lime transition-colors flex-shrink-0 mt-1"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
