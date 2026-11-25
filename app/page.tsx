import Link from 'next/link';
import JobCardsGrid from '@/components/JobCardsGrid';
import ToolCard from '@/components/ToolCard';
import HeroSection from '@/components/HeroSection';
import FadeUp from '@/components/FadeUp';
import RoadmapCard from '@/components/RoadmapCard';
import BlogCard from '@/components/BlogCard';
import SectionReveal from '@/components/SectionReveal';
import CommunityCTA from '@/components/CommunityCTA';
import WhatIsInsideBento from '@/components/WhatIsInsideBento';
import { getRoadmapCategories } from '@/lib/roadmaps';
import { supabase } from '@/lib/supabase';
import { featuredOrLatest, listLiveJobs, listTools } from '@/lib/data/public';

// Re-render at most once a minute (this used to come from the fetch() cache options)
export const revalidate = 60;

async function getSiteStats() {
  try {
    const [jobsRes, toolsRes, visitorsRes] = await Promise.all([
      supabase.from('jobs').select('id',  { count: 'exact', head: true }),
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('site_stats').select('value').eq('key', 'visitor_count').single(),
    ]);
    return {
      students:  Math.max(2000, visitorsRes.data?.value ?? 2000),  // floor at 2000
      jobs:      jobsRes.count   ?? 0,
      tools:     toolsRes.count  ?? 0,
      resources: 50,
    };
  } catch {
    return { students: 2000, jobs: 0, tools: 0, resources: 50 };
  }
}

async function getLatestBlogs() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, title, category, published_at, excerpt, cover_url, content')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3);
    if (error) { console.error('[home blogs]', error.message); return []; }
    return (data ?? []).map(p => ({
      slug:      p.slug,
      title:     p.title,
      category:  p.category ?? 'General',
      date:      p.published_at ?? '',
      cover_url: p.cover_url || (p.content?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? '') || '',
    }));
  } catch { return []; }
}

// Query Supabase directly (lib/data/public.ts) — no HTTP round-trip to our own API
function getFeaturedJobs() {
  return featuredOrLatest(featured => listLiveJobs({ featured, limit: 6 }));
}

function getFeaturedTools() {
  return featuredOrLatest(featured => listTools({ featured, limit: 4 }));
}

/* ── Level derived from slug ───────────────────────────────── */
const LEVEL_MAP: Record<string, string> = {
  frontend:      'Beginner',
  dsa:           'Intermediate',
  backend:       'Intermediate',
  'system-design': 'Advanced',
  aiml:          'Intermediate',
  devops:        'Advanced',
};

const TIME_MAP: Record<string, string> = {
  frontend:      '3–4 months',
  dsa:           '2–3 months',
  backend:       '3–4 months',
  'system-design': '1–2 months',
  aiml:          '2–3 months',
  devops:        '2–3 months',
};


/* ─── What we offer ──────────────────────────────────────────── */
export default async function HomePage() {
  const [featuredJobs, featuredTools, dbRoadmaps, blogPreviews, siteStats] = await Promise.all([
    getFeaturedJobs(),
    getFeaturedTools(),
    getRoadmapCategories(),
    getLatestBlogs(),
    getSiteStats(),
  ]);
  const jobs  = featuredJobs  as Parameters<typeof JobCardsGrid>[0]['jobs'];
  const tools = featuredTools as (Parameters<typeof ToolCard>[0] & { id?: string })[];

  // Map DB categories → RoadmapCard props
  const roadmaps = dbRoadmaps.map(cat => ({
    id:      `roadmaps/${cat.id}`,   // → /resources/roadmaps/<slug>
    title:   cat.title,
    level:   LEVEL_MAP[cat.id]  ?? 'Beginner',
    modules: cat.tags?.length   ?? 6,
    time:    TIME_MAP[cat.id]   ?? '2–3 months',
    color:   cat.dotColor,
  }));

  return (
    <>
      <HeroSection stats={siteStats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-16 pt-6">

      {/* ── What we offer ── */}
        <SectionReveal>
          <WhatIsInsideBento />
        </SectionReveal>

        {/* ── Latest Jobs ── */}
        <SectionReveal>
          <SectionHeader eyebrow="Updated daily" title="Latest Jobs & Internships"
            desc="Opportunities for CS students and freshers" href="/jobs" linkText="View all" />
          <JobCardsGrid jobs={jobs} />
          {jobs.length === 0 && <EmptyState text="No jobs posted yet. Check back soon." />}
          <div className="text-center mt-6 sm:hidden">
            <Link href="/jobs" className="btn-lime">View all jobs</Link>
          </div>
        </SectionReveal>

        {/* ── Featured AI Tools ── */}
        <SectionReveal>
          <SectionHeader eyebrow="Hand-picked" title="Featured AI Tools"
            desc="Tools every CS student should have in their arsenal" href="/ai-tools" linkText="View all tools" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.slice(0, 4).map((tool, i) => (
              <FadeUp key={tool.id || tool.name} delay={i * 0.09}>
                <ToolCard {...tool} />
              </FadeUp>
            ))}
          </div>
          {tools.length === 0 && <EmptyState text="No tools added yet. Check back soon." />}
        </SectionReveal>

        {/* ── Study Roadmaps ── */}
        <SectionReveal>
          <SectionHeader eyebrow="Step-by-step" title="Study Roadmaps"
            desc="Guided paths to land your first tech role" href="/resources/roadmaps" linkText="View all" />
          {roadmaps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {roadmaps.map(({ id, title, level, modules, time, color }, i) => (
                <FadeUp key={id} delay={i * 0.07}>
                  <RoadmapCard id={id} title={title} level={level} modules={modules} time={time} color={color} />
                </FadeUp>
              ))}
            </div>
          ) : (
            <EmptyState text="No roadmaps yet. Check back soon." />
          )}
        </SectionReveal>

        {/* ── Latest Blog Posts ── */}
        <SectionReveal>
          <SectionHeader eyebrow="Fresh reads" title="Latest Articles"
            desc="Tips, guides and career updates for CS students" href="/blog" linkText="View all" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogPreviews.map(({ slug, title, category, date, cover_url }, i) => (
              <FadeUp key={slug} delay={i * 0.09}>
                <BlogCard slug={slug} title={title} category={category} date={date} coverUrl={cover_url} />
              </FadeUp>
            ))}
          </div>
          {blogPreviews.length === 0 && <EmptyState text="No articles yet. Check back soon." />}
        </SectionReveal>

      </div>

      {/* ── Community CTA — full width, outside spaced wrapper ── */}
      <CommunityCTA />
    </>
  );
}

/* ─── Reusable components ────────────────────────────────────── */

function SectionHeader({ eyebrow, title, desc, href, linkText }: {
  eyebrow: string; title: string; desc: string; href: string; linkText: string;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: '#A8E63D' }}>{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
        <p className="text-ink-muted mt-1 text-sm">{desc}</p>
      </div>
      <Link href={href}
        className="hidden sm:inline-flex items-center gap-1 text-lime hover:text-lime-bright text-sm font-semibold transition-colors">
        {linkText} <span>→</span>
      </Link>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-center text-ink-muted text-sm py-14">{text}</p>;
}
