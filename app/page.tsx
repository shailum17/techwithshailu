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

const roadmaps = [
  { id: 'frontend',      title: 'Frontend Roadmap',  level: 'Beginner',     modules: 12, time: '24h 30m', color: 'text-blue-600' },
  { id: 'dsa',           title: 'DSA Path',           level: 'Intermediate', modules: 10, time: '30h',     color: 'text-amber-600' },
  { id: 'backend',       title: 'Backend Roadmap',    level: 'Intermediate', modules: 11, time: '28h',     color: 'text-green-600' },
  { id: 'system-design', title: 'System Design',      level: 'Advanced',     modules: 8,  time: '20h',     color: 'text-purple-brand' },
  { id: 'aiml',          title: 'AI / ML Basics',     level: 'Beginner',     modules: 9,  time: '22h',     color: 'text-lime' },
];

const blogPreviews = [
  { slug: 'goldman-sachs-off-campus-2026',   title: 'Goldman Sachs Off-Campus Drive 2026',       category: 'Jobs',     date: 'Jun 20' },
  { slug: 'best-ai-tools-for-students-2026', title: '15 Best AI Tools for CS Students in 2026',  category: 'AI Tools', date: 'Jun 18' },
  { slug: 'dsa-roadmap-placements-2026',     title: 'DSA Roadmap for Placements 2026',           category: 'Roadmap',  date: 'Jun 15' },
];

const placeholderJobs = [
  { _id: 'p1', title: 'Software Engineering Intern', company: 'Google',    location: 'Remote',    type: 'Internship' as const, salary: '₹50K–₹80K/mo', tags: ['Python','GCP','ML'],       is_featured: true },
  { _id: 'p2', title: 'Software Developer Intern',   company: 'Microsoft', location: 'Hyderabad', type: 'Internship' as const, salary: '₹60K–₹90K/mo', tags: ['C#','Azure','.NET'],       is_featured: true },
  { _id: 'p3', title: 'SDE Intern',                  company: 'Amazon',    location: 'Bengaluru', type: 'Internship' as const, salary: '₹45K–₹70K/mo', tags: ['Java','AWS','DSA'],        is_featured: true },
  { _id: 'p4', title: 'Backend Developer Intern',    company: 'LinkedIn',  location: 'Remote',    type: 'Internship' as const, salary: '₹60K–₹90K/mo', tags: ['Node.js','GraphQL'],       is_featured: true },
  { _id: 'p5', title: 'SWE Intern',                  company: 'Ola',       location: 'Bengaluru', type: 'Internship' as const, salary: '₹40K–₹60K/mo', tags: ['React','TypeScript'],      is_featured: false },
  { _id: 'p6', title: 'Software Intern',             company: 'Paytm',     location: 'Noida',     type: 'Internship' as const, salary: '₹35K–₹55K/mo', tags: ['Java','Spring','SQL'],     is_featured: false },
];

const placeholderTools = [
  { name: 'ChatGPT',        description: 'Conversational AI for writing, coding, and research.', category: 'Writing',      url: 'https://chat.openai.com',    is_free: true,  is_featured: true,  votes: 12400 },
  { name: 'Midjourney',     description: 'Generate professional images from text prompts.',      category: 'Image',        url: 'https://midjourney.com',     is_free: false, is_featured: true,  votes: 9800  },
  { name: 'GitHub Copilot', description: 'AI pair programmer that writes code as you type.',     category: 'Coding',       url: 'https://copilot.github.com', is_free: false, is_featured: true,  votes: 8600  },
  { name: 'Notion AI',      description: 'Writing assistant built into Notion workspace.',       category: 'Productivity', url: 'https://notion.so',          is_free: true,  is_featured: false, votes: 6500  },
];

export default async function HomePage() {
  const [featuredJobs, featuredTools] = await Promise.all([getFeaturedJobs(), getFeaturedTools()]);
  const jobs  = featuredJobs.length  > 0 ? featuredJobs  : placeholderJobs;
  const tools = featuredTools.length > 0 ? featuredTools : placeholderTools;

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
                  <span className="text-lime font-semibold">128 openings</span> for CS students and freshers
                </p>
              </div>
              <Link href="/jobs" className="text-lime hover:text-lime-bright text-sm font-medium transition-colors hidden sm:block">
                View all
              </Link>
            </div>
          </FadeUp>
          <JobCardsGrid jobs={jobs} />
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
                View all 124 tools
              </Link>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.slice(0, 4).map((tool: Parameters<typeof ToolCard>[0] & { _id?: string }, i: number) => (
              <FadeUp key={tool._id || tool.name} delay={i * 0.09}>
                <ToolCard {...tool} />
              </FadeUp>
            ))}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {roadmaps.map(({ id, title, level, modules, time, color }, i) => {
              const completionPct = id === 'frontend' ? 67 : id === 'dsa' ? 40 : 0;
              return (
                <FadeUp key={id} delay={i * 0.07}>
                  <RoadmapCard
                    id={id}
                    title={title}
                    level={level}
                    modules={modules}
                    time={time}
                    color={color}
                    completionPct={completionPct}
                  />
                </FadeUp>
              );
            })}
          </div>
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
                <a href="https://instagram.com/techwithshailu" target="_blank" rel="noopener noreferrer"
                   className="btn-purple-outline px-8 py-3 border-white/30 text-white hover:bg-white/10">
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </>
  );
}
