import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Blog — Tech Articles for CS Students & Freshers',
  description: 'Articles on tech jobs, interview prep, AI tools and study strategies for CS students in India.',
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  published_at: string;
  read_time: string;
  cover_url?: string;
}

const categoryColor: Record<string, string> = {
  Jobs:             'text-lime border-lime/30',
  'AI Tools':       'text-blue-400 border-blue-400/30',
  Roadmap:          'text-amber-400 border-amber-400/30',
  Career:           'text-purple-brand border-purple-brand/30',
  'Interview Prep': 'text-cyan-400 border-cyan-400/30',
  General:          'text-slate-400 border-slate-400/30',
};
const categoryCardBg: Record<string, string> = {
  Jobs:             'rgba(168,230,61,0.06)',
  'AI Tools':       'rgba(96,165,250,0.06)',
  Roadmap:          'rgba(251,191,36,0.06)',
  Career:           'rgba(155,127,232,0.06)',
  'Interview Prep': 'rgba(34,211,238,0.06)',
  General:          'rgba(148,163,184,0.06)',
};

/* Gradient + icon per category for the thumbnail */
const thumbConfig: Record<string, { from: string; to: string; icon: string; color: string }> = {
  Jobs:             { from: '#A8E63D22', to: '#A8E63D05', icon: '💼', color: '#A8E63D' },
  'AI Tools':       { from: '#60A5FA22', to: '#60A5FA05', icon: '🤖', color: '#60A5FA' },
  Roadmap:          { from: '#FBBF2422', to: '#FBBF2405', icon: '🗺️', color: '#FBBF24' },
  Career:           { from: '#9B7FE822', to: '#9B7FE805', icon: '🚀', color: '#9B7FE8' },
  'Interview Prep': { from: '#22D3EE22', to: '#22D3EE05', icon: '🎯', color: '#22D3EE' },
  General:          { from: '#94A3B822', to: '#94A3B805', icon: '📝', color: '#94A3B8' },
};

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('id,slug,title,excerpt,category,content,published_at,read_time,cover_url')
      .eq('published', true)
      .order('published_at', { ascending: false });
    if (error) { console.error('[blog list]', error.message); return []; }
    return (data ?? []) as BlogPost[];
  } catch (err) {
    console.error('[blog list]', err);
    return [];
  }
}

function extractFirstImage(html: string): string {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? '';
}

function Thumbnail({ post }: { post: BlogPost }) {
  const cfg      = thumbConfig[post.category] ?? thumbConfig.General;
  const coverSrc = post.cover_url || extractFirstImage(post.content ?? '');

  if (coverSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={coverSrc} alt={post.title}
        className="w-full h-36 object-cover"
      />
    );
  }

  return (
    <div
      className="w-full h-36 flex flex-col items-center justify-center gap-2 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
               border: `1px solid ${cfg.color}18` }}>
      <span style={{ fontSize: 32, lineHeight: 1 }}>{cfg.icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color,
                     letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>
        {post.category}
      </span>
    </div>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#080808' }}>
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

        {posts.length === 0 ? (
          <div className="rounded-2xl p-12 text-center"
               style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="font-poppins font-semibold text-ink text-lg mb-2">No articles yet</p>
            <p className="text-ink-muted text-sm">Check back soon — new content is on the way.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer
                                    hover:-translate-y-1 transition-all duration-300 group
                                    border border-white/10 hover:border-lime/40"
                         style={{ background: '#0E0E0E' }}>
                  {/* Thumbnail */}
                  <div className="overflow-hidden">
                    <Thumbnail post={post} />
                  </div>
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border
                                        ${categoryColor[post.category] ?? 'text-lime border-lime/30'}`}
                            style={{ background: categoryCardBg[post.category] ?? 'rgba(168,230,61,0.06)' }}>
                        {post.category}
                      </span>
                      {i === 0 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border
                                         text-amber-400 border-amber-400/30 inline-flex items-center gap-1"
                              style={{ background: 'rgba(251,191,36,0.08)' }}>
                          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-poppins font-semibold text-ink text-sm leading-snug mb-1.5
                                   group-hover:text-lime transition-colors flex-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-ink-muted text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-ink-faint mt-auto pt-3 flex-wrap"
                         style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <span>{formatDate(post.published_at)}</span>
                      {post.read_time && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.read_time}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
