'use client';

/* Shared types, styles and small UI pieces for the admin panel. */

/* ── types ──────────────────────────────────────────────────── */
export type View = 'dashboard' | 'jobs' | 'pending' | 'automation' | 'tools' | 'roadmaps' | 'blog' |
            'analytics' | 'users' | 'reports' | 'notifications' | 'settings' | 'security' | 'database';

export interface Job {
  id: string; title: string; company: string; location: string;
  type: string; salary: string; deadline: string;
  is_featured: boolean; status?: string; logo_url?: string; banner_url?: string;
}
export interface Tool {
  id: string; name: string; category: string; url: string;
  is_free: boolean; is_featured: boolean; icon_url?: string;
}
export interface AdminBlogPost {
  id: string; slug: string; title: string; excerpt: string;
  category: string; content: string; published: boolean;
  published_at: string | null; read_time: string;
  cover_url?: string; tags?: string[];
}

/* ── shared input style — matches site inputs ───────────────── */
export const IS: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '10px 13px',
  color: '#F0F0F0',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'var(--font-outfit)',
};

/* ── dashboard data — replaced with empty state (real data comes from DB) ── */


export function statusBadge(s = '') {
  if (s === 'Live')    return { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)'  };
  if (s === 'Draft')   return { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)'  };
  if (s === 'Expired') return { bg: 'rgba(248,113,113,0.12)',color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' };
  return { bg: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' };
}

/* ── reusable pieces ────────────────────────────────────────── */
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}
    style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
    {children}
  </div>
);

export const Flash: React.FC<{ msg: string }> = ({ msg }) => msg ? (
  <div style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.25)',
                color: '#A8E63D', borderRadius: 10, padding: '10px 13px', fontSize: 12, marginBottom: 14 }}>
    {msg}
  </div>
) : null;

export function Thumb({ src, fallback, color = '#A8E63D' }: { src?: string; fallback: string; color?: string }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                   border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0,
                   display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }}
               onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        : <span style={{ color, fontSize: 11, fontWeight: 700 }}>{fallback}</span>
      }
    </div>
  );
}
