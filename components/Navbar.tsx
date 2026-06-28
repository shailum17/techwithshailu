'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const resourceLinks = [
  { href: '/resources/roadmaps',             label: 'Roadmaps',             sub: 'Step-by-step learning paths',           dotColor: '#a8e63d' },
  { href: '/resources/resume-hub',        label: 'Resume Hub',           sub: 'Templates, tips & ATS tricks',          dotColor: '#60a5fa' },
  { href: '/resources/interview-prep',    label: 'Interview Prep',       sub: 'Questions, patterns & mock rounds',      dotColor: '#fbbf24' },
  { href: '/resources/cheat-sheets',      label: 'Coding Cheat Sheets',  sub: 'Quick references for every stack',       dotColor: '#4ade80' },
  { href: '/resources/project-ideas',     label: 'Project Ideas',        sub: 'Build real projects for your portfolio', dotColor: '#a78bfa' },
  { href: '/resources/free-courses',      label: 'Free Courses',         sub: 'Hand-picked free learning resources',    dotColor: '#f472b6' },
  { href: '/resources/developer-tools',   label: 'Developer Tools',      sub: 'Tools that boost your productivity',     dotColor: '#fb923c' },
];

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/jobs',     label: 'Jobs / Internships' },
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/blog',     label: 'Blog' },
];

function ResourcesDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLLIElement>(null);
  const isActive = pathname.startsWith('/resources');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        {isActive && (
          <motion.span
            layoutId="navUnderline"
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-lime rounded-full"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72
                       rounded-2xl overflow-hidden z-50"
            style={{
              background: '#161616',
              border: '1px solid #2A2A2A',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {/* Arrow */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3
                            rotate-45"
                 style={{ background: '#161616', borderLeft: '1px solid #2A2A2A', borderTop: '1px solid #2A2A2A' }} />

            <div className="py-2">
              {resourceLinks.slice(0, 5).map(({ href, label, sub, dotColor }, i) => {
                const isItemActive = pathname === href;
                const isFirst = i === 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-start gap-3 px-4 py-2.5 transition-colors group ${
                      isFirst ? 'mb-1' : ''
                    }`}
                    style={{
                      background: isItemActive ? 'rgba(168,230,61,0.08)' : undefined,
                      borderBottom: isFirst ? '1px solid #2A2A2A' : undefined,
                    }}
                    onMouseEnter={e => { if (!isItemActive) (e.currentTarget as HTMLElement).style.background = '#1E1E1E'; }}
                    onMouseLeave={e => { if (!isItemActive) (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: dotColor }} />
                    <div>
                      <p className={`text-sm font-medium transition-colors ${
                        isItemActive ? 'text-lime' : 'text-ink group-hover:text-lime'
                      }`}>
                        {label}
                      </p>
                      <p className="text-xs text-ink-faint mt-0.5 leading-snug">{sub}</p>
                    </div>
                  </Link>
                );
              })}

              {/* See all */}
              <div style={{ borderTop: '1px solid #2A2A2A' }} className="mt-1 pt-1 px-4 pb-1">
                <Link
                  href="/resources"
                  className="flex items-center justify-between w-full py-2 text-xs font-medium text-ink-muted hover:text-lime transition-colors group"
                >
                  <span>See all resources</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      style={{
        background: scrolled ? 'rgba(10,10,10,0.96)' : 'rgba(10,10,10,0.80)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2A2A2A',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.5)' : 'none',
      }}
    >
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
          <ResourcesDropdown pathname={pathname} />
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/jobs"
            className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-sm
                       rounded-lg px-3 py-1.5 transition-colors"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3A3A3A'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'}
          >
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

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden px-4 pb-4"
            style={{ background: '#0F0F0F', borderBottom: '1px solid #2A2A2A' }}
          >
            <ul className="flex flex-col gap-1 pt-3">
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
                      className="overflow-hidden ml-3 mt-1 pl-3 space-y-0.5"
                      style={{ borderLeft: '2px solid #2A2A2A' }}
                    >
                      {resourceLinks.map(({ href, label }) => (
                        <li key={href}>
                          <Link href={href}
                            className={`block text-sm py-1.5 px-2 rounded-lg transition-colors ${
                              pathname === href
                                ? 'text-lime bg-lime-light font-medium'
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
