'use client';

/* Login form (exchanges the admin key for a session cookie). */

import { useState } from 'react';
import { IS } from './shared';

/* ═══════════════════════════════════════════════════════════════
   LOGIN — matches site card style
   ═══════════════════════════════════════════════════════════════ */
export function LoginScreen({ onAuth }: { onAuth: (k: string) => Promise<string | null> }) {
  const [key, setKey]           = useState('');
  const [error, setError]       = useState('');
  const [checking, setChecking] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center pt-16"
         style={{ background: '#080808' }}>
      {/* ambient glow — same as hero */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(168,230,61,0.06),transparent 70%)',
        }}/>
      </div>

      <div className="w-full max-w-sm mx-4"
           style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20, padding: '40px 36px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="font-poppins font-bold text-lg text-lime">techwithshailu</span>
          <span style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.25)',
                          color: '#A8E63D', fontSize: 10, padding: '2px 8px', borderRadius: 20,
                          fontWeight: 700, letterSpacing: '0.06em' }}>
            ADMIN
          </span>
        </div>
        <h2 className="font-poppins font-bold text-white mb-1.5" style={{ fontSize: 22 }}>
          Welcome back
        </h2>
        <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Enter your admin key to access the dashboard.
        </p>
        <form onSubmit={async e => {
          e.preventDefault();
          setChecking(true); setError('');
          const err = await onAuth(key);
          if (err) { setError(err); setChecking(false); }
        }}>
          <input type="password" placeholder="Admin secret key" value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            style={{ ...IS, marginBottom: 12 }} required />
          {error && (
            <p role="alert" style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>{error}</p>
          )}
          <button type="submit" className="btn-lime w-full py-3 text-sm" disabled={checking}>
            {checking ? 'Checking…' : 'Access Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
