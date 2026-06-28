export interface RoadmapResource {
  name: string;
  description: string;
  url: string;
  domain: string;
  tags: { label: string; color: string; bg: string }[];
}

export interface RoadmapCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  dotColor: string;
  resources: RoadmapResource[];
  proTip?: { text: string; linkLabel?: string; linkUrl?: string };
}

export const roadmapCategories: RoadmapCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    subtitle: 'Go from HTML basics to building production-grade React & Next.js apps.',
    description: 'HTML → CSS → JavaScript → React → Next.js — the complete frontend path.',
    dotColor: '#60a5fa',
    resources: [],
  },
  {
    id: 'dsa',
    title: 'DSA & Competitive Programming',
    subtitle: 'Crack placement tests and coding rounds at top companies.',
    description: 'Arrays → DP → Graphs — everything you need to ace placement season.',
    dotColor: '#fbbf24',
    resources: [],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    subtitle: 'Build scalable APIs, work with databases and deploy to the cloud.',
    description: 'Node.js → REST APIs → MongoDB → SQL → Cloud — the complete backend path.',
    dotColor: '#4ade80',
    resources: [],
  },
  {
    id: 'system-design',
    title: 'System Design',
    subtitle: 'Design scalable systems and ace the system design interview round.',
    description: 'Load balancers → Caching → Databases → Microservices — think at scale.',
    dotColor: '#a78bfa',
    resources: [],
  },
  {
    id: 'aiml',
    title: 'AI / ML Basics',
    subtitle: 'Go from Python basics to building and deploying machine learning models.',
    description: 'Python → NumPy → Scikit-learn → Deep Learning — your ML starting point.',
    dotColor: '#a8e63d',
    resources: [],
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    subtitle: 'Learn to build, ship and run applications reliably at scale.',
    description: 'Linux → Docker → Kubernetes → CI/CD → AWS/GCP — the DevOps path.',
    dotColor: '#fb923c',
    resources: [],
  },
];
