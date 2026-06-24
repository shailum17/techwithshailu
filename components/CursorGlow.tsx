'use client';

import { useEffect } from 'react';

/**
 * Tracks mouse position and exposes CSS variables --cx / --cy
 * used by globals.css body::before to paint the cursor glow.
 * Disabled on touch devices via CSS media query.
 */
export default function CursorGlow() {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cx', e.clientX + 'px');
      document.documentElement.style.setProperty('--cy', e.clientY + 'px');
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return null; // purely side-effect component
}
