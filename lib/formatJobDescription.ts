/**
 * lib/formatJobDescription.ts
 *
 * Converts raw HTML job descriptions (from RapidAPI / JSearch) into
 * clean, well-structured HTML that looks great with Tailwind prose.
 *
 * Pipeline:
 *  1. Strip inline styles, script/style tags, excessive attributes
 *  2. Normalize whitespace and <br> abuse
 *  3. Detect section headings (ALL CAPS lines, bold lines, known keywords)
 *     and promote them to <h2>
 *  4. Convert plain-text bullet patterns (•, -, *, digits.) to <ul>/<li>
 *  5. Wrap orphan text blocks in <p>
 *  6. Re-order into standard sections: About / Role / Responsibilities /
 *     Requirements / Nice-to-have / Interview Process / Benefits
 *  7. Final pass: sanitize with sanitizeJobHtml to strip any residual
 *     XSS vectors (event handlers, javascript: URLs, iframes, etc.)
 */

import { sanitizeJobHtml } from '@/lib/sanitize';

// Known section heading keywords → canonical label
const SECTION_MAP: [RegExp, string][] = [
  [/about (the )?(company|role|us|job|position|opportunity)/i,  'About the Company'],
  [/company (overview|description|background)/i,               'About the Company'],
  [/job (description|summary|overview|details)/i,              'Role Overview'],
  [/role (overview|summary|description)/i,                     'Role Overview'],
  [/position (overview|summary)/i,                             'Role Overview'],
  [/what you('ll| will) do/i,                                  'Responsibilities'],
  [/key responsibilities/i,                                     'Responsibilities'],
  [/responsibilities/i,                                         'Responsibilities'],
  [/duties/i,                                                   'Responsibilities'],
  [/what we('re| are) looking for/i,                           'Requirements'],
  [/requirements?/i,                                            'Requirements'],
  [/qualifications?/i,                                          'Requirements'],
  [/must.have/i,                                                'Requirements'],
  [/basic qualifications?/i,                                    'Requirements'],
  [/preferred (qualifications?|skills?)/i,                      'Nice to Have'],
  [/nice.to.have/i,                                             'Nice to Have'],
  [/good.to.have/i,                                             'Nice to Have'],
  [/bonus (points?|skills?)/i,                                  'Nice to Have'],
  [/interview (process|rounds?|stages?)/i,                      'Interview Process'],
  [/selection process/i,                                        'Interview Process'],
  [/hiring process/i,                                           'Interview Process'],
  [/benefits?/i,                                                'Benefits'],
  [/perks?/i,                                                   'Benefits'],
  [/what we offer/i,                                            'Benefits'],
  [/compensation/i,                                             'Benefits'],
];

const DESIRED_ORDER = [
  'About the Company',
  'Role Overview',
  'Responsibilities',
  'Requirements',
  'Nice to Have',
  'Interview Process',
  'Benefits',
];

interface Section {
  heading: string;
  items:   string[];   // list items
  paras:   string[];   // paragraph texts
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeHeading(text: string): string {
  const clean = stripTags(text).trim().replace(/[:*]+$/, '').trim();
  for (const [pattern, label] of SECTION_MAP) {
    if (pattern.test(clean)) return label;
  }
  // ALL CAPS line that's short → treat as heading
  if (clean === clean.toUpperCase() && clean.length > 3 && clean.length < 80) {
    return clean.charAt(0) + clean.slice(1).toLowerCase();
  }
  return '';
}

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', bull: '•', hellip: '…', rupee: '₹',
};

/** Decodes HTML entities in one pass (so "&amp;lt;" becomes "&lt;", not "<"). */
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? m;
  });
}

/** Escapes text for safe insertion into HTML. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isBulletLine(text: string): boolean {
  return /^(\s*[•·▪▸\-–—*]|\s*\d+[.)]\s)/.test(text);
}

function cleanBullet(text: string): string {
  return text.replace(/^[\s•·▪▸\-–—*]+/, '').replace(/^\d+[.)]\s*/, '').trim();
}

/**
 * Longest raw description processed (characters). Real listings are a few
 * thousand characters; the cap bounds storage and the regex passes below,
 * some of which are quadratic on hostile input (e.g. many unclosed <script).
 */
export const MAX_RAW_DESCRIPTION_CHARS = 20_000;

