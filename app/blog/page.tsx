import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Tech Articles for CS Students & Freshers',
  description:
    'Articles on tech jobs, interview prep, AI tools and study strategies for CS students in India.',
};

// Static blog posts — move to MDX or CMS later
const posts = [
  {
    slug: 'goldman-sachs-off-campus-2026',
    title: 'Goldman Sachs Off-Campus Drive 2026 — Apply Now',
    excerpt: 'Goldman Sachs is hiring 2025–2026 batch freshers for their Technology Analyst Program. Here\'s everything you need to know.',
    category: 'Jobs',
    date: 'June 20, 2026',
    readTime: '4 min read',
    author: 'techwithshailu',
  },
  {
    slug: 'best-ai-tools-for-students-2026',
    title: '15 Best AI Tools for CS Students in 2026',
    excerpt: 'From ChatGPT to GitHub Copilot — here are the AI tools that will save you hours every week as a CS student.',
    category: 'AI Tools',
    date: 'June 18, 2026',
    readTime: '6 min read',
    author: 'techwithshailu',
  },
  {
    slug: 'dsa-roadmap-placements-2026',
    title: 'DSA Roadmap for Placements 2026 — Complete Guide',
    excerpt: 'How to prepare DSA from scratch in 3 months and crack product company placements. Detailed week-by-week plan.',
    category: 'Roadmap',
    date: 'June 15, 2026',
    readTime: '8 min read',
    author: 'techwithshailu',
  },
  {
    slug: 'freshers-resume-tips-2026',
    title: 'How to Write a Resume as a CS Fresher — 10 Tips',
    excerpt: 'Your resume is your first impression. Here\'s exactly what to write (and what NOT to write) as a 2025–2026 batch engineer.',
    category: 'Career',
    date: 'June 12, 2026',
    readTime: '5 min read',
    author: 'techwithshailu',
  },
  {
    slug: 'top-internships-india-2026',
    title: 'Top 20 Tech Internships in India for Students — June 2026',
    excerpt: 'Curated list of the best internship opportunities open right now — Flipkart, Razorpay, Swiggy and more.',
    category: 'Jobs',
    date: 'June 10, 2026',
    readTime: '3 min read',
    author: 'techwithshailu',
  },
];

const categoryColors: Record<string, string> = {
  Jobs:    'text-lime bg-lime/10 border-lime/20',
  'AI Tools': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Roadmap: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Career:  'text-purple-light bg-purple-brand/10 border-purple-brand/20',
};

export default function BlogPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-3">
            Blog & Articles
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Tech job updates, interview tips, AI tools and roadmaps — written for CS students in India.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${posts[0].slug}`}>
          <div className="glass-card p-6 md:p-8 mb-8 hover:border-lime/30 transition-all duration-300
                          hover:shadow-lime-glow hover:-translate-y-1 cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColors[posts[0].category]}`}>
                    {posts[0].category}
                  </span>
                  <span className="text-gray-500 text-xs">Featured</span>
                </div>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-white mb-3 hover:text-lime transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{posts[0].author}</span>
                  <span>·</span>
                  <span>{posts[0].date}</span>
                  <span>·</span>
                  <span>{posts[0].readTime}</span>
                </div>
              </div>
              {/* Placeholder thumbnail */}
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-lime/20 to-purple-brand/20
                              rounded-xl flex-shrink-0 flex items-center justify-center text-4xl">
                💼
              </div>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map(({ slug, title, excerpt, category, date, readTime, author }) => (
            <Link key={slug} href={`/blog/${slug}`}>
              <article className="glass-card p-5 flex flex-col h-full hover:border-purple-brand/30
                                   transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                {/* Thumbnail placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-purple-brand/20 to-dark-card
                                rounded-xl mb-4 flex items-center justify-center text-3xl">
                  {category === 'AI Tools' ? '🤖' : category === 'Roadmap' ? '🗺️' : '💼'}
                </div>

                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border w-fit mb-3 ${categoryColors[category]}`}>
                  {category}
                </span>

                <h3 className="font-poppins font-semibold text-white text-base leading-snug mb-2
                               hover:text-lime transition-colors flex-1">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{excerpt}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-3 border-t border-white/5">
                  <span>{author}</span>
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
