import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RoadmapProgress from '@/components/RoadmapProgress';
import RoadmapTrack from '@/components/RoadmapTrack';

type NodeStatus = 'completed' | 'in-progress' | 'locked';

interface RoadmapNode {
  title: string;
  status: NodeStatus;
  resources: { label: string; url: string; type: 'video' | 'article' | 'course' }[];
}

interface RoadmapData {
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  totalTime: string;
  modules: number;
  completedModules: number;
  nodes: RoadmapNode[];
}

// Add roadmaps here as objects in this map keyed by their slug.
const roadmapData: Record<string, RoadmapData> = {};

const allRoadmapsForNav = Object.entries(roadmapData).map(([id, d]) => ({ id, title: d.title }));

const levelColor: Record<string, string> = {
  Beginner:     'text-lime border-lime/40',
  Intermediate: 'text-amber-400 border-amber-400/40',
  Advanced:     'text-red-400 border-red-400/40',
};

const levelBg: Record<string, string> = {
  Beginner:     'rgba(168,230,61,0.1)',
  Intermediate: 'rgba(245,158,11,0.1)',
  Advanced:     'rgba(239,68,68,0.1)',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = roadmapData[slug];
  if (!data) return { title: 'Roadmap Not Found' };
  return {
    title: `${data.title} for CS Students — ${data.level}`,
    description: data.subtitle,
  };
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = roadmapData[slug];
  if (!data) notFound();

  const pct  = Math.round((data.completedModules / data.modules) * 100);
  const next = data.nodes.find(n => n.status === 'in-progress');

  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Progress sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <RoadmapProgress
              totalCompleted={data.completedModules}
              totalModules={data.modules}
              inProgress={data.nodes.filter(n => n.status === 'in-progress').length}
              remaining={data.modules - data.completedModules}
              roadmaps={allRoadmapsForNav}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Breadcrumb */}
            <nav className="text-sm text-ink-muted mb-5 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-lime transition-colors">Home</Link>
              <span className="text-ink-faint">/</span>
              <Link href="/resources" className="hover:text-lime transition-colors">Roadmaps</Link>
              <span className="text-ink-faint">/</span>
              <span className="text-ink">{data.title}</span>
            </nav>

            {/* Header card */}
            <div className="rounded-2xl p-6 md:p-8 mb-6"
                 style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h1 className="font-poppins font-bold text-2xl md:text-3xl text-ink">{data.title}</h1>
                  <p className="text-ink-muted mt-1">{data.subtitle}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${levelColor[data.level]}`}
                      style={{ background: levelBg[data.level] }}>
                  {data.level}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm mb-5">
                <span className="text-ink-muted">{data.modules} <span className="text-ink font-medium">Modules</span></span>
                <span className="text-ink-muted">{data.totalTime} <span className="text-ink font-medium">Total Time</span></span>
                <span className="text-ink-muted">{data.duration} <span className="text-ink font-medium">Duration</span></span>
                {pct > 0 && (
                  <span className="text-ink-muted"><span className="text-lime font-medium">{pct}%</span> Completed</span>
                )}
              </div>

              {/* Progress bar */}
              {data.completedModules > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-ink-faint mb-1.5">
                    <span>{data.completedModules} of {data.modules} modules completed</span>
                    <span className="text-lime font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#2A2A2A' }}>
                    <div className="h-full bg-lime rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Next Up panel */}
            {next && (
              <div className="rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4"
                   style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.3)' }}>
                <div>
                  <p className="text-xs text-lime font-semibold uppercase tracking-wider mb-1">Next Up</p>
                  <h3 className="font-poppins font-bold text-ink">{next.title}</h3>
                  <p className="text-ink-muted text-sm mt-0.5">{next.resources[0]?.label}</p>
                </div>
                <a href={next.resources[0]?.url || '#'} target="_blank" rel="noopener noreferrer"
                   className="btn-lime text-sm py-2.5 px-6 whitespace-nowrap flex-shrink-0">
                  Continue Learning
                </a>
              </div>
            )}

            {/* Roadmap track */}
            {data.nodes.length > 0 ? (
              <RoadmapTrack nodes={data.nodes} />
            ) : (
              <div className="rounded-2xl p-10 text-center"
                   style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="text-ink-muted text-sm">Modules coming soon.</p>
              </div>
            )}

            {/* Community CTA */}
            <div className="rounded-2xl p-6 text-center mt-8"
                 style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
              <p className="text-ink-muted text-sm mb-4">
                Following this roadmap? Join our Telegram for daily tips and curated resources.
              </p>
              <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
                 className="btn-lime inline-block">
                Join Telegram Community
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
