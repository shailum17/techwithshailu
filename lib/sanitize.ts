/**
 * lib/sanitize.ts
 *
 * Server-side HTML sanitization using sanitize-html.
 *
 * Two presets:
 *
 *  sanitizeBlogHtml(html)
 *    — Rich but safe HTML for blog posts rendered from Markdown.
 *      Allows headings, code blocks, lists, tables, images, links.
 *      Strips <script>, <iframe>, <object>, event handlers, javascript: URLs.
 *
 *  sanitizeJobHtml(html)
 *    — Restricted set for third-party job description HTML.
 *      Only structural elements; no images, no links, no iframes.
 */

import sanitizeHtml from 'sanitize-html';

// ── Shared attribute allow-list ──────────────────────────────────────────────
const SAFE_CLASSES = { '*': ['class'] };

// ── Blog content preset ──────────────────────────────────────────────────────
const BLOG_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Inline
    'b', 'i', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'small', 'sup', 'sub',
    // Block
    'p', 'blockquote', 'pre', 'code', 'br', 'hr', 'div', 'span',
    // Lists
    'ul', 'ol', 'li',
    // Table
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
    // Media
    'img',
    // Links
    'a',
    // Misc
    'details', 'summary', 'figure', 'figcaption',
  ],
  allowedAttributes: {
    ...SAFE_CLASSES,
    'a':   ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
    'td':  ['colspan', 'rowspan', 'align'],
    'th':  ['colspan', 'rowspan', 'align', 'scope'],
    'pre': ['data-language'],
    'code': ['data-language'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
  // Force external links to open safely
  transformTags: {
    a(tagName, attribs) {
      const href = attribs.href ?? '';
      const isExternal = /^https?:\/\//.test(href);
      return {
        tagName,
        attribs: {
          ...attribs,
          ...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {}),
        },
      };
    },
  },
  // Drop empty tags that sanitize-html leaves behind
  exclusiveFilter: frame =>
    ['p', 'span', 'div'].includes(frame.tag) &&
    !frame.text.trim() &&
    Object.keys(frame.attribs).length === 0,
};

// ── Job description preset (more restrictive) ────────────────────────────────
const JOB_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4',
    'p', 'br', 'hr',
    'b', 'strong', 'i', 'em', 'u', 's',
    'ul', 'ol', 'li',
    'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span', 'blockquote',
  ],
  allowedAttributes: {
    ...SAFE_CLASSES,
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan', 'scope'],
  },
  allowedSchemes: [],    // no links at all in job descriptions
  disallowedTagsMode: 'discard',
};

/**
 * Sanitize rich blog HTML (from Markdown via `marked`).
 * Safe to pass directly to dangerouslySetInnerHTML.
 */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, BLOG_OPTIONS);
}

/**
 * Sanitize third-party job description HTML.
 * Safe to pass directly to dangerouslySetInnerHTML.
 */
export function sanitizeJobHtml(html: string): string {
  return sanitizeHtml(html, JOB_OPTIONS);
}
