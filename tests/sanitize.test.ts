import { describe, it, expect } from 'vitest';
import { sanitizeBlogHtml, sanitizeJobHtml } from '@/lib/sanitize';
import { formatJobDescription } from '@/lib/formatJobDescription';

describe('sanitizeBlogHtml', () => {
  it('strips scripts, event handlers and javascript: links', () => {
    const out = sanitizeBlogHtml(
      '<p onclick="x()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a>',
    );
    expect(out).not.toMatch(/script|onclick|javascript:/i);
    expect(out).toContain('<p>Hi</p>');
  });

  it('opens external links safely', () => {
    const out = sanitizeBlogHtml('<a href="https://example.com">x</a>');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it('keeps images with https src', () => {
    expect(sanitizeBlogHtml('<img src="https://x.com/a.png" alt="a">')).toContain('<img');
  });
});

describe('sanitizeJobHtml', () => {
  it('drops links, images and iframes from third-party descriptions', () => {
    const out = sanitizeJobHtml(
      '<p>Role</p><a href="https://x.com">link</a><img src="https://x.com/i.png"><iframe src="https://x.com"></iframe>',
    );
    expect(out).not.toMatch(/<a |<img|<iframe/i);
    expect(out).toContain('<p>Role</p>');
  });
});

describe('formatJobDescription', () => {
  it('returns a placeholder for empty input', () => {
    expect(formatJobDescription('')).toContain('No description available');
  });

  it('never outputs script tags or inline handlers', () => {
    const out = formatJobDescription(
      'RESPONSIBILITIES\n• Build things\n<script>alert(1)</script><b onmouseover="x()">Bold</b>',
    );
    expect(out).not.toMatch(/<script|onmouseover/i);
  });
});
