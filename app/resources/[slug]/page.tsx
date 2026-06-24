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

const roadmapData: Record<string, RoadmapData> = {
  frontend: {
    title: 'Frontend Roadmap',
    subtitle: 'Step-by-step guide to becoming a modern frontend developer.',
    level: 'Beginner', duration: '3–4 months', totalTime: '24h 30m',
    modules: 12, completedModules: 8,
    nodes: [
      { title: 'HTML & CSS',   status: 'completed',   resources: [{ label: 'HTML Full Course – freeCodeCamp',   url: 'https://youtube.com',    type: 'video'   }, { label: 'MDN Web Docs HTML',  url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: 'article' }] },
      { title: 'CSS',          status: 'completed',   resources: [{ label: 'CSS Crash Course – Traversy Media', url: 'https://youtube.com',    type: 'video'   }, { label: 'CSS Tricks',         url: 'https://css-tricks.com', type: 'article' }] },
      { title: 'JavaScript',   status: 'completed',   resources: [{ label: 'Namaste JavaScript – Akshay Saini', url: 'https://youtube.com',    type: 'video'   }, { label: 'javascript.info',    url: 'https://javascript.info', type: 'article' }] },
      { title: 'DOM & BOM',    status: 'in-progress', resources: [{ label: 'DOM Manipulation – Fireship',       url: 'https://youtube.com',    type: 'video'   }, { label: 'MDN – DOM',          url: 'https://developer.mozilla.org', type: 'article' }] },
      { title: 'ES6+',         status: 'locked',      resources: [{ label: 'ES6 Full Course',                   url: 'https://youtube.com',    type: 'video'   }] },
      { title: 'Git & GitHub', status: 'locked',      resources: [{ label: 'Git Tutorial – Kunal Kushwaha',     url: 'https://youtube.com',    type: 'video'   }, { label: 'GitHub Docs', url: 'https://docs.github.com', type: 'article' }] },
    ],
  },
  dsa: {
    title: 'DSA Path',
    subtitle: 'Complete DSA roadmap to crack top tech companies in placements.',
    level: 'Intermediate', duration: '3 months', totalTime: '30h',
    modules: 10, completedModules: 4,
    nodes: [
      { title: 'Arrays & Strings',    status: 'completed',   resources: [{ label: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org', type: 'article' }, { label: 'Arrays – Love Babbar', url: 'https://youtube.com', type: 'video' }] },
      { title: 'Linked Lists',        status: 'completed',   resources: [{ label: 'Linked Lists – Striver',  url: 'https://youtube.com', type: 'video' }] },
      { title: 'Stacks & Queues',     status: 'completed',   resources: [{ label: 'Stacks – Apna College',   url: 'https://youtube.com', type: 'video' }] },
      { title: 'Trees',               status: 'in-progress', resources: [{ label: 'Binary Trees – Striver',  url: 'https://youtube.com', type: 'video' }] },
      { title: 'Graphs',              status: 'locked',      resources: [{ label: 'Graph Series – William Fiset', url: 'https://youtube.com', type: 'video' }] },
      { title: 'Dynamic Programming', status: 'locked',      resources: [{ label: 'DP Series – Aditya Verma', url: 'https://youtube.com', type: 'video' }, { label: 'NeetCode DP Patterns', url: 'https://neetcode.io', type: 'article' }] },
    ],
  },
  backend: {
    title: 'Backend Roadmap',
    subtitle: 'Build scalable APIs and full-stack applications from scratch.',
    level: 'Intermediate', duration: '3–4 months', totalTime: '28h',
    modules: 11, completedModules: 0,
    nodes: [
      { title: 'Node.js Basics',  status: 'in-progress', resources: [{ label: 'Node.js Crash Course',           url: 'https://youtube.com',       type: 'video'   }] },
      { title: 'Express.js',      status: 'locked',      resources: [{ label: 'Express Official Docs',          url: 'https://expressjs.com',      type: 'article' }] },
      { title: 'MongoDB',         status: 'locked',      resources: [{ label: 'MongoDB University (Free)',       url: 'https://university.mongodb.com', type: 'course' }] },
      { title: 'REST API Design', status: 'locked',      resources: [{ label: 'REST API Best Practices',        url: 'https://restfulapi.net',     type: 'article' }] },
      { title: 'Auth (JWT)',      status: 'locked',      resources: [{ label: 'JWT Auth Tutorial',              url: 'https://youtube.com',       type: 'video'   }] },
      { title: 'Deployment',      status: 'locked',      resources: [{ label: 'Deploy to Railway / Render',     url: 'https://railway.app',       type: 'article' }] },
    ],
  },
  'system-design': {
    title: 'System Design',
    subtitle: 'Learn to design scalable, fault-tolerant systems for senior interviews.',
    level: 'Advanced', duration: '2 months', totalTime: '20h',
    modules: 8, completedModules: 0,
    nodes: [
      { title: 'Scalability',    status: 'in-progress', resources: [{ label: 'System Design Primer – GitHub', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' }] },
      { title: 'Databases',      status: 'locked',      resources: [{ label: 'Database Design – Fireship',    url: 'https://youtube.com', type: 'video'   }] },
      { title: 'Caching (Redis)',status: 'locked',      resources: [{ label: 'Redis Crash Course',            url: 'https://youtube.com', type: 'video'   }] },
      { title: 'Microservices',  status: 'locked',      resources: [{ label: 'Microservices Guide',           url: 'https://microservices.io', type: 'article' }] },
      { title: 'Real Systems',   status: 'locked',      resources: [{ label: 'Design Instagram, Netflix – Gaurav Sen', url: 'https://youtube.com', type: 'video' }] },
    ],
  },
  aiml: {
    title: 'AI / ML Basics',
    subtitle: 'Start your AI journey from Python basics to deploying ML models.',
    level: 'Beginner', duration: '4 months', totalTime: '22h',
    modules: 9, completedModules: 0,
    nodes: [
      { title: 'Python for ML',    status: 'in-progress', resources: [{ label: 'Python – freeCodeCamp',             url: 'https://youtube.com',             type: 'video'  }] },
      { title: 'NumPy & Pandas',   status: 'locked',      resources: [{ label: 'Pandas – Corey Schafer',            url: 'https://youtube.com',             type: 'video'  }] },
      { title: 'Scikit-learn',     status: 'locked',      resources: [{ label: 'ML Course – Andrew Ng (Coursera)',  url: 'https://coursera.org',            type: 'course' }] },
      { title: 'Neural Networks',  status: 'locked',      resources: [{ label: 'Neural Nets – 3Blue1Brown',         url: 'https://youtube.com',             type: 'video'  }] },
      { title: 'NLP & LLMs',       status: 'locked',      resources: [{ label: 'HuggingFace NLP Course (Free)',     url: 'https://huggingface.co/course',   type: 'course' }] },
      { title: 'Model Deployment', status: 'locked',      resources: [{ label: 'Deploy ML Model with Flask',        url: 'https://youtube.com',             type: 'video'  }] },
    ],
  },
  devops: {
    title: 'DevOps Roadmap',
    subtitle: 'From Linux basics to full-scale Kubernetes deployments.',
    level: 'Advanced', duration: '4 months', totalTime: '35h',
    modules: 10, completedModules: 0,
    nodes: [
      { title: 'Linux Basics',    status: 'in-progress', resources: [{ label: 'Linux Crash Course – NetworkChuck', url: 'https://youtube.com',                     type: 'video'   }] },
      { title: 'Docker',          status: 'locked',      resources: [{ label: 'Docker Full Course – TechWorld',    url: 'https://youtube.com',                     type: 'video'   }] },
      { title: 'CI/CD Pipelines', status: 'locked',      resources: [{ label: 'GitHub Actions Guide',             url: 'https://docs.github.com/en/actions',      type: 'article' }] },
      { title: 'Kubernetes',      status: 'locked',      resources: [{ label: 'Kubernetes Crash Course',          url: 'https://youtube.com',                     type: 'video'   }] },
      { title: 'Terraform',       status: 'locked',      resources: [{ label: 'Terraform in 100 Seconds',         url: 'https://youtube.com',                     type: 'video'   }] },
      { title: 'Cloud (AWS/GCP)', status: 'locked',      resources: [{ label: 'AWS Free Tier + Docs',             url: 'https://aws.amazon.com/free',             type: 'article' }] },
    ],
  },
};

const allRoadmapsForNav = Object.entries(roadmapData).map(([id, d]) => ({ id, title: d.title }));

const levelColor: Record<string, string> = {
  Beginner:     'text-green-600 bg-green-50 border-green-200',
  Intermediate: 'text-amber-600 bg-amber-50 border-amber-200',
  Advanced:     'text-red-600 bg-red-50 border-red-200',
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
    <div className="pt-20 min-h-screen pb-20 bg-surface-secondary">
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
              <span>/</span>
              <Link href="/resources" className="hover:text-lime transition-colors">Roadmaps</Link>
              <span>/</span>
              <span className="text-ink">{data.title}</span>
            </nav>

            {/* Header card */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 md:p-8 shadow-card mb-6">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h1 className="font-poppins font-bold text-2xl md:text-3xl text-ink">{data.title}</h1>
                  <p className="text-ink-muted mt-1">{data.subtitle}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${levelColor[data.level]}`}>
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
                  <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                    <div className="h-full bg-lime rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Next Up panel */}
            {next && (
              <div className="bg-lime-light border border-lime/30 rounded-2xl p-5 mb-6 flex items-center
                              justify-between flex-wrap gap-4">
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
            <RoadmapTrack nodes={data.nodes} />

            {/* Community CTA */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 text-center mt-8 shadow-card">
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