export function formatJobDescription(raw: string): string {
  if (!raw || !raw.trim()) return '<p>No description available.</p>';
  if (raw.length > MAX_RAW_DESCRIPTION_CHARS) raw = raw.slice(0, MAX_RAW_DESCRIPTION_CHARS);

  // ── 1. Remove script/style/noscript entirely ──────────────
  let html = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  // ── 2. Strip inline styles & class attrs ──────────────────
  html = html
    .replace(/\s+style="[^"]*"/gi, '')
    .replace(/\s+class="[^"]*"/gi, '')
    .replace(/\s+id="[^"]*"/gi, '');

  // ── 3. Normalise <br> abuse → newlines ────────────────────
  html = html.replace(/<br\s*\/?>/gi, '\n');

  // ── 3b. List items → bullet lines, so they survive as <li> ─
  html = html.replace(/<li\b[^>]*>/gi, '\n• ');

  // ── 4. Split into lines by block-level tags ───────────────
  // Insert newline before/after block elements
  html = html
    .replace(/<\/(p|div|li|h[1-6]|section|article|header|footer|blockquote)>/gi, '\n')
    .replace(/<(p|div|h[1-6]|section|article|header|footer|blockquote)[^>]*>/gi, '\n');

  // ── 5. Flatten to plain lines ─────────────────────────────
  const lines = html
    .split('\n')
    // Tags are removed first, then entities decoded: the result is plain text
    // (escaped again when rendered), so decoded "<" can never become markup.
    .map(l => decodeEntities(l.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
    .filter(l => l.length > 1 && l !== '•');

  // ── 6. Parse into sections ────────────────────────────────
  const sections: Section[] = [];
  let current: Section = { heading: '', items: [], paras: [] };

  for (const line of lines) {
    // Bullets are list items, never headings (an item like "• SQL" is all caps)
    if (isBulletLine(line)) {
      const item = cleanBullet(line);
      if (item) current.items.push(item);
      continue;
    }

    const heading = normalizeHeading(line);

    if (heading && line.length < 120) {
      // Save current section if it has content
      if (current.items.length || current.paras.length || current.heading) {
        sections.push(current);
      }
      current = { heading, items: [], paras: [] };
    } else if (line.length > 10) {
      // Could be a run-on "bullet" line separated by commas or semicolons
      // but only if it's inside a known list section
      const isListSection = /responsibilities|requirements|qualifications|process|duties/i.test(current.heading);
      if (isListSection && /[;,]/.test(line) && !line.endsWith('.') && line.length < 200) {
        const parts = line.split(/[;,]/).map(p => p.trim()).filter(p => p.length > 3);
        if (parts.length >= 2) {
          current.items.push(...parts);
          continue;
        }
      }
      current.paras.push(line);
    } else {
      // Short lines ("Pune", "B.Tech") are content too — keep them
      current.paras.push(line);
    }
  }
  // Push last section
  if (current.items.length || current.paras.length || current.heading) {
    sections.push(current);
  }

  // ── 7. If no sections detected, just wrap everything ──────
  if (sections.length === 0) {
    return `<p>${lines.map(escapeHtml).join('</p><p>')}</p>`;
  }

  // ── 8. Reorder into desired section order ─────────────────
  const ordered: Section[] = [];
  const usedIdxs = new Set<number>();

  // Text before the first heading is the intro: keep it at the top
  if (!sections[0].heading) { ordered.push(sections[0]); usedIdxs.add(0); }

  for (const desiredHeading of DESIRED_ORDER) {
    const idx = sections.findIndex((s, i) => !usedIdxs.has(i) && s.heading === desiredHeading);
    if (idx !== -1) { ordered.push(sections[idx]); usedIdxs.add(idx); }
  }
  // Append any remaining sections not in the desired order
  sections.forEach((s, i) => { if (!usedIdxs.has(i)) ordered.push(s); });

  // ── 9. Render to HTML ──────────────────────────────────────
  const parts: string[] = [];

  for (const section of ordered) {
    if (section.heading) {
      parts.push(`<h2>${escapeHtml(section.heading)}</h2>`);
    }
    for (const para of section.paras) {
      parts.push(`<p>${escapeHtml(para)}</p>`);
    }
    if (section.items.length) {
      const lis = section.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
      parts.push(`<ul>${lis}</ul>`);
    }
  }

  return sanitizeJobHtml(parts.join('\n') || `<p>${lines.map(escapeHtml).join('</p><p>')}</p>`);
}
