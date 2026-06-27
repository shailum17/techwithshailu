'use client';

import Link from 'next/link';

const roadmapLinks = [
  { href: '/resources/frontend',      label: 'Frontend Roadmap' },
  { href: '/resources/dsa',           label: 'DSA Path' },
  { href: '/resources/backend',       label: 'Backend Roadmap' },
  { href: '/resources/system-design', label: 'System Design' },
  { href: '/resources/aiml',          label: 'AI / ML Basics' },
  { href: '/resources/devops',        label: 'DevOps Roadmap' },
];

const platformLinks = [
  { href: '/jobs',      label: 'Job Listings' },
  { href: '/ai-tools',  label: 'AI Tools Directory' },
  { href: '/blog',      label: 'Blog & Articles' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/techwithshailu',
    hoverColor: 'hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-400/10',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/techwithshailu',
    hoverColor: 'hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-400/10',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>,
  },
  {
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/KnzRYRlTS5jA86Ozo71vlr',
    hoverColor: 'hover:text-green-400 hover:border-green-400/40 hover:bg-green-400/10',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  {
    label: 'Threads',
    href: 'https://www.threads.com/@techwithshailu',
    hoverColor: 'hover:text-white hover:border-white/30 hover:bg-white/10',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.012 5.467l-2.898.184c-.27-3.574-2.704-5.271-6.94-5.27-2.66.019-4.746.801-6.204 2.327C4.568 6.34 3.851 8.598 3.829 11.99c.022 3.394.739 5.655 2.162 7.185 1.458 1.528 3.545 2.312 6.206 2.33 2.126-.016 3.687-.548 4.949-1.676 1.365-1.216 2.037-3.054 2.099-5.752h-7.013v-2.848h9.924v.005c.013.396.019.794.019 1.196-.069 3.557-.977 6.198-2.797 7.85C17.7 22.916 15.342 23.99 12.186 24z"/></svg>,
  },
  {
    label: 'Pinterest',
    href: 'https://tr.ee/3ba9i33cCK',
    hoverColor: 'hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/10',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>,
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0D', borderTop: '1px solid #2A2A2A' }} className="mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/"
              className="font-poppins font-bold text-xl text-lime hover:text-lime-bright
                         transition-colors inline-block mb-3">
              techwithshailu
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              One-stop platform for CS students and freshers in India. Curated jobs,
              AI tools and study roadmaps — all in simple language.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon, hoverColor }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                   aria-label={label}
                   className={`w-9 h-9 rounded-xl flex items-center justify-center text-ink-faint
                               border transition-all duration-200 ${hoverColor}`}
                   style={{ background: '#1A1A1A', borderColor: '#2A2A2A' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Platform */}
          <div>
            <p className="font-poppins font-semibold text-ink text-sm mb-4">Platform</p>
            <ul className="space-y-2.5">
              {platformLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-ink-muted hover:text-lime transition-colors
                               flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-surface-border
                                     group-hover:bg-lime transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Roadmaps */}
          <div>
            <p className="font-poppins font-semibold text-ink text-sm mb-4">Roadmaps</p>
            <ul className="space-y-2.5">
              {roadmapLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-ink-muted hover:text-lime transition-colors
                               flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-surface-border
                                     group-hover:bg-lime transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <p className="font-poppins font-semibold text-ink text-sm mb-2">Newsletter</p>
            <p className="text-ink-muted text-sm mb-4 leading-snug">
              Weekly job updates and AI tool drops in your inbox.
            </p>
            <form onSubmit={e => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-ink placeholder-ink-faint
                           focus:outline-none transition-colors"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,230,61,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2A2A2A')}
              />
              <button
                type="submit"
                className="w-full font-semibold text-sm py-2.5 rounded-xl transition-colors"
                style={{ background: '#A8E63D', color: '#000' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#BFFF4F'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#A8E63D'}
              >
                Subscribe
              </button>
            </form>

            {/* Community buttons */}
            <div className="flex gap-2 mt-4">
              <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
                 className="flex-1 text-center text-xs font-medium py-2 rounded-lg
                            text-blue-400 hover:bg-blue-400/10 transition-colors"
                 style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
                Telegram
              </a>
              <a href="https://chat.whatsapp.com/KnzRYRlTS5jA86Ozo71vlr" target="_blank" rel="noopener noreferrer"
                 className="flex-1 text-center text-xs font-medium py-2 rounded-lg
                            text-green-400 hover:bg-green-400/10 transition-colors"
                 style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
             style={{ borderTop: '1px solid #2A2A2A' }}>
          <p className="text-ink-faint text-sm">
            © {new Date().getFullYear()} techwithshailu. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-ink-faint">
            <a href="https://techwithshailu.in" className="hover:text-lime transition-colors">
              techwithshailu.in
            </a>
            <span>·</span>
            <span>Built for CS students in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
