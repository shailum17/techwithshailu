import type { Metadata } from 'next';
import Link from 'next/link';
import RoadmapProgress from '@/components/RoadmapProgress';

export const metadata: Metadata = {
  title: 'Study Roadmaps — Frontend, DSA, Backend, System Design & AI/ML',
  description: 'Step-by-step study roadmaps for CS students in India. Frontend, DSA for placements, backend, system design and AI/ML basics.',
};

const roadmaps = [
  {
    id: 'frontend', title: 'Frontend Roadmap', description: 'Complete path from HTML/CSS to React and Next.js with hands-on projects.',
    level: 'Beginner',     duration: '3–4 months', modules: 12, completed: 8,
    topics: ['HTML & CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Git'],
    border: 'border-blue-200 hover:border-blue-400', levelColor: 'text-blue-600 bg-blue-50',
    gradient: 'from-blue-50 to-white',
  },
  {
    id: 'dsa',      title: 'DSA Path',          description: 'Arrays to Dynamic Programming — crack FAANG placements in 3 months.',
    level: 'Intermediate', duration: '3 months',   modules: 10, completed: 4,
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'DP', 'LeetCode 150'],
    border: 'border-amber-200 hover:border-amber-400', levelColor: 'text-amber-600 bg-amber-50',
    gradient: 'from-amber-50 to-white',
  },
  {
    id: 'backend',  title: 'Backend Roadmap',   description: 'Node.js to REST APIs to MongoDB and cloud deployment.',
    level: 'Intermediate', duration: '3–4 months', modules: 11, completed: 0,
    topics: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Auth', 'Deployment'],
    border: 'border-green-200 hover:border-green-400', levelColor: 'text-green-600 bg-green-50',
    gradient: 'from-green-50 to-white',
  },
  {
    id: 'system-design', title: 'System Design', description: 'Design scalable, fault-tolerant systems for senior interviews.',
    level: 'Advanced',     duration: '2 months',   modules: 8,  completed: 0,
    topics: ['Scalability', 'Databases', 'Caching', 'Load Balancers', 'Microservices'],
    border: 'border-purple-200 hover:border-purple-400', levelColor: 'text-purple-brand bg-purple-tint',
    gradient: 'from-purple-50 to-white',
  },
  {
    id: 'aiml',     title: 'AI / ML Basics',    description: 'Start your AI journey from Python basics to deploying ML models.',
    level: 'Beginner',     duration: '4 months',   modules: 9,  completed: 0,
    topics: ['Python for ML', 'NumPy & Pandas', 'Scikit-learn', 'Neural Networks', 'NLP'],
    border: 'border-lime/30 hover:border-lime', levelColor: 'text-lime bg-lime-light',
    gradient: 'from-lime-light to-white',
  },
  {
    id: 'devops',   title: 'DevOps Roadmap',    description: 'Linux to Docker to Kubernetes — become a DevOps engineer.',
    level: 'Advanced',     duration: '4 months',   modules: 10, completed: 0,
    topics: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS'],
    border: 'border-orange-200 hover:border-orange-400', levelColor: 'text-orange-600 bg-orange-50',
    gradient: 'from-orange-50 to-white',
  },
];

const totalModules   = roadmaps.reduce((s, r) => s + r.modules, 0);
const totalCompleted = roadmaps.reduce((s, r) => s + r.completed, 0);
const inProgress     = roadmaps.filter(r => r.completed > 0 && r.completed < r.modules).length;

export default function ResourcesPage() {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Progress sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:pr-7" style={{ borderRight: '1px solid #2A2A2A' }}>
              <RoadmapProgress
                totalCompleted={totalCompleted}
                totalModules={totalModules}
                inProgress={inProgress}
                remaining={totalModules - totalCompleted}
                roadmaps={roadmaps}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="font-poppins font-bold text-3xl text-ink">Study Roadmaps</h1>
              <p className="text-ink-muted mt-1">
                Step-by-step guides to master tech skills and land your dream job.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {roadmaps.map(({ id, title, description, level, duration, modules, completed, topics, levelColor }) => {
                const pct = Math.round((completed / modules) * 100);
                const leftBorder =
                  level === 'Beginner'     ? '#A8E63D' :
                  level === 'Intermediate' ? '#F59E0B' : '#EF4444';
                const levelBg =
                  level === 'Beginner'     ? 'rgba(168,230,61,0.1)'  :
                  level === 'Intermediate' ? 'rgba(245,158,11,0.1)'  : 'rgba(239,68,68,0.1)';

                return (
                  <Link key={id} href={`/resources/${id}`}>
                    <div className="rounded-2xl p-6 cursor-pointer h-full flex flex-col
                                     hover:-translate-y-1 transition-all duration-300"
                         style={{
                           background: '#111111',
                           border: `1px solid #2A2A2A`,
                           borderLeftWidth: '4px',
                           borderLeftColor: leftBorder,
                           boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                         }}
                         onMouseEnter={e => {
                           (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.6)`;
                           (e.currentTarget as HTMLElement).style.borderColor = '#3A3A3A';
                           (e.currentTarget as HTMLElement).style.borderLeftColor = leftBorder;
                         }}
                         onMouseLeave={e => {
                           (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.4)';
                           (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A';
                           (e.currentTarget as HTMLElement).style.borderLeftColor = leftBorder;
                         }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="font-poppins font-bold text-ink text-base">{title}</h2>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${levelColor}`}
                              style={{ background: levelBg }}>
                          {level}
                        </span>
                      </div>

                      <p className="text-ink-muted text-sm leading-relaxed mb-4 flex-1">{description}</p>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-ink-faint mb-1">
                          <span>{completed}/{modules} modules</span>
                          <span className="text-lime font-medium">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#2A2A2A' }}>
                          <div
                            className="h-full bg-lime rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-ink-faint mb-4">
                        <span>{duration}</span>
                        <span>{modules} modules</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-4" style={{ borderTop: '1px solid #2A2A2A' }}>
                        {topics.slice(0, 3).map(t => (
                          <span key={t} className="text-xs text-ink-muted px-2 py-0.5 rounded-md"
                                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                            {t}
                          </span>
                        ))}
                        {topics.length > 3 && (
                          <span className="text-xs text-ink-faint">+{topics.length - 3}</span>
                        )}
                      </div>

                      <p className="text-lime text-sm font-bold mt-4">
                        {completed > 0 ? 'Continue →' : 'Start Learning →'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
