'use client';

import { useEffect } from 'react';
import type { NodeResources } from '@/app/resources/roadmaps/[category]/resources-data';

const YT_RED = '#FF4444';
const WEB_BLUE = '#60A5FA';

interface Props {
  data: NodeResources | null;
  onClose: () => void;
}

export default function ResourceDrawer({ data, onClose }: Props) {
  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: data ? 1 : 0,
          pointerEvents: data ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={data?.title ?? 'Resources'}
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(420px, 92vw)',
          zIndex: 50,
          background: '#111',
          borderLeft: '1px solid #222',
          display: 'flex',
          flexDirection: 'column',
          transform: data ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        {data && (
          <>
            {/* Header */}
            <div style={{
              padding: '20px 20px 14px',
              borderBottom: '1px solid #1f2937',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
              position: 'sticky', top: 0, background: '#111', zIndex: 1,
            }}>
              <div>
                <p style={{ fontSize: 10, color: '#A8E63D', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Free Resources
                </p>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0 }}>{data.title}</h2>
              </div>
              <button
                onClick={onClose}
                style={{ flexShrink: 0, marginTop: 2, background: '#1a1a1a', border: '1px solid #2A2A2A', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}
                aria-label="Close resources"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 20px 32px', flex: 1 }}>

              {/* YouTube */}
              {data.yt.length > 0 && (
                <section style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <svg width="18" height="13" viewBox="0 0 18 13" fill="none" aria-hidden>
                      <rect width="18" height="13" rx="3" fill={YT_RED}/>
                      <path d="M7 4l5 2.5L7 9V4z" fill="#fff"/>
                    </svg>
                    <span style={{ fontSize: 11, fontWeight: 700, color: YT_RED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>YouTube</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {data.yt.map((l, i) => (
                      <li key={i}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 8,
                            padding: '8px 10px', borderRadius: 7,
                            background: '#1a1a1a', border: '1px solid #222',
                            color: '#ccc', fontSize: 12.5, lineHeight: 1.4,
                            textDecoration: 'none',
                            transition: 'border-color 0.15s, color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = YT_RED + '66'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#222'; (e.currentTarget as HTMLAnchorElement).style.color = '#ccc'; }}
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                            <path d="M6.5 1L12 6.5M12 6.5L6.5 12M12 6.5H1" stroke={YT_RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Text / Web */}
              {data.web.length > 0 && (
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="7" stroke={WEB_BLUE} strokeWidth="1.5"/>
                      <path d="M8 1c-2 2-3 4.3-3 7s1 5 3 7M8 1c2 2 3 4.3 3 7s-1 5-3 7M1 8h14" stroke={WEB_BLUE} strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: 11, fontWeight: 700, color: WEB_BLUE, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Text / Website</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {data.web.map((l, i) => (
                      <li key={i}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 8,
                            padding: '8px 10px', borderRadius: 7,
                            background: '#1a1a1a', border: '1px solid #222',
                            color: '#ccc', fontSize: 12.5, lineHeight: 1.4,
                            textDecoration: 'none',
                            transition: 'border-color 0.15s, color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = WEB_BLUE + '66'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#222'; (e.currentTarget as HTMLAnchorElement).style.color = '#ccc'; }}
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                            <path d="M6.5 1L12 6.5M12 6.5L6.5 12M12 6.5H1" stroke={WEB_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {data.yt.length === 0 && data.web.length === 0 && (
                <p style={{ color: '#444', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No resources listed yet.</p>
              )}

              {/* Footer note */}
              <p style={{ marginTop: 32, fontSize: 10, color: '#333', lineHeight: 1.5 }}>
                All resources listed are free. Curated for @techwithshailu · July 2026
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
