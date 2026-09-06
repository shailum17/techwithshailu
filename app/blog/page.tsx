import type { Metadata } from 'next';
import Link from 'next/link';

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
  published_at: string;
  read_time: string;
  cover_url?: string;
}

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

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blogs?published=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts[0];

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
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`}>
                <div className="rounded-2xl p-6 md:p-8 mb-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-lime/40"
                     style={{ background: '#0E0E0E', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor[featured.category] ?? 'text-lime border-lime/30'}`}
                              style={{ background: categoryCardBg[featured.category] ?? 'rgba(168,230,61,0.06)' }}>
                          {featured.category}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border
                                         text-amber-400 border-amber-400/30 inline-flex items-center gap-1"
                              style={{ background: 'rgba(251,191,36,0.08)' }}>
                          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Featured
                        </span>
                      </div>
                      <h2 className="font-poppins font-bold text-xl md:text-2xl text-ink mb-3 hover:text-lime transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-ink-muted text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-ink-faint">
                        <span>techwithshailu</span>
                        <span>·</span>
                        <span>{formatDate(featured.published_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {featured.read_time}
                        </span>
                      </div>
                    </div>
                    {/* Thumbnail — cover image or gradient fallback */}
                    {featured.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.cover_url} alt={featured.title}
                           className="w-full md:w-52 h-36 rounded-xl flex-shrink-0 object-cover" />
                    ) : (
                      <div className={`w-full md:w-52 h-36 rounded-xl flex-shrink-0 flex items-center justify-center
                                       bg-gradient-to-br ${thumbGradient[featured.category] ?? thumbGradient.Jobs}`}>
                        <span className={`font-poppins font-black text-5xl ${thumbTextColor[featured.category] ?? 'text-lime'}`}>
                          {featured.category.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Post grid */}
            {posts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <article className="rounded-2xl p-5 flex flex-col h-full cursor-pointer
                                         hover:-translate-y-1 transition-all duration-300 overflow-hidden group
                                         border border-white/10 hover:border-purple-brand/40"
                             style={{ background: '#0E0E0E' }}>
                      {/* Thumbnail */}
                      {post.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.cover_url} alt={post.title}
                             className="w-full h-32 rounded-xl mb-4 object-cover" />
                      ) : (
                        <div className={`w-full h-32 rounded-xl mb-4 flex items-center justify-center overflow-hidden
                                         bg-gradient-to-br ${thumbGradient[post.category] ?? thumbGradient.Jobs}`}>
                          <span className={`font-poppins font-black text-4xl transition-transform duration-500
                                            group-hover:scale-110 ${thumbTextColor[post.category] ?? 'text-lime'}`}>
                            {post.category.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border w-fit mb-3 ${categoryColor[post.category] ?? 'text-lime border-lime/30'}`}
                            style={{ background: categoryCardBg[post.category] ?? 'rgba(168,230,61,0.06)' }}>
                        {post.category}
                      </span>
                      <h3 className="font-poppins font-semibold text-ink text-base leading-snug mb-2
                                     hover:text-lime transition-colors flex-1">
                        {post.title}
                      </h3>
                      <p className="text-ink-muted text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-ink-faint mt-auto pt-3"
                           style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <span>techwithshailu</span>
                        <span>·</span>
                        <span>{formatDate(post.published_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.read_time}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
