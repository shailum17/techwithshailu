# techwithshailu

A full-stack web platform for **CS students & freshers in India**. Built with Next.js 15, Supabase (Postgres) & Tailwind CSS. Features curated tech job listings (with an automated fetch → review pipeline), an AI tools directory, study roadmaps & a blog. Dark-themed modern UI with glassmorphism design.

🌐 **Live Site:** [techwithshailu.in](https://techwithshailu.in) _(coming soon)_  
📱 **Telegram:** [@techwithshailu](https://t.me/techwithshailu)  
📸 **Instagram:** [@techwithshailu](https://instagram.com/techwithshailu)

---

## ✨ Features

- **Job/Internship Listings**: curated openings for CS students & freshers, filterable by type, location, batch year and full-text search
- **Automated job pipeline**: a daily Vercel Cron pulls listings from Unstop, Adzuna and RapidAPI JSearch into a review queue; the admin approves or rejects them, with a Telegram alert for new items
- **AI Tools Directory**: hand-picked AI tools across categories (Writing, Coding, Image, Productivity, Research)
- **Study Roadmaps & Resources**: roadmaps (Frontend, DSA, Backend, System Design, AI/ML…), resume hub, cheat sheets, interview prep, free courses, project ideas
- **Blog**: write in Markdown, upload the `.md` file, and it's converted to sanitized HTML
- **Admin Panel**: manage jobs, tools, roadmaps and blogs, review pending jobs, view automation logs
- **SEO**: metadata, Open Graph, sitemap, robots.txt

---

## 🛠 Tech Stack

| Layer          | Technology |
|----------------|------------|
| **Framework**  | Next.js 15 (App Router), React 19, TypeScript |
| **Styling**    | Tailwind CSS v3, Framer Motion, GSAP, anime.js |
| **Database**   | Supabase (Postgres + Row Level Security) via `@supabase/supabase-js` |
| **Content**    | `gray-matter` + `marked` + `sanitize-html` |
| **Media**      | Cloudinary (signed uploads), logo.dev |
| **Integrations** | Unstop, Adzuna, RapidAPI JSearch, Telegram Bot API |
| **Hosting**    | Vercel (serverless functions, Cron, Speed Insights) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (free tier is fine)
- Git

### 1. Clone and install

```bash
git clone https://github.com/shailum17/techwithshailu.git
cd techwithshailu
npm install
```

### 2. Set up the database

Run `supabase/schema.sql`, then the files in `supabase/migrations/` in order, in the Supabase SQL Editor.
See [`supabase/README.md`](supabase/README.md) for details.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in at least `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET` and `CRON_SECRET`. Every variable is described in
[`.env.example`](.env.example). `NEXT_PUBLIC_*` values are baked in at build time.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Checks and production build

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every pull request.

---

## 📁 Project Structure

```
techwithshailu/
├── app/
│   ├── page.tsx               # Homepage
│   ├── jobs/                  # Job listings & detail pages
│   ├── ai-tools/              # AI tools directory
│   ├── resources/             # Roadmaps, resume hub, cheat sheets, etc.
│   ├── blog/                  # Blog list & posts
│   ├── admin/                 # Admin panel shell; views in admin/_components/
│   ├── api/                   # Route handlers (public + /api/admin/* + /api/cron/*)
│   ├── layout.tsx, sitemap.ts, robots.ts
├── components/                # Shared React components
├── lib/
│   ├── supabase.ts            # anon client (RLS) + service-role client (API routes only)
│   ├── adminAuth.ts           # timing-safe x-admin-key check
│   ├── rateLimit.ts           # per-IP rate limiting
│   ├── sanitize.ts            # HTML sanitization (blogs, job descriptions)
│   ├── validate.ts            # URL / limit / field allow-list helpers
│   ├── roadmaps.ts            # roadmap data from Supabase
│   └── site.ts                # canonical SITE_URL
├── supabase/                  # schema, migrations, seeds (see supabase/README.md)
├── docs/CODEBASE_ISSUES.md    # known issues and their status
├── vercel.json                # Cron schedule for /api/cron/fetch-jobs
└── next.config.mjs            # security headers, redirects, image domains
```

---

## 🔐 Admin Panel

1. Go to `/admin`.
2. Enter the `ADMIN_SECRET` value. The server checks it and sets an 8-hour httpOnly, `SameSite=Strict` session cookie, so the key isn't kept in the page.
3. Manage jobs, pending jobs, tools, roadmaps and blogs. **Logout** ends *every* admin session (all browsers, and any copied cookie), not just this one.

Admin API routes accept either that session cookie or an `x-admin-key` header matching `ADMIN_SECRET`, which is useful for scripts.
Comparisons are constant-time. Failed attempts are rate-limited to 20 per minute per IP, and admin-key checks to 60 per minute per IP.
In production `ADMIN_SECRET` must be at least 32 characters, or admin login is refused.
Changing `ADMIN_SECRET` also signs out every session.
`/api/cron/fetch-jobs` also accepts `Authorization: Bearer <CRON_SECRET>`, which is what Vercel Cron sends.

---

## 🗄️ Database

Tables: `jobs`, `pending_jobs`, `tools`, `blogs`, `roadmaps`, `users`, `automation_logs`, `site_stats`.
The anon key can only read public rows (live jobs, published blogs, tools, roadmaps, site stats).
All writes go through API routes that use the service-role key. Full definitions are in `supabase/`.

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

1. Push your code to GitHub.
2. Connect the repo to [Vercel](https://vercel.com).
3. In the Vercel dashboard, add the environment variables from `.env.example`, with `NEXT_PUBLIC_APP_URL=https://techwithshailu.in`.
4. Deploy. The Cron job in `vercel.json` runs the job fetch daily at 07:00 UTC.

Vercel auto-deploys on every `git push` to the main branch.

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
- [ ] Analytics (Google Analytics / Vercel Analytics)

---

## 📚 Resources Referenced

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

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
