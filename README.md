# techwithshailu

A full-stack web platform for **CS students & freshers in India**. Built with Next.js 15, MongoDB Atlas & Tailwind CSS. Features curated tech job listings, AI tools directory, study roadmaps & a blog. Dark-themed modern UI with glassmorphism design.

🌐 **Live Site:** [techwithshailu.in](https://techwithshailu.in) _(coming soon)_  
📱 **Telegram:** [@techwithshailu](https://t.me/techwithshailu)  
📸 **Instagram:** [@techwithshailu](https://instagram.com/techwithshailu)

---

## ✨ Features

- **Job/Internship Listings** — Curated openings for CS students & freshers, filterable by location, type, batch year
- **AI Tools Directory** — Hand-picked AI tools across categories (Writing, Coding, Image, Productivity, Research)
- **Study Roadmaps** — Step-by-step paths for Frontend, DSA, Backend, System Design & AI/ML
- **Blog** — Tech articles, interview tips & placement guides in simple language
- **Admin Panel** — Password-protected panel to add/edit jobs and tools
- **SEO Optimized** — Meta tags, sitemap, robots.txt, Open Graph ready

---

## 🛠 Tech Stack

| Layer          | Technology           |
|----------------|----------------------|
| **Frontend**   | Next.js 15 (React 19), TypeScript |
| **Styling**    | Tailwind CSS v3 |
| **Database**   | MongoDB Atlas (M0 Free Tier) |
| **ODM**        | Mongoose |
| **Hosting**    | Vercel (free tier) |
| **Domain**     | Namecheap / GoDaddy |

**Cost:** ~₹800–1500/year (domain only; hosting + DB free)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free M0 cluster)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/shailum17/techwithshailu.git
cd techwithshailu
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas connection string from https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/techwithshailu?retryWrites=true&w=majority

# Admin secret key for protecting POST/PUT/DELETE API routes
ADMIN_SECRET=your_strong_random_secret_here

# App URL for SEO/OG tags
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
techwithshailu/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage
│   ├── jobs/                # Job listings & detail pages
│   ├── ai-tools/            # AI Tools directory
│   ├── resources/           # Study roadmaps
│   ├── blog/                # Blog articles
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes (jobs, tools)
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Tailwind CSS
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── components/              # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   ├── ToolCard.tsx
│   ├── JobFilters.tsx
│   └── CategoryTabs.tsx
├── models/                  # Mongoose models
│   ├── Job.ts
│   └── Tool.ts
├── lib/
│   ├── mongodb.ts           # MongoDB connection helper
│   └── adminAuth.ts         # Admin middleware
├── public/                  # Static assets
├── .env.local               # Environment variables (DO NOT COMMIT)
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json
```

---

## 🔐 Admin Panel

The admin panel is protected by a secret key. To access:

1. Navigate to `/admin`
2. Enter the `ADMIN_SECRET` value from your `.env.local` file
3. Add, edit or delete jobs and AI tools

API routes (`POST`, `PUT`, `DELETE`) require the `x-admin-key` header matching `ADMIN_SECRET`.

---

## 🗄️ Database Schema

### Jobs Collection

```ts
{
  title: string;        // "Software Engineer"
  company: string;      // "Goldman Sachs"
  location: string;     // "Bengaluru" or "Remote"
  type: 'Job' | 'Internship' | 'Full-time';
  batch_year?: number;  // 2026
  salary?: string;      // "₹18–24 LPA"
  apply_link: string;   // External URL
  deadline?: Date;
  description: string;  // HTML content
  is_featured: boolean; // Show on homepage
  tags: string[];       // ["React", "Node", "AWS"]
  createdAt: Date;
  updatedAt: Date;
}
```

### Tools Collection

```ts
{
  name: string;         // "ChatGPT"
  description: string;  // One-line summary
  category: 'Writing' | 'Image' | 'Coding' | 'Productivity' | 'Research';
  url: string;          // External link
  icon_url?: string;    // Optional icon URL
  is_free: boolean;
  is_featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎨 Design System

| Element             | Value                        |
|---------------------|------------------------------|
| **Primary Color**   | Lime Green `#A8E63D` / `#BFFF00` |
| **Accent Color**    | Purple `#6A4CC3` |
| **Background**      | Dark Navy `#0D0D0D` / `#111111` |
| **Card Background** | `#111827` |
| **Primary Font**    | Poppins (headings) |
| **Secondary Font**  | Outfit (body) |
| **Design Style**    | Glassmorphism + Dark Theme |

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel Dashboard:
   - `MONGODB_URI`
   - `ADMIN_SECRET`
   - `NEXT_PUBLIC_APP_URL=https://techwithshailu.in`
4. Deploy!

Vercel auto-deploys on every `git push` to main branch.

---

## 🌍 Custom Domain Setup

1. Buy domain from Namecheap / GoDaddy (~₹800/year)
2. In Vercel Dashboard → Project → Settings → Domains → Add `techwithshailu.in`
3. Update DNS records in domain registrar (Vercel provides exact values)
4. Wait 24–48 hours for DNS propagation

---

## 📈 SEO Setup

- [x] Metadata (title, description, keywords) in every page
- [x] Open Graph & Twitter Card tags
- [x] Sitemap at `/sitemap.xml`
- [x] Robots.txt at `/robots.txt`
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Add structured data (JSON-LD) for job postings (optional)

---

## 🎯 Roadmap (Post-Launch)

- [ ] User authentication (Google OAuth)
- [ ] Job application tracking
- [ ] Company dashboard for posting jobs
- [ ] Newsletter signup integration (Mailchimp / Resend)
- [ ] Search with Algolia / MeiliSearch
- [ ] Automated job scraping from LinkedIn / Unstop
- [ ] Analytics (Google Analytics / Vercel Analytics)

---

## 📚 Resources Referenced

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs via [Issues](https://github.com/shailum17/techwithshailu/issues)
- Submit feature requests
- Open Pull Requests for improvements

---

## 📝 License

[ISC License](LICENSE) — free to use, modify and distribute.

---

## 📧 Contact

**Built by:** techwithshailu  
**Instagram:** [@techwithshailu](https://instagram.com/techwithshailu)  
**Telegram:** [@techwithshailu](https://t.me/techwithshailu)  
**GitHub:** [shailum17](https://github.com/shailum17)

---

<p align="center">Made with ❤️ for CS students in India</p>
