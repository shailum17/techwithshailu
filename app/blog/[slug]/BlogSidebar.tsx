'use client';

import Link from 'next/link';

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

const categoryColor: Record<string, string> = {
  Jobs:             'text-lime',
  'AI Tools':       'text-blue-400',
  Roadmap:          'text-amber-400',
  Career:           'text-purple-brand',
  'Interview Prep': 'text-cyan-400',
  General:          'text-slate-400',
};
const categoryBg: Record<string, string> = {
  Jobs:             'rgba(168,230,61,0.08)',
  'AI Tools':       'rgba(96,165,250,0.08)',
  Roadmap:          'rgba(251,191,36,0.08)',
  Career:           'rgba(155,127,232,0.08)',
  'Interview Prep': 'rgba(34,211,238,0.08)',
  General:          'rgba(148,163,184,0.08)',
};
const thumbGradient: Record<string, string> = {
  Jobs:             'from-lime/20 via-lime/5 to-transparent',
  'AI Tools':       'from-blue-400/20 via-blue-400/5 to-transparent',
  Roadmap:          'from-amber-400/20 via-amber-400/5 to-transparent',
  Career:           'from-purple-400/20 via-purple-400/5 to-transparent',
  'Interview Prep': 'from-cyan-400/20 via-cyan-400/5 to-transparent',
  General:          'from-slate-400/20 via-slate-400/5 to-transparent',
};
const thumbTextColor: Record<string, string> = {
  Jobs: 'text-lime', 'AI Tools': 'text-blue-400', Roadmap: 'text-amber-400',
  Career: 'text-purple-brand', 'Interview Prep': 'text-cyan-400', General: 'text-slate-400',
};
const dotColor: Record<string, string> = {
  Jobs: '#A8E63D', 'AI Tools': '#60A5FA', Roadmap: '#FBBF24',
  Career: '#9B7FE8', 'Interview Prep': '#22D3EE', General: '#94A3B8',
};

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── PostRow ──────────────────────────────────────────────────── */
function PostRow({ post, showThumb = false }: { post: BlogPost; showThumb?: boolean }) {
  const coverSrc = post.cover_url || ((post.content ?? '').match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? '');
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="flex gap-3 py-2.5 px-2 -mx-2 rounded-xl transition-colors duration-150 cursor-pointer hover:bg-white/[0.04]">

        {showThumb ? (
          <div className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center
                           overflow-hidden bg-gradient-to-br
                           ${thumbGradient[post.category] ?? thumbGradient.General}`}>
            {coverSrc
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={coverSrc} alt="" className="w-full h-full object-cover" />
              : <span className={`font-poppins font-black text-lg
                                  ${thumbTextColor[post.category] ?? 'text-lime'}`}>
                  {(post.category ?? 'G').slice(0, 2).toUpperCase()}
                </span>
            }
          </div>
        ) : (
          <span className="mt-[7px] flex-shrink-0 w-2 h-2 rounded-full"
                style={{ background: dotColor[post.category] ?? '#A8E63D' }} />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-snug line-clamp-2
                        text-white/85 group-hover:text-lime transition-colors duration-150">
            {post.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-xs font-medium ${categoryColor[post.category] ?? 'text-lime'}`}>
              {post.category}
            </span>
            {post.read_time && (
              <span className="text-xs text-white/25">· {post.read_time}</span>
            )}
            {!showThumb && post.published_at && (
              <span className="text-xs text-white/20">· {formatDate(post.published_at)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── SidebarCard ──────────────────────────────────────────────── */
function SidebarCard({
  accent, title, badge, badgeBg, children,
}: {
  accent: string;
  title: string;
  badge?: string;
  badgeBg?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5"
         style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="block w-1 h-4 rounded-full flex-shrink-0"
              style={{ background: accent }} />
        <p className="font-poppins font-bold text-white text-sm">{title}</p>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                style={{
                  background: badgeBg ?? 'rgba(168,230,61,0.08)',
                  color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── ViewAllLink ──────────────────────────────────────────────── */
function ViewAllLink() {
  return (
    <Link href="/blog"
          className="flex items-center justify-center gap-1.5 mt-3 pt-3
                     text-xs font-semibold text-lime hover:opacity-75 transition-opacity"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      View all articles
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/* ── EmptyState ───────────────────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-6 text-center rounded-xl"
         style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{message}</p>
    </div>
  );
}

/* ── BlogSidebar (main export) ────────────────────────────────── */
export default function BlogSidebar({
  currentCategory,
  tags,
  related,
  recent,
  otherPosts,
}: {
  currentSlug: string;
  currentCategory: string;
  tags: string[];
  related: BlogPost[];
  recent: BlogPost[];
  otherPosts: BlogPost[];
}) {
  /* When there are no related/recent, show otherPosts in both slots */
  const recentToShow  = recent.length > 0 ? recent : otherPosts;
  const relatedToShow = related.length > 0 ? related : [];

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0
                      flex flex-col gap-5 lg:sticky lg:top-24 self-start">

      {/* ── Related Posts ───────────────────────────── */}
      <SidebarCard
        accent="#A8E63D"
        title="Related Posts"
        badge={currentCategory}
        badgeBg={categoryBg[currentCategory]}
      >
        {relatedToShow.length > 0 ? (
          <div className="flex flex-col">
            {relatedToShow.map(p => <PostRow key={p.slug} post={p} showThumb />)}
          </div>
        ) : (
          <EmptyState message={`No other ${currentCategory} posts yet`} />
        )}
      </SidebarCard>

      {/* ── Recent Posts ────────────────────────────── */}
      <SidebarCard accent="#9B7FE8" title="Recent Posts">
        {recentToShow.length > 0 ? (
          <>
            <div className="flex flex-col divide-y divide-white/[0.06]">
              {recentToShow.map(p => <PostRow key={p.slug} post={p} />)}
            </div>
            <ViewAllLink />
          </>
        ) : (
          <EmptyState message="No other posts yet" />
        )}
      </SidebarCard>

      {/* ── Other Posts ─────────────────────────────── */}
      <SidebarCard accent="#22D3EE" title="Other Posts">
        {otherPosts.length > 0 ? (
          <>
            <div className="flex flex-col divide-y divide-white/[0.06]">
              {otherPosts.map(p => <PostRow key={p.slug} post={p} />)}
            </div>
            <ViewAllLink />
          </>
        ) : (
          <EmptyState message="More posts coming soon" />
        )}
      </SidebarCard>

      {/* ── Tags ────────────────────────────────────── */}
      <SidebarCard accent="#FBBF24" title="Tags">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'rgba(255,255,255,0.45)',
                    }}>
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <EmptyState message="No tags on this post" />
        )}
      </SidebarCard>

      {/* ── Telegram CTA ────────────────────────────── */}
      <div className="rounded-2xl p-5 text-center"
           style={{ background: 'rgba(168,230,61,0.05)', border: '1px solid rgba(168,230,61,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
             style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.2)' }}>
          <svg className="w-5 h-5 text-lime" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
          </svg>
        </div>
        <p className="font-poppins font-semibold text-white text-sm mb-1">Stay Updated</p>
        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Daily job and tech updates on Telegram.
        </p>
        <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
           className="btn-lime text-xs w-full block">
          Join Channel
        </a>
      </div>

    </aside>
  );
}
