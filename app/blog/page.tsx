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

const categoryColor: Record<string, string> = {
  Jobs:     'text-lime bg-lime-light border-lime/30',
  'AI Tools': 'text-blue-600 bg-blue-50 border-blue-200',
  Roadmap:  'text-amber-600 bg-amber-50 border-amber-200',
  Career:   'text-purple-brand bg-purple-tint border-purple-brand/30',
};

export default function BlogPage() {
  return (
    <div className="pt-20 min-h-screen pb-20 bg-surface-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-ink mb-3">Blog & Articles</h1>
          <p className="text-ink-muted max-w-lg mx-auto text-sm">
            Job updates, interview tips, AI tools and roadmaps — written for CS students in India.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${posts[0].slug}`}>
          <div className="bg-white border border-surface-border rounded-2xl p-6 md:p-8 mb-8
                          shadow-card hover:border-lime/40 hover:shadow-card-hover
                          hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor[posts[0].category]}`}>
                    {posts[0].category}
                  </span>
                  <span className="text-xs text-ink-faint bg-surface-tertiary border border-surface-border
                                   px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-ink mb-3 hover:text-lime transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-ink-faint">
                  <span>techwithshailu</span>
                  <span>·</span>
                  <span>{posts[0].date}</span>
                  <span>·</span>
                  <span>{posts[0].readTime}</span>
                </div>
              </div>
              {/* Thumbnail */}
              <div className="w-full md:w-48 h-32 bg-surface-tertiary border border-surface-border
                              rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="font-poppins font-bold text-2xl text-ink-faint">
                  {posts[0].category.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map(({ slug, title, excerpt, category, date, readTime }) => (
            <Link key={slug} href={`/blog/${slug}`}>
              <article className="bg-white border border-surface-border rounded-2xl p-5
                                   flex flex-col h-full shadow-card
                                   hover:border-purple-brand/40 hover:shadow-card-hover
                                   hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="w-full h-32 bg-surface-tertiary border border-surface-border
                                rounded-xl mb-4 flex items-center justify-center">
                  <span className="font-poppins font-bold text-xl text-ink-faint">
                    {category.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border w-fit mb-3 ${categoryColor[category]}`}>
                  {category}
                </span>
                <h3 className="font-poppins font-semibold text-ink text-base leading-snug mb-2
                               hover:text-lime transition-colors flex-1">
                  {title}
                </h3>
                <p className="text-ink-muted text-sm line-clamp-2 mb-3">{excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-ink-faint mt-auto pt-3 border-t border-surface-border">
                  <span>techwithshailu</span>
                  <span>·</span>
                  <span>{date}</span>
                  <span>·</span>
                  <span>{readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
