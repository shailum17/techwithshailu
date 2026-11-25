import { describe, it, expect } from 'vitest';
import { safeHttpUrl, clampLimit, pick, JOB_FIELDS } from '@/lib/validate';

describe('safeHttpUrl', () => {
  it('accepts absolute http(s) URLs and trims them', () => {
    expect(safeHttpUrl(' https://example.com/apply ')).toBe('https://example.com/apply');
    expect(safeHttpUrl('http://example.com')).toBe('http://example.com/');
  });

  it.each(['javascript:alert(1)', 'data:text/html,hi', '/relative/path', 'not a url', '', '   '])(
    'rejects %j', value => {
      expect(safeHttpUrl(value)).toBeNull();
    },
  );

  it('rejects non-strings', () => {
    expect(safeHttpUrl(undefined)).toBeNull();
    expect(safeHttpUrl(42)).toBeNull();
    expect(safeHttpUrl({ href: 'https://x.com' })).toBeNull();
  });
});

describe('clampLimit', () => {
  it('falls back when missing or invalid', () => {
    expect(clampLimit(null, 20)).toBe(20);
    expect(clampLimit('', 20)).toBe(20);
    expect(clampLimit('abc', 20)).toBe(20);
    expect(clampLimit('0', 20)).toBe(20);
    expect(clampLimit('-3', 20)).toBe(20);
  });

  it('caps at max and floors decimals', () => {
    expect(clampLimit('5000', 20, 100)).toBe(100);
    expect(clampLimit('7.9', 20)).toBe(7);
  });
});

describe('pick', () => {
  it('keeps only allow-listed keys', () => {
    const body = { title: 'Dev', id: 'x', fts: 'y', created_at: 'z', is_featured: false };
    expect(pick(body, JOB_FIELDS)).toEqual({ title: 'Dev', is_featured: false });
  });

  it('ignores undefined values and non-object input', () => {
    expect(pick({ title: undefined }, JOB_FIELDS)).toEqual({});
    expect(pick(null, JOB_FIELDS)).toEqual({});
    expect(pick('str', JOB_FIELDS)).toEqual({});
  });

  it('does not read inherited properties', () => {
    const proto = { title: 'inherited' };
    expect(pick(Object.create(proto), JOB_FIELDS)).toEqual({});
  });
});
