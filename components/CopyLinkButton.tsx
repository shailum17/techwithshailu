'use client';

import { useState } from 'react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-xs text-ink-muted hover:text-lime px-3 py-2 rounded-lg
                 transition-colors"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      {copied ? '✓ Copied!' : 'Copy Link'}
    </button>
  );
}
