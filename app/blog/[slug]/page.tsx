import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgress from '@/components/ReadingProgress';

const posts: Record<string, {
  title: string; excerpt: string; category: string;
  date: string; readTime: string; content: string;
}> = {
  'goldman-sachs-off-campus-2026': {
    title: 'Goldman Sachs Off-Campus Drive 2026 — Apply Now',
    excerpt: 'Goldman Sachs is hiring 2025–2026 batch freshers for their Technology Analyst Program.',
    category: 'Jobs', date: 'June 20, 2026', readTime: '4 min read',
    content: `
      <h2>About the Role</h2>
      <p>Goldman Sachs is conducting an off-campus drive for the <strong>Technology Analyst (2026 Batch)</strong> program. This is a full-time role based in Bengaluru and Hyderabad.</p>
      <h2>Eligibility</h2>
      <ul>
        <li>B.Tech / B.E. / MCA in Computer Science or related field</li>
        <li>2025–2026 graduation batch</li>
        <li>CGPA 7.0 or above preferred</li>
        <li>Strong DSA and problem-solving skills</li>
      </ul>
      <h2>How to Apply</h2>
      <p>Apply through the official Goldman Sachs careers portal. The hiring process includes an online assessment followed by 2–3 rounds of technical interviews.</p>
      <p><strong>Deadline:</strong> July 15, 2026</p>
    `,
  },
  'best-ai-tools-for-students-2026': {
    title: '15 Best AI Tools for CS Students in 2026',
    excerpt: 'From ChatGPT to GitHub Copilot — the AI tools that will save you hours every week.',
    category: 'AI Tools', date: 'June 18, 2026', readTime: '6 min read',
    content: `
      <h2>Why CS Students Need AI Tools</h2>
      <p>AI tools are no longer optional — they are a competitive advantage. Here are the top tools every CS student should have in their toolkit.</p>
      <h2>Top Picks</h2>
      <ul>
        <li><strong>ChatGPT</strong> — Best all-rounder for writing, coding help, and concept explanations</li>
        <li><strong>GitHub Copilot</strong> — AI code completion right inside VS Code</li>
        <li><strong>Perplexity</strong> — AI search with cited sources, great for research</li>
        <li><strong>Codeium</strong> — Free alternative to Copilot, works on 70+ languages</li>
        <li><strong>Notion AI</strong> — Notes and AI in one place</li>
      </ul>
      <p>Check out our <a href="/ai-tools">full AI Tools directory</a> for more.</p>
    `,
  },
  'dsa-roadmap-placements-2026': {
    title: 'DSA Roadmap for Placements 2026 — Complete Guide',
    excerpt: 'Week-by-week DSA preparation plan to crack product companies.',
    category: 'Roadmap', date: 'June 15, 2026', readTime: '8 min read',
    content: `
      <h2>Why DSA Matters for Placements</h2>
      <p>Almost every product company tests DSA in their first round. Without strong fundamentals, you will not make it to the interview stage.</p>
      <h2>3-Month Plan</h2>
      <ul>
        <li><strong>Month 1:</strong> Arrays, Strings, Linked Lists, Stacks, Queues</li>
        <li><strong>Month 2:</strong> Trees, Binary Search, Heaps, Graphs</li>
        <li><strong>Month 3:</strong> Dynamic Programming, Greedy, Bit Manipulation and LeetCode practice</li>
      </ul>
      <p>Full roadmap with resources on our <a href="/resources/dsa">DSA Roadmap page</a>.</p>
    `,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: 'Post Not Found' };
  return { title: post.title, description: post.excerpt };
}

const categoryColor: Record<string, string> = {
  Jobs:       'text-lime border-lime/30',
  'AI Tools': 'text-blue-400 border-blue-400/30',
  Roadmap:    'text-amber-400 border-amber-400/30',
};
const categoryBg: Record<string, string> = {
  Jobs: 'rgba(168,230,61,0.08)', 'AI Tools': 'rgba(96,165,250,0.08)', Roadmap: 'rgba(251,191,36,0.08)',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <div className="pt-20 pb-20 min-h-screen" style={{ background: '#0A0A0A' }}>
      <ReadingProgress />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/blog" className="hover:text-lime transition-colors">Blog</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink truncate">{post.title}</span>
        </nav>

        {/* Post header */}
        <div className="mb-8">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 inline-block ${categoryColor[post.category]}`}
                style={{ background: categoryBg[post.category] }}>
            {post.category}
          </span>
          <h1 className="font-poppins font-bold text-2xl md:text-3xl text-ink leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-ink-faint">
            <span>techwithshailu</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-8
                     prose prose-sm max-w-none prose-invert
                     prose-headings:font-poppins prose-headings:text-ink
                     prose-headings:pb-2 prose-headings:mb-4
                     prose-p:text-ink-muted prose-li:text-ink-muted
                     prose-strong:text-ink prose-a:text-lime prose-a:no-underline
                     hover:prose-a:underline"
          style={{ background: '#111111', border: '1px solid #2A2A2A' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="rounded-2xl p-6 text-center"
             style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
          <p className="text-ink-muted text-sm mb-4">
            Want more articles like this? Join our Telegram channel for daily updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
               className="btn-lime text-sm">
              Join Telegram
            </a>
            <Link href="/blog" className="btn-purple-outline text-sm">
              More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
