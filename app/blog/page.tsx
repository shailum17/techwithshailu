import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Tech Articles for CS Students & Freshers',
  description: 'Articles on tech jobs, interview prep, AI tools and study strategies for CS students in India.',
};

const posts = [
  { slug: 'goldman-sachs-off-campus-2026',   title: 'Goldman Sachs Off-Campus Drive 2026 — Apply Now',      excerpt: 'Goldman Sachs is hiring 2025–2026 batch freshers for their Technology Analyst Program. Here is everything you need to know.', category: 'Jobs',     date: 'June 20, 2026', readTime: '4 min read' },
  { slug: 'best-ai-tools-for-students-2026', title: '15 Best AI Tools for CS Students in 2026',              excerpt: 'From ChatGPT to GitHub Copilot — the AI tools that will save you hours every week as a CS student.', category: 'AI Tools', date: 'June 18, 2026', readTime: '6 min read' },
  { slug: 'dsa-roadmap-placements-2026',     title: 'DSA Roadmap for Placements 2026 — Complete Guide',     excerpt: 'How to prepare DSA from scratch in 3 months and crack product company placements. Detailed week-by-week plan.', category: 'Roadmap',  date: 'June 15, 2026', readTime: '8 min read' },
  { slug: 'freshers-resume-tips-2026',       title: 'How to Write a Resume as a CS Fresher — 10 Tips',      excerpt: 'Your resume is your first impression. Here is exactly what to write as a 2025–2026 batch engineer.', category: 'Career',   date: 'June 12, 2026', readTime: '5 min read' },
  { slug: 'top-internships-india-2026',      title: 'Top 20 Tech Internships in India — June 2026',          excerpt: 'Curated list of the best internship opportunities open right now — Flipkart, Razorpay, Swiggy and more.', category: 'Jobs',     date: 'June 10, 2026', readTime: '3 min read' },
];

// Dark-friendly category colors
const categoryColor: Record<string, string> = {
  Jobs:       'text-lime border-lime/30',
  'AI Tools': 'text-blue-400 border-blue-400/30',
  Roadmap:    'text-amber-400 border-amber-400/30',
  Career:     'text-purple-brand border-purple-brand/30',
};

const categoryCardBg: Record<string, string> = {
  Jobs:       'rgba(168,230,61,0.06)',
  'AI Tools': 'rgba(96,165,250,0.06)',
  Roadmap:    'rgba(251,191,36,0.06)',
  Career:     'rgba(155,127,232,0.06)',
};

const thumbGradient: Record<string, string> = {
  Jobs:       'from-lime/20 via-lime/8 to-transparent',
  'AI Tools': 'from-blue-400/20 via-blue-400/8 to-transparent',
  Roadmap:    'from-amber-400/20 via-amber-400/8 to-transparent',
  Career:     'from-purple-400/20 via-purple-400/8 to-transparent',
};

const thumbTextColor: Record<string, string> = {
  Jobs: 'text-lime', 'AI Tools': 'text-blue-400', Roadmap: 'text-amber-400', Career: 'text-purple-brand',
};

export default function BlogPage() {
  const featured = posts[0];

  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-ink mb-2">Blog & Articles</h1>
          <div className="flex justify-center mb-3">
            <span className="block h-1 w-16 rounded-full bg-lime" />
          </div>
          <p className="text-ink-muted max-w-lg mx-auto text-sm">
            Job updates, interview tips, AI tools and roadmaps — written for CS students in India.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`}>
          <div className="rounded-2xl p-6 md:p-8 mb-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 border border-[#2A2A2A] hover:border-lime/40"
               style={{ background: '#111111', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor[featured.category]}`}
                        style={{ background: categoryCardBg[featured.category] }}>
                    {featured.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border
                                   text-amber-400 border-amber-400/30"
                        style={{ background: 'rgba(251,191,36,0.08)' }}>
                    ⭐ Featured
                  </span>
                </div>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-ink mb-3 hover:text-lime transition-colors">
                  {featured.title}
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-ink-faint">
                  <span>techwithshailu</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featured.readTime}
                  </span>
                </div>
              </div>
              {/* Gradient thumbnail */}
              <div className={`w-full md:w-52 h-36 rounded-xl flex-shrink-0 flex items-center justify-center
                               bg-gradient-to-br ${thumbGradient[featured.category]}`}>
                <span className={`font-poppins font-black text-5xl ${thumbTextColor[featured.category]}`}>
                  {featured.category.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map(({ slug, title, excerpt, category, date, readTime }) => (
            <Link key={slug} href={`/blog/${slug}`}>
              <article className="rounded-2xl p-5 flex flex-col h-full cursor-pointer
                                   hover:-translate-y-1 transition-all duration-300 overflow-hidden group
                                   border border-[#2A2A2A] hover:border-purple-brand/40"
                       style={{ background: '#111111' }}>
                {/* Gradient thumbnail with zoom on hover */}
                <div className={`w-full h-32 rounded-xl mb-4 flex items-center justify-center overflow-hidden
                                 bg-gradient-to-br ${thumbGradient[category]}`}>
                  <span className={`font-poppins font-black text-4xl transition-transform duration-500
                                    group-hover:scale-110 ${thumbTextColor[category]}`}>
                    {category.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border w-fit mb-3 ${categoryColor[category]}`}
                      style={{ background: categoryCardBg[category] }}>
                  {category}
                </span>
                <h3 className="font-poppins font-semibold text-ink text-base leading-snug mb-2
                               hover:text-lime transition-colors flex-1">
                  {title}
                </h3>
                <p className="text-ink-muted text-sm line-clamp-2 mb-3">{excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-ink-faint mt-auto pt-3"
                     style={{ borderTop: '1px solid #2A2A2A' }}>
                  <span>techwithshailu</span>
                  <span>·</span>
                  <span>{date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
