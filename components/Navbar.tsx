'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Resource dropdown items ────────────────────────────────── */
const resourceLinks = [
  { href: '/resources',                label: 'All Roadmaps',      sub: 'View every learning path',          color: 'text-lime' },
  { href: '/resources/frontend',       label: 'Frontend Roadmap',  sub: 'HTML → CSS → React → Next.js',      color: 'text-blue-600' },
  { href: '/resources/dsa',            label: 'DSA Path',          sub: 'Arrays to DP — crack placements',    color: 'text-amber-600' },
  { href: '/resources/backend',        label: 'Backend Roadmap',   sub: 'Node.js → APIs → MongoDB → Cloud',   color: 'text-green-600' },
  { href: '/resources/system-design',  label: 'System Design',     sub: 'Design scalable systems',            color: 'text-purple-brand' },
  { href: '/resources/aiml',           label: 'AI / ML Basics',    sub: 'Python → Scikit-learn → Deploy',     color: 'text-lime' },
  { href: '/resources/devops',         label: 'DevOps Roadmap',    sub: 'Linux → Docker → Kubernetes',        color: 'text-orange-500' },
];

/* ── Top-level nav links ────────────────────────────────────── */
const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/jobs',     label: 'Jobs' },
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/blog',     label: 'Blog' },
];

/* ── Dropdown component ─────────────────────────────────────── */
function ResourcesDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLLIElement>(null);
  const isActive = pathname.startsWith('/resources');

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <li ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm font-medium pb-1 transition-colors ${
          isActive ? 'text-lime' : 'text-ink-muted hover:text-ink'
        }`}
      >
        Resources
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>

        {/* Active underline */}
        {isActive && (
          <motion.span
            layoutId="navUnderline"
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-lime rounded-full"
          />
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72
                       bg-white border border-surface-border rounded-2xl shadow-card-hover
                       overflow-hidden z-50"
          >
            {/* Arrow */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3
                            bg-white border-l border-t border-surface-border rotate-45" />

            <div className="py-2">
              {resourceLinks.map(({ href, label, sub, color }, i) => {
                const isItemActive = pathname === href;
                const isFirst = i === 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-start gap-3 px-4 py-2.5 transition-colors group
                                ${isItemActive ? 'bg-lime-light' : 'hover:bg-surface-hover'}
                                ${isFirst ? 'border-b border-surface-border mb-1' : ''}`}
                  >
                    {/* Colour dot */}
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      isItemActive ? 'bg-lime' : `${color.replace('text-', 'bg-')} opacity-70`
                    }`} />
                    <div>
                      <p className={`text-sm font-medium transition-colors ${
                        isItemActive ? 'text-lime' : `group-hover:${color} text-ink`
                      }`}>
                        {label}
                      </p>
                      <p className="text-xs text-ink-faint mt-0.5 leading-snug">{sub}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ── Main Navbar ────────────────────────────────────────────── */
export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setMobileResourcesOpen(false); }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-surface-border shadow-card py-3'
        : 'bg-white/80 backdrop-blur-sm border-b border-surface-border py-4'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/"
          className="font-poppins font-bold text-xl text-lime hover:text-lime-bright transition-colors">
          techwithshailu
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <li key={href} className="relative">
                <Link href={href}
                  className={`text-sm font-medium pb-1 transition-colors ${
                    isActive ? 'text-lime' : 'text-ink-muted hover:text-ink'
                  }`}>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-lime rounded-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}

          {/* Resources dropdown */}
          <ResourcesDropdown pathname={pathname} />
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/jobs"
            className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-sm
                       bg-surface-tertiary border border-surface-border rounded-lg px-3 py-1.5
                       transition-colors hover:border-ink-faint">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <span>Search</span>
          </Link>
          <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
             className="btn-purple text-sm py-2 px-4">
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-ink-muted hover:text-ink"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen
            ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
          }
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-white border-b border-surface-border px-4 pb-4"
          >
            <ul className="flex flex-col gap-1 pt-3">

              {/* Regular links */}
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className={`block text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                      pathname === href
                        ? 'text-lime bg-lime-light'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                    }`}>
                    {label}
                  </Link>
                </li>
              ))}

              {/* Mobile Resources accordion */}
              <li>
                <button
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  className={`w-full flex items-center justify-between text-sm font-medium
                              py-2 px-3 rounded-lg transition-colors ${
                    pathname.startsWith('/resources')
                      ? 'text-lime bg-lime-light'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                  }`}
                >
                  <span>Resources</span>
                  <motion.svg
                    animate={{ rotate: mobileResourcesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {mobileResourcesOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden ml-3 mt-1 border-l-2 border-surface-border pl-3 space-y-0.5"
                    >
                      {resourceLinks.map(({ href, label, color }) => (
                        <li key={href}>
                          <Link href={href}
                            className={`block text-sm py-1.5 px-2 rounded-lg transition-colors ${
                              pathname === href
                                ? `${color} bg-lime-light font-medium`
                                : 'text-ink-muted hover:text-ink hover:bg-surface-hover'
                            }`}>
                            {label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li className="pt-2">
                <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
                   className="block text-center btn-purple text-sm py-2.5">
                  Get Started
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
