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
      className="flex items-center gap-2 text-xs bg-surface-tertiary border border-surface-border
                 text-ink-muted hover:text-ink hover:border-ink-faint px-3 py-2 rounded-lg
                 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}
