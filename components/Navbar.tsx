'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/jobs',      label: 'Jobs' },
  { href: '/ai-tools',  label: 'AI Tools' },
  { href: '/resources', label: 'Roadmaps' },
  { href: '/blog',      label: 'Blog' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled,  setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

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

      {/* Mobile menu */}
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
