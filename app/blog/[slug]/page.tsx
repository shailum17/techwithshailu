import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgress from '@/components/ReadingProgress';
import { supabase } from '@/lib/supabase';
import BlogSidebar from './BlogSidebar';

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
  tags?: string[];
}

/* ── category styles ──────────────────────────────────────────── */
const categoryColor: Record<string, string> = {
  Jobs:             'text-lime border-lime/30',
  'AI Tools':       'text-blue-400 border-blue-400/30',
  Roadmap:          'text-amber-400 border-amber-400/30',
  Career:           'text-purple-brand border-purple-brand/30',
  'Interview Prep': 'text-cyan-400 border-cyan-400/30',
  General:          'text-slate-400 border-slate-400/30',
};
const categoryBg: Record<string, string> = {
  Jobs:             'rgba(168,230,61,0.08)',
  'AI Tools':       'rgba(96,165,250,0.08)',
  Roadmap:          'rgba(251,191,36,0.08)',
  Career:           'rgba(155,127,232,0.08)',
  'Interview Prep': 'rgba(34,211,238,0.08)',
  General:          'rgba(148,163,184,0.08)',
};

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── data fetching ────────────────────────────────────────────── */
async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('id,slug,title,excerpt,category,content,published_at,read_time,cover_url,tags')
      .eq('published', true)
      .order('published_at', { ascending: false });
    if (error) { console.error('[blog detail] supabase:', error.message); return []; }
    return (data ?? []) as BlogPost[];
  } catch (err) {
    console.error('[blog detail]', err);
    return [];
  }
}

/* ── metadata ─────────────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('blogs')
    .select('title,excerpt,cover_url')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!post) return { title: 'Post Not Found' };
  return {
    title:       `${post.title} — techwithshailu`,
    description: post.excerpt ?? '',
    openGraph: {
      title:       post.title,
      description: post.excerpt ?? '',
      images:      post.cover_url ? [post.cover_url] : [],
    },
  };
}

/* ── page ─────────────────────────────────────────────────────── */
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const post     = allPosts.find(p => p.slug === slug);
  if (!post) notFound();

  /* Related — same category, exclude current, max 4 */
  const related = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 4);

  /* Recent — different category, newest first, max 5 */
  const relatedSlugs = new Set([slug, ...related.map(p => p.slug)]);
  const recent = allPosts
    .filter(p => !relatedSlugs.has(p.slug))
    .slice(0, 5);

  /* Fallback — all other posts if both lists are empty */
  const otherPosts = allPosts.filter(p => p.slug !== slug).slice(0, 5);

  return (
    <div className="pt-20 pb-20 min-h-screen" style={{ background: '#080808' }}>
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted mb-6 flex items-center gap-2">
          <Link href="/"     className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/blog" className="hover:text-lime transition-colors">Blog</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink truncate">{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Main article ──────────────────────────── */}
          <article className="flex-1 min-w-0 w-full">

            {/* Cover image */}
            {post.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_url} alt={post.title}
                   className="w-full h-56 md:h-72 object-cover rounded-2xl mb-8" />
            )}

            {/* Post header */}
            <div className="mb-8">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 inline-block
                            ${categoryColor[post.category] ?? 'text-lime border-lime/30'}`}
                style={{ background: categoryBg[post.category] ?? 'rgba(168,230,61,0.08)' }}>
                {post.category}
              </span>

              <h1 className="font-poppins font-bold text-2xl md:text-3xl text-ink leading-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-ink-faint flex-wrap">
                <span>techwithshailu</span>
                <span>·</span>
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

            {/* Body */}
            <div
              className="rounded-2xl p-6 md:p-8 mb-8
                         prose prose-sm max-w-none prose-invert
                         prose-headings:font-poppins prose-headings:text-ink
                         prose-headings:pb-2 prose-headings:mb-4
                         prose-p:text-ink-muted prose-li:text-ink-muted
                         prose-strong:text-ink prose-a:text-lime prose-a:no-underline
                         hover:prose-a:underline prose-code:text-lime
                         prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />


          </article>

          {/* ── Sidebar (client component — needs hover handlers) ── */}
          <BlogSidebar
            currentSlug={slug}
            currentCategory={post.category}
            tags={post.tags ?? []}
            related={related}
            recent={recent}
            otherPosts={otherPosts}
          />

        </div>
      </div>
    </div>
  );
}
