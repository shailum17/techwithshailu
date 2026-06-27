export interface ResumeTool {
  name: string;
  description: string;
  url: string;
  domain: string;
  tags: { label: string; color: string; bg: string }[];
}

export interface ResumeCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string; // short blurb for the card
  dotColor: string;
  tools: ResumeTool[];
  proTip?: { text: string; linkLabel?: string; linkUrl?: string };
}

export const categories: ResumeCategory[] = [
  {
    id: 'builders',
    title: 'Resume Builders',
    subtitle: 'Build a resume that gets past ATS filters and gets you noticed.',
    description: '10 curated tools — from AI-powered builders to LaTeX templates for CS students.',
    dotColor: '#60a5fa',
    tools: [
      {
        name: 'Jobscan',
        description: 'Match your resume with the job description and get a match score that tells you exactly how ATS-ready you are.',
        url: 'https://jobscan.co',
        domain: 'jobscan.co',
        tags: [{ label: 'AI match', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' }],
      },
      {
        name: 'Teal',
        description: 'AI-powered resumes tailored to every job role — auto-customizes your content for each application.',
        url: 'https://tealhq.com',
        domain: 'tealhq.com',
        tags: [{ label: 'AI-powered', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' }],
      },
      {
        name: 'Resume.io',
        description: 'Clean, beginner-friendly templates that are easy to use and look polished right out of the box.',
        url: 'https://resume.io',
        domain: 'resume.io',
        tags: [],
      },
      {
        name: 'Novorésumé',
        description: 'Keyword suggestions and content tips built right in — great for optimising for specific job postings.',
        url: 'https://novoresume.com',
        domain: 'novoresume.com',
        tags: [],
      },
      {
        name: 'ResumeGemini',
        description: 'Best free option with professional templates built for freshers and first-time job seekers.',
        url: 'https://resumegemini.com',
        domain: 'resumegemini.com',
        tags: [{ label: 'Free', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' }],
      },
      {
        name: 'Kickresume',
        description: 'Creative templates with a built-in AI writing assistant to help you write compelling bullet points.',
        url: 'https://kickresume.com',
        domain: 'kickresume.com',
        tags: [{ label: 'AI writing', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' }],
      },
      {
        name: 'Enhancv',
        description: 'Modern, standout templates designed to make your resume visually memorable while staying ATS-compliant.',
        url: 'https://enhancv.com',
        domain: 'enhancv.com',
        tags: [],
      },
      {
        name: 'Overleaf',
        description: 'LaTeX resumes with zero watermarks — professional, recruiter-approved, and widely used in tech and academia.',
        url: 'https://overleaf.com/gallery/tagged/cv',
        domain: 'overleaf.com/gallery/tagged/cv',
        tags: [
          { label: 'Best for CS', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
          { label: '100% free', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
        ],
      },
      {
        name: 'FlowCV',
        description: 'Simple, fast, and ATS-friendly — a no-fuss resume builder that gets you a polished result quickly.',
        url: 'https://flowcv.com',
        domain: 'flowcv.com',
        tags: [{ label: 'Free', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' }],
      },
      {
        name: 'Reactive Resume',
        description: 'Fully free, open-source, and highly customizable — a developer favourite with no tracking or paywalls.',
        url: 'https://rxresu.me',
        domain: 'rxresu.me',
        tags: [
          { label: 'Open source', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
          { label: 'Free', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
        ],
      },
    ],
    proTip: {
      text: 'Start with Jobscan to scan your resume against a job description first. Then use any of the builders above to fix the gaps. Aim for a match score above 80% before applying.',
      linkLabel: 'Jobscan',
      linkUrl: 'https://jobscan.co',
    },
  },
  {
    id: 'ats-checkers',
    title: 'ATS Checkers & Optimizers',
    subtitle: 'Make sure your resume actually gets read by a human.',
    description: '4 tools to score, analyze and optimize your resume for applicant tracking systems.',
    dotColor: '#fbbf24',
    tools: [
      {
        name: 'Resume Worded',
        description: 'Get a detailed score and line-by-line feedback on your resume and LinkedIn profile instantly.',
        url: 'https://resumeworded.com',
        domain: 'resumeworded.com',
        tags: [{ label: 'AI feedback', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' }],
      },
      {
        name: 'SkillSyncer',
        description: 'Paste any job description and it shows you exactly which keywords your resume is missing.',
        url: 'https://skillsyncer.com',
        domain: 'skillsyncer.com',
        tags: [{ label: 'Free tier', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' }],
      },
      {
        name: 'TopResume Free Review',
        description: 'Get a free expert resume review with actionable feedback from a professional resume writer.',
        url: 'https://topresume.com/resume-review',
        domain: 'topresume.com',
        tags: [{ label: 'Human review', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' }],
      },
      {
        name: 'VMock',
        description: 'AI-driven resume feedback used by top universities — scores your resume across 100+ parameters.',
        url: 'https://vmock.com',
        domain: 'vmock.com',
        tags: [{ label: 'AI-powered', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' }],
      },
    ],
    proTip: {
      text: 'Run your resume through at least two ATS checkers before applying. Different tools catch different issues.',
    },
  },
  {
    id: 'writing-tips',
    title: 'Resume Writing Guides',
    subtitle: 'Learn what actually works — from bullet points to formatting.',
    description: '4 must-read guides covering Harvard standards, Google\'s XYZ formula and more.',
    dotColor: '#4ade80',
    tools: [
      {
        name: 'Harvard Resume Guide',
        description: "The gold standard for resume writing — Harvard OCS's comprehensive guide used by students worldwide.",
        url: 'https://ocs.fas.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf',
        domain: 'ocs.fas.harvard.edu',
        tags: [{ label: 'Free PDF', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' }],
      },
      {
        name: 'Levels.fyi Resume Tips',
        description: 'Resume advice specifically for software engineering roles at top tech companies.',
        url: 'https://levels.fyi/blog/resume-tips',
        domain: 'levels.fyi',
        tags: [{ label: 'Tech-focused', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' }],
      },
      {
        name: 'The XYZ Formula (Google)',
        description: 'Google\'s recommended bullet point formula — "Accomplished X, as measured by Y, by doing Z."',
        url: 'https://www.inc.com/bill-murphy-jr/google-recruiters-say-these-5-resume-tips-including-x-y-z-formula-will-improve-your-odds-of-getting-hired-at-google.html',
        domain: 'inc.com',
        tags: [{ label: 'Must read', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' }],
      },
      {
        name: 'r/cscareerquestions Resume Wiki',
        description: 'Community-driven resume advice from thousands of engineers who have been through the hiring process.',
        url: 'https://www.reddit.com/r/cscareerquestions/wiki/faq_resumes',
        domain: 'reddit.com',
        tags: [{ label: 'Community', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' }],
      },
    ],
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Optimization',
    subtitle: 'Your LinkedIn is your online resume — make it work for you.',
    description: '4 tools and guides to optimize your LinkedIn profile and attract recruiters.',
    dotColor: '#a78bfa',
    tools: [
      {
        name: 'LinkedIn Profile Checklist',
        description: 'Official LinkedIn guide to completing and optimizing every section of your profile for maximum visibility.',
        url: 'https://linkedin.com/help/linkedin/answer/a554687',
        domain: 'linkedin.com',
        tags: [{ label: 'Official', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' }],
      },
      {
        name: 'Resume Worded LinkedIn Review',
        description: 'Get an instant score and specific suggestions to improve your LinkedIn headline, summary and experience.',
        url: 'https://resumeworded.com/linkedin-review',
        domain: 'resumeworded.com',
        tags: [{ label: 'Free', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' }],
      },
      {
        name: 'Shield Analytics',
        description: 'Track your LinkedIn post performance and profile views to understand what content gets you noticed.',
        url: 'https://shieldapp.ai',
        domain: 'shieldapp.ai',
        tags: [{ label: 'Analytics', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' }],
      },
      {
        name: 'Taplio',
        description: 'AI-powered LinkedIn content creation tool to help you build a personal brand and attract recruiters.',
        url: 'https://taplio.com',
        domain: 'taplio.com',
        tags: [{ label: 'AI writing', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' }],
      },
    ],
    proTip: {
      text: 'Turn on "Open to Work" visibility for recruiters only — it signals availability without showing it publicly on your profile banner.',
    },
  },
];
