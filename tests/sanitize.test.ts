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

describe('known sanitize-html bypass classes (upgraded to 2.18.2)', () => {
  const payloads = [
    '<textarea/></textarea/><img src=x onerror=alert(1)>',
    '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript>',
    '<svg><animate attributeName="href" values="javascript:alert(1)"/></svg>',
    '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
    '<form action="javascript:alert(1)"><button formaction="javascript:alert(1)">x</button></form>',
    '<a href="jav&#x09;ascript:alert(1)">x</a>',
  ];

  it.each(payloads)('blog preset neutralises %s', payload => {
    const out = sanitizeBlogHtml(payload).toLowerCase();
    expect(out).not.toMatch(/<script|onerror|javascript:|<meta|<svg|<form|formaction/);
  });

  it.each(payloads)('job preset neutralises %s', payload => {
    const out = sanitizeJobHtml(payload).toLowerCase();
    expect(out).not.toMatch(/<script|onerror|javascript:|<meta|<svg|<form|formaction|<a /);
  });
});

describe('formatJobDescription input cap (#22)', () => {
  it('bounds work and output on oversized / hostile third-party text', async () => {
    const { MAX_RAW_DESCRIPTION_CHARS } = await import('@/lib/formatJobDescription');
    const hostile = '<script '.repeat(200_000);            // 1.6 MB, quadratic for the old code
    const t0 = performance.now();
    formatJobDescription(hostile);
    expect(performance.now() - t0).toBeLessThan(2_000);

    const huge = `<p>${'word '.repeat(100_000)}</p>`;
    expect(formatJobDescription(huge).length).toBeLessThan(MAX_RAW_DESCRIPTION_CHARS * 2);
  });

  it('leaves normal-sized descriptions untouched by the cap', () => {
    const normal = 'Build features.\n• React\n• Node';
    expect(formatJobDescription(normal)).toBe(formatJobDescription(normal.slice(0)));
    expect(formatJobDescription(normal)).toContain('<li>Node</li>');
  });
});
