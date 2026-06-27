import Link from 'next/link';
import JobCardsGrid from '@/components/JobCardsGrid';
import ToolCard from '@/components/ToolCard';
import HeroSection from '@/components/HeroSection';
import FadeUp from '@/components/FadeUp';
import RoadmapCard from '@/components/RoadmapCard';
import BlogCard from '@/components/BlogCard';

async function getFeaturedJobs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?featured=true`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getFeaturedTools() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tools?featured=true`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

const roadmaps: {
  id: string; title: string; level: string;
  modules: number; time: string; color: string;
}[] = [];

const blogPreviews: { slug: string; title: string; category: string; date: string }[] = [];

export default async function HomePage() {
  const [featuredJobs, featuredTools] = await Promise.all([getFeaturedJobs(), getFeaturedTools()]);
  const jobs  = featuredJobs  as Parameters<typeof JobCardsGrid>[0]['jobs'];
  const tools = featuredTools as (Parameters<typeof ToolCard>[0] & { _id?: string })[];

  return (
    <>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-24 pt-8">

        {/* Latest Jobs */}
        <section>
          <FadeUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Latest Jobs & Internships</h2>
                <p className="text-ink-muted mt-1 text-sm">
                  Opportunities for CS students and freshers
                </p>
              </div>
              <Link href="/jobs" className="text-lime hover:text-lime-bright text-sm font-medium transition-colors hidden sm:block">
                View all
              </Link>
            </div>
          </FadeUp>
          <JobCardsGrid jobs={jobs} />
          {jobs.length === 0 && (
            <p className="text-center text-ink-muted text-sm py-8">No jobs posted yet. Check back soon.</p>
          )}
          <div className="text-center mt-6 sm:hidden">
            <Link href="/jobs" className="btn-lime">View all jobs</Link>
          </div>
        </section>

        {/* Featured AI Tools */}
        <section>
          <FadeUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Featured AI Tools</h2>
                <p className="text-ink-muted mt-1 text-sm">Hand-picked tools every CS student should know</p>
              </div>
              <Link href="/ai-tools" className="text-lime hover:text-lime-bright text-sm font-medium transition-colors hidden sm:block">
                View all tools
              </Link>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.slice(0, 4).map((tool, i: number) => (
              <FadeUp key={tool._id || tool.name} delay={i * 0.09}>
                <ToolCard {...tool} />
              </FadeUp>
            ))}
          </div>
          {tools.length === 0 && (
            <p className="text-center text-ink-muted text-sm py-8">No tools added yet. Check back soon.</p>
          )}
        </section>

        {/* Study Roadmaps */}
        <section>
          <FadeUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Study Roadmaps</h2>
                <p className="text-ink-muted mt-1 text-sm">Step-by-step guides to land your dream tech job</p>
              </div>
              <Link href="/resources" className="text-lime hover:text-lime-bright text-sm font-medium transition-colors hidden sm:block">
                View all
              </Link>
            </div>
          </FadeUp>
          {roadmaps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {roadmaps.map(({ id, title, level, modules, time, color }, i) => (
                <FadeUp key={id} delay={i * 0.07}>
                  <RoadmapCard id={id} title={title} level={level} modules={modules} time={time} color={color} />
                </FadeUp>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-muted text-sm py-8">No roadmaps yet. Check back soon.</p>
          )}
        </section>

        {/* Latest Blog Posts */}
        <section>
          <FadeUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Latest Articles</h2>
                <p className="text-ink-muted mt-1 text-sm">Tips, guides and updates for CS students</p>
              </div>
              <Link href="/blog" className="text-lime hover:text-lime-bright text-sm font-medium transition-colors hidden sm:block">
                View all
              </Link>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogPreviews.map(({ slug, title, category, date }, i) => (
              <FadeUp key={slug} delay={i * 0.09}>
                <BlogCard slug={slug} title={title} category={category} date={date} />
              </FadeUp>
            ))}
          </div>
          {blogPreviews.length === 0 && (
            <p className="text-center text-ink-muted text-sm py-8">No articles yet. Check back soon.</p>
          )}
        </section>

        {/* Community CTA */}
        <FadeUp>
          <div className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
               style={{ backgroundColor: '#0D1A00', border: '1px solid #A8E63D55' }}>
            {/* Subtle radial glow */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(168,230,61,0.07), transparent)' }} />
            <div className="relative z-10">
              <h2 className="font-poppins font-bold text-2xl md:text-3xl text-white mb-3">
                Join the Community
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
                Get daily job updates, interview tips, and AI tool recommendations directly on
                Telegram and WhatsApp. Over 1,000 students already in the group.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
                   className="btn-lime px-8 py-3">
                  Join Telegram
                </a>
                <a href="https://chat.whatsapp.com/KnzRYRlTS5jA86Ozo71vlr" target="_blank" rel="noopener noreferrer"
                   className="btn-purple-outline px-8 py-3 border-white/30 text-white hover:bg-white/10">
                  Join WhatsApp
                </a>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </>
  );
}
