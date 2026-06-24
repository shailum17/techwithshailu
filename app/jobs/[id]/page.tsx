import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';

interface JobDetail {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  batch_year?: number;
  deadline?: string;
  description: string;
  apply_link: string;
  tags?: string[];
  createdAt?: string;
}

/* ── Company brand colours for demo banners ─────────────────── */
const companyThemes: Record<string, { from: string; to: string; rating: string }> = {
  Razorpay:  { from: '#1a0a3c', to: '#2d1060',   rating: '4.6' },
  Google:    { from: '#0a1628', to: '#1a2d4a',    rating: '4.8' },
  Microsoft: { from: '#001428', to: '#003070',    rating: '4.7' },
  Amazon:    { from: '#1a1000', to: '#2d2000',    rating: '4.2' },
  LinkedIn:  { from: '#001230', to: '#00245a',    rating: '4.5' },
  Default:   { from: '#0d0d0d', to: '#1a1a2e',   rating: '4.4' },
};

async function getJob(id: string): Promise<JobDetail | null> {
  /* Placeholder jobs for when DB isn't connected */
  const placeholders: JobDetail[] = [
    {
      _id: 'j1', title: 'Software Engineering Intern', company: 'Google',
      location: 'Remote', type: 'Internship', salary: '₹50K–₹80K/mo',
      batch_year: 2026, apply_link: 'https://careers.google.com',
      tags: ['Python','ML','GCP'],
      description: `
        <h2>About Company</h2>
        <p>Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.</p>
        <h2>Responsibilities</h2>
        <ul>
          <li>Work on real-world projects that impact millions of users globally.</li>
          <li>Write clean, maintainable, well-tested code.</li>
          <li>Participate in code reviews and design discussions.</li>
          <li>Collaborate with senior engineers and product managers.</li>
          <li>Contribute to open-source projects and internal tools.</li>
        </ul>
        <h2>Requirements</h2>
        <ul>
          <li>Pursuing B.Tech / B.E. in Computer Science or related field.</li>
          <li>Strong fundamentals in Data Structures and Algorithms.</li>
          <li>Proficiency in Python, Java, C++, or Go.</li>
          <li>Experience with version control (Git).</li>
          <li>Excellent problem-solving and communication skills.</li>
        </ul>
      `,
    },
    {
      _id: 'j5', title: 'Backend Developer Intern', company: 'Razorpay',
      location: 'Remote', type: 'Internship', salary: '₹60K–₹90K/mo',
      batch_year: 2026, apply_link: 'https://razorpay.com/jobs',
      tags: ['Node.js','GraphQL','AWS'],
      description: `
        <h2>About Company</h2>
        <p>Razorpay is India's leading payment solutions company, powering payments for 8 million businesses across India. We are on a mission to revolutionize money movement for businesses.</p>
        <h2>Responsibilities</h2>
        <ul>
          <li>Build and maintain high-performance backend APIs serving millions of transactions.</li>
          <li>Design scalable microservices with Node.js and GraphQL.</li>
          <li>Work on AWS infrastructure — Lambda, SQS, RDS.</li>
          <li>Write unit and integration tests for critical payment flows.</li>
          <li>Collaborate with the frontend team on API contracts.</li>
        </ul>
        <h2>Requirements</h2>
        <ul>
          <li>B.Tech / B.E. / MCA — 2025 or 2026 batch.</li>
          <li>Strong understanding of REST APIs and GraphQL.</li>
          <li>Familiarity with Node.js, Express, or similar frameworks.</li>
          <li>Basic knowledge of AWS services is a plus.</li>
          <li>Good problem-solving skills and eagerness to learn.</li>
        </ul>
      `,
    },
  ];

  // Try API first
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${id}`, { next: { revalidate: 1800 } });
    if (res.ok) return res.json();
  } catch { /* fall through */ }

  return placeholders.find(j => j._id === id) || placeholders[0];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: 'Job Not Found' };
  return {
    title: `${job.title} at ${job.company} | ${job.location} | Apply 2026`,
    description: `Apply for ${job.title} at ${job.company}. ${job.location} · ${job.type}${job.salary ? ` · ${job.salary}` : ''}. For 2025–2026 batch.`,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const theme = companyThemes[job.company] || companyThemes.Default;
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const postedDaysAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86_400_000)
    : 2;

  const perks = [
    { icon: '🕐', label: 'Flexible Work Hours' },
    { icon: '📚', label: 'Learning & Mentorship' },
    { icon: '📜', label: 'Certificate of Internship' },
    { icon: '🚀', label: 'Pre-Placement Opportunity' },
  ];

  return (
    <div className="pt-20 min-h-screen pb-20">

      {/* ── Company hero banner (§12.5) ── */}
      <div
        className="w-full h-52 md:h-64 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)` }}
      >
        {/* Decorative light streaks */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-1 bg-purple-brand/60 blur-sm rotate-12" />
          <div className="absolute top-1/2 right-1/4 w-64 h-0.5 bg-lime/40 blur-sm -rotate-6" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-1 bg-white/20 blur-sm rotate-3" />
        </div>

        {/* Company info overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-5 flex items-end gap-4">
          <div className="w-14 h-14 rounded-2xl bg-dark/80 backdrop-blur-sm border border-white/20
                          flex items-center justify-center text-lime font-bold text-lg font-poppins flex-shrink-0">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-poppins font-semibold text-base">{job.company}</p>
              <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30
                               px-2 py-0.5 rounded-full font-medium">
                ★ {theme.rating}
              </span>
            </div>
            <h1 className="font-poppins font-bold text-xl md:text-3xl text-white">{job.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-5 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-lime transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-white truncate">{job.title}</span>
        </nav>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          <span className="tag-lime">{job.type}</span>
          {job.location.toLowerCase().includes('remote') && (
            <span className="tag-lime">Remote</span>
          )}
          <span className="text-xs bg-purple-brand/20 text-purple-light border border-purple-brand/30
                           px-2.5 py-1 rounded-full">
            Posted {postedDaysAgo} day{postedDaysAgo !== 1 ? 's' : ''} ago
          </span>
          {deadline && (
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left content panel (§12.5) ── */}
          <div className="flex-1 min-w-0 space-y-0">
            <div className="glass-card p-6 md:p-8">
              <div
                className="prose prose-invert prose-sm max-w-none
                           prose-headings:font-poppins prose-headings:text-white prose-headings:mt-6
                           prose-h2:flex prose-h2:items-center prose-h2:gap-2
                           prose-p:text-gray-300 prose-li:text-gray-300
                           prose-strong:text-lime prose-a:text-lime
                           [&_h2]:before:content-['▌'] [&_h2]:before:text-purple-brand [&_h2]:before:mr-2
                           [&_h2]:border-b [&_h2]:border-purple-brand/20 [&_h2]:pb-2"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {/* Skills tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm font-semibold text-gray-300 mb-3 font-poppins">
                    Skills Required
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="tag-lime">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm font-medium text-gray-400 mb-3">Share this job</p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/?text=Check out: ${job.title} at ${job.company} — ${process.env.NEXT_PUBLIC_APP_URL || 'https://techwithshailu.in'}/jobs/${job._id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs bg-green-500/10 border border-green-500/20
                               text-green-400 hover:bg-green-500/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    📱 WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex items-center gap-2 text-xs bg-white/5 border border-white/10
                               text-gray-400 hover:text-white hover:border-white/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    🔗 Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sticky sidebar (§12.5) ── */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="space-y-4 sticky top-24">

              {/* Primary CTA */}
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full bg-lime text-dark
                            font-poppins font-bold text-base py-4 rounded-xl
                            hover:bg-lime-bright transition-all duration-200 hover:shadow-lime-glow">
                Apply Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button className="flex items-center justify-center gap-2 w-full border border-white/20
                                 text-white font-semibold text-sm py-3 rounded-xl
                                 hover:border-white/40 hover:bg-white/5 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save Job
              </button>

              {/* Job Overview */}
              <div className="glass-card p-5 space-y-3">
                <p className="font-poppins font-semibold text-white text-sm">Job Overview</p>
                <div className="border-t border-white/10" />
                {[
                  { label: 'Role',      value: job.title },
                  { label: 'Company',   value: job.company },
                  { label: 'Type',      value: job.type },
                  { label: 'Location',  value: job.location },
                  ...(job.batch_year
                    ? [{ label: 'Batch', value: `${job.batch_year} & beyond` }]
                    : []),
                  { label: 'Duration',  value: '3–6 Months' },
                  ...(job.salary
                    ? [{ label: 'Stipend', value: job.salary, highlight: true }]
                    : []),
                  { label: 'Start Date', value: 'Immediate / Flexible' },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-gray-500 flex-shrink-0">{label}</span>
                    <span className={`text-right font-medium ${
                      highlight ? 'text-purple-light bg-purple-brand/15 px-2 py-0.5 rounded-lg text-xs' : 'text-white'
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Perks & Benefits */}
              <div className="glass-card p-5">
                <p className="font-poppins font-semibold text-white text-sm mb-4">Perks & Benefits</p>
                <div className="grid grid-cols-2 gap-3">
                  {perks.map(({ icon, label }) => (
                    <div key={label}
                      className="flex flex-col items-center gap-1.5 p-3 bg-white/5 rounded-xl text-center">
                      <span className="text-xl text-lime">{icon}</span>
                      <span className="text-xs text-gray-300 leading-snug">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Apply */}
              <div className="glass-card p-5">
                <p className="font-poppins font-semibold text-white text-sm mb-2">How to Apply</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Click "Apply Now" to be redirected to the official company careers page.
                  Make sure your resume is updated and tailored to this role.
                  Best of luck! 🚀
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
