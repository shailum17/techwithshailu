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

async function getSiteStats() {
  try {
    const [jobsRes, toolsRes, visitorsRes] = await Promise.all([
      supabase.from('jobs').select('id',  { count: 'exact', head: true }),
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('site_stats').select('value').eq('key', 'visitor_count').single(),
    ]);
    return {
      students:  visitorsRes.data?.value ?? 0,  // real visitor count
      jobs:      jobsRes.count   ?? 0,           // real job count
      tools:     toolsRes.count  ?? 0,           // real tool count
      resources: 50,                             // fixed — roadmaps + resource pages
    };
  } catch {
    return { students: 0, jobs: 0, tools: 0, resources: 50 };
  }
}

async function getLatestBlogs() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, title, category, published_at, excerpt')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3);
    if (error) { console.error('[home blogs]', error.message); return []; }
    return (data ?? []).map(p => ({
      slug:     p.slug,
      title:    p.title,
      category: p.category ?? 'General',
      date:     p.published_at ?? '',
    }));
  } catch { return []; }
}

async function getFeaturedJobs() {
  try {
    const base = `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs`;
    // Try featured first; if none are marked featured, fall back to latest 6
    const featuredRes = await fetch(`${base}?featured=true&limit=6`, { next: { revalidate: 60 } });
    if (featuredRes.ok) {
      const featured = await featuredRes.json();
      if (Array.isArray(featured) && featured.length > 0) return featured;
    }
    // Fallback: latest 6 live jobs
    const latestRes = await fetch(`${base}?limit=6`, { next: { revalidate: 60 } });
    if (!latestRes.ok) return [];
    return latestRes.json();
  } catch { return []; }
}

async function getFeaturedTools() {
  try {
    const base = `${process.env.NEXT_PUBLIC_APP_URL}/api/tools`;
    const featuredRes = await fetch(`${base}?featured=true&limit=4`, { next: { revalidate: 60 } });
    if (featuredRes.ok) {
      const featured = await featuredRes.json();
      if (Array.isArray(featured) && featured.length > 0) return featured;
    }
    const latestRes = await fetch(`${base}?limit=4`, { next: { revalidate: 60 } });
    if (!latestRes.ok) return [];
    return latestRes.json();
  } catch { return []; }
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
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: 'Tech Jobs & Internships',
    desc: 'Freshers-friendly listings updated daily from top product companies and startups.',
    href: '/jobs',
    accent: '#A8E63D',
    span: 'md:col-span-2',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'AI Tools Directory',
    desc: 'Hand-picked AI tools every CS student should have in their toolkit.',
    href: '/ai-tools',
    accent: '#9B7FE8',
    span: '',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3"/>
      </svg>
    ),
    title: 'Study Roadmaps',
    desc: 'Structured paths for DSA, frontend, backend, and system design.',
    href: '/resources/roadmaps',
    accent: '#A8E63D',
    span: '',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Resume Hub',
    desc: 'Free, ATS-ready resume templates for software engineers.',
    href: '/resources/resume-hub',
    accent: '#9B7FE8',
    span: '',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/>
        <path d="M18 14H6"/><path d="M15 18H6"/>
        <path d="M2 13h4"/><path d="M2 17h4"/>
      </svg>
    ),
    title: 'Tech Articles',
    desc: 'Tips, interview prep guides and career advice written for freshers.',
    href: '/blog',
    accent: '#A8E63D',
    span: '',
  },
];

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
            {blogPreviews.map(({ slug, title, category, date }, i) => (
              <FadeUp key={slug} delay={i * 0.09}>
                <BlogCard slug={slug} title={title} category={category} date={date} />
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
