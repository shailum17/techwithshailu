import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgress from '@/components/ReadingProgress';

// Minimal static blog content — expand with MDX later
const posts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
}> = {
  'goldman-sachs-off-campus-2026': {
    title: 'Goldman Sachs Off-Campus Drive 2026 — Apply Now',
    excerpt: "Goldman Sachs is hiring 2025–2026 batch freshers for their Technology Analyst Program.",
    category: 'Jobs',
    date: 'June 20, 2026',
    readTime: '4 min read',
    author: 'techwithshailu',
    content: `
      <h2>About the Role</h2>
      <p>Goldman Sachs is conducting an off-campus drive for the <strong>Technology Analyst (2026 Batch)</strong> program. This is a full-time role based in Bengaluru and Hyderabad.</p>
      <h2>Eligibility</h2>
      <ul>
        <li>B.Tech / B.E. / MCA in Computer Science or related field</li>
        <li>2025–2026 graduation batch</li>
        <li>CGPA: 7.0 or above preferred</li>
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
    category: 'AI Tools',
    date: 'June 18, 2026',
    readTime: '6 min read',
    author: 'techwithshailu',
    content: `
      <h2>Why CS Students Need AI Tools</h2>
      <p>AI tools are no longer optional — they're a competitive advantage. Here are the top 15 tools every CS student should have in their toolkit.</p>
      <h2>Top Picks</h2>
      <ul>
        <li><strong>ChatGPT</strong> — Best all-rounder for writing, coding help, and concept explanations</li>
        <li><strong>GitHub Copilot</strong> — AI code completion right inside VS Code</li>
        <li><strong>Perplexity</strong> — AI search with cited sources, great for research</li>
        <li><strong>Codeium</strong> — Free alternative to Copilot, works on 70+ languages</li>
        <li><strong>Notion AI</strong> — Notes + AI in one place</li>
      </ul>
      <p>Check out our <a href="/ai-tools">full AI Tools directory</a> for more.</p>
    `,
  },
  'dsa-roadmap-placements-2026': {
    title: 'DSA Roadmap for Placements 2026 — Complete Guide',
    excerpt: 'Week-by-week DSA preparation plan to crack product companies.',
    category: 'Roadmap',
    date: 'June 15, 2026',
    readTime: '8 min read',
    author: 'techwithshailu',
    content: `
      <h2>Why DSA Matters for Placements</h2>
      <p>Almost every product company — Google, Amazon, Flipkart, Razorpay — tests DSA in their first round. Without strong fundamentals, you won't even make it to the interview stage.</p>
      <h2>3-Month Plan</h2>
      <ul>
        <li><strong>Month 1:</strong> Arrays, Strings, Linked Lists, Stacks, Queues</li>
        <li><strong>Month 2:</strong> Trees, Binary Search, Heaps, Graphs</li>
        <li><strong>Month 3:</strong> Dynamic Programming, Greedy, Bit Manipulation + LeetCode practice</li>
      </ul>
      <p>Full roadmap with resources available on our <a href="/resources/dsa">DSA Roadmap page</a>.</p>
    `,
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) notFound();

  return (
    <div className="pt-24 pb-20">
      {/* Reading progress bar — fills as user scrolls the article */}
      <ReadingProgress />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-lime transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white truncate">{post.title}</span>
        </nav>

        {/* Post header */}
        <div className="mb-8">
          <span className="tag-lime mb-3 inline-block">{post.category}</span>
          <h1 className="font-poppins font-bold text-2xl md:text-3xl text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>✍️ {post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Post content */}
        <div
          className="glass-card p-6 md:p-8 prose prose-invert prose-sm max-w-none
                     prose-headings:font-poppins prose-headings:text-white
                     prose-p:text-gray-300 prose-li:text-gray-300
                     prose-strong:text-lime prose-a:text-lime prose-a:no-underline
                     hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="glass-card p-6 text-center mt-8">
          <p className="text-gray-400 text-sm mb-4">
            Want more articles like this? Join our Telegram channel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
               className="btn-lime text-sm">
              📱 Join Telegram
            </a>
            <Link href="/blog" className="btn-purple text-sm">← More Articles</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
