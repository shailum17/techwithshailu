'use client';

import { useEffect } from 'react';

/**
 * VisitorPing — mounts once per session and increments the visitor count.
 * Uses sessionStorage so refreshing the same tab does NOT re-count,
 * but opening a new tab / new browser session DOES count.
 * Renders nothing visible.
 */
export default function VisitorPing() {
  useEffect(() => {
    const SESSION_KEY = 'tws_visited';
    if (sessionStorage.getItem(SESSION_KEY)) return; // already counted this session

    sessionStorage.setItem(SESSION_KEY, '1');

    fetch('/api/visitors', { method: 'POST' }).catch(() => {
      // silent — never break the page if the counter fails
    });
  }, []);

  return null;
}
