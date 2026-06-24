import type { Metadata } from 'next';
import Link from 'next/link';
import RoadmapProgress from '@/components/RoadmapProgress';

export const metadata: Metadata = {
  title: 'Study Roadmaps — Frontend, DSA, Backend, System Design & AI/ML',
  description: 'Step-by-step study roadmaps for CS students in India. Frontend, DSA for placements, backend, system design and AI/ML basics.',
};

const roadmaps = [
  {
    id: 'frontend',
    title: 'Frontend Roadmap',
    description: 'Complete path from HTML/CSS to React and Next.js with hands-on projects.',
    icon: '🌐',
    level: 'Beginner',
    duration: '3–4 months',
    modules: 12,
    completed: 8,
    topics: ['HTML & CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Git & GitHub'],
    color: 'from-blue-500/20 to-transparent',
    borderColor: 'border-blue-500/20 hover:border-blue-400/50',
    levelColor: 'text-blue-400 bg-blue-400/10',
  },
  {
    id: 'dsa',
    title: 'DSA Path',
    description: 'Arrays to Dynamic Programming — crack FAANG placements in 3 months.',
    icon: '🧩',
    level: 'Intermediate',
    duration: '3 months',
    modules: 10,
    completed: 4,
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Recursion & DP', 'LeetCode 150'],
    color: 'from-yellow-500/20 to-transparent',
    borderColor: 'border-yellow-500/20 hover:border-yellow-400/50',
    levelColor: 'text-yellow-400 bg-yellow-400/10',
  },
  {
    id: 'backend',
    title: 'Backend Roadmap',
    description: 'Node.js → REST APIs → MongoDB → Cloud deployment from scratch.',
    icon: '⚙️',
    level: 'Intermediate',
    duration: '3–4 months',
    modules: 11,
    completed: 0,
    topics: ['Node.js & Express', 'MongoDB', 'REST APIs', 'Auth (JWT)', 'Docker', 'Deployment'],
    color: 'from-green-500/20 to-transparent',
    borderColor: 'border-green-500/20 hover:border-green-400/50',
    levelColor: 'text-green-400 bg-green-400/10',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Design scalable, fault-tolerant systems for senior interviews.',
    icon: '🏗️',
    level: 'Advanced',
    duration: '2 months',
    modules: 8,
    completed: 0,
    topics: ['Scalability', 'Databases', 'Caching', 'Load Balancers', 'Microservices', 'CAP Theorem'],
    color: 'from-purple-500/20 to-transparent',
    borderColor: 'border-purple-500/20 hover:border-purple-400/50',
    levelColor: 'text-purple-light bg-purple-brand/10',
  },
  {
    id: 'aiml',
    title: 'AI/ML Basics',
    description: 'Start your AI journey from Python to deploying ML models.',
    icon: '🤖',
    level: 'Beginner',
    duration: '4 months',
    modules: 9,
    completed: 0,
    topics: ['Python for ML', 'NumPy & Pandas', 'Scikit-learn', 'Neural Networks', 'NLP', 'Deployment'],
    color: 'from-lime/15 to-transparent',
    borderColor: 'border-lime/20 hover:border-lime/50',
    levelColor: 'text-lime bg-lime/10',
  },
  {
    id: 'devops',
    title: 'DevOps Roadmap',
    description: 'Linux → Docker → CI/CD → Kubernetes — become a DevOps engineer.',
    icon: '🔧',
    level: 'Advanced',
    duration: '4 months',
    modules: 10,
    completed: 0,
    topics: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS/GCP'],
    color: 'from-orange-500/15 to-transparent',
    borderColor: 'border-orange-500/20 hover:border-orange-400/50',
    levelColor: 'text-orange-400 bg-orange-400/10',
  },
];

const totalModules   = roadmaps.reduce((s, r) => s + r.modules, 0);
const totalCompleted = roadmaps.reduce((s, r) => s + r.completed, 0);
const inProgress     = roadmaps.filter(r => r.completed > 0 && r.completed < r.modules).length;
const remaining      = totalModules - totalCompleted;

export default function ResourcesPage() {
  return (
    <div className="pt-20 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Left sidebar — My Progress (§12.2) ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <RoadmapProgress
              totalCompleted={totalCompleted}
              totalModules={totalModules}
              inProgress={inProgress}
              remaining={remaining}
              roadmaps={roadmaps}
            />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="font-poppins font-bold text-3xl text-white">Study Roadmaps</h1>
              <p className="text-gray-400 mt-1">
                Step-by-step guides to master tech skills and land your dream job.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {roadmaps.map(({ id, title, description, icon, level, duration, modules, completed, topics, color, borderColor, levelColor }) => {
                const pct = Math.round((completed / modules) * 100);
                return (
                  <Link key={id} href={`/resources/${id}`}>
                    <div className={`glass-card p-6 border ${borderColor} transition-all duration-300
                                     hover:-translate-y-1 hover:shadow-lime-glow cursor-pointer h-full
                                     bg-gradient-to-br ${color} flex flex-col`}>
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{icon}</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColor}`}>
                          {level}
                        </span>
                      </div>

                      <h2 className="font-poppins font-bold text-white text-base mb-2">{title}</h2>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{description}</p>

                      {/* Progress bar */}
                      {completed > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{completed}/{modules} modules</span>
                            <span className="text-lime">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-lime rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>⏱ {duration}</span>
                        <span>📚 {modules} modules</span>
                      </div>

                      {/* Topic pills */}
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                        {topics.slice(0, 3).map(t => (
                          <span key={t} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md">{t}</span>
                        ))}
                        {topics.length > 3 && (
                          <span className="text-xs text-gray-500 px-1">+{topics.length - 3}</span>
                        )}
                      </div>

                      <p className="text-lime text-sm font-medium mt-4">
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
