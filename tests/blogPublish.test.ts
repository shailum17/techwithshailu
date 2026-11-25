import { describe, it, expect } from 'vitest';
import { resolvePublishedAt } from '@/lib/blogPublish';

const NOW = new Date('2026-11-25T10:00:00.000Z');
const EARLIER = '2026-01-01T00:00:00.000Z';

describe('resolvePublishedAt', () => {
  it('stamps the first publish', () => {
    expect(resolvePublishedAt(null, true, NOW)).toBe(NOW.toISOString());
    expect(resolvePublishedAt(undefined, true, NOW)).toBe(NOW.toISOString());
  });

  it('keeps the original date when editing a published post', () => {
    expect(resolvePublishedAt(EARLIER, true, NOW)).toBe(EARLIER);
  });

  it('keeps the date when unpublishing, null if never published', () => {
    expect(resolvePublishedAt(EARLIER, false, NOW)).toBe(EARLIER);
    expect(resolvePublishedAt(null, false, NOW)).toBeNull();
  });

  it('leaves the column alone when published is not part of the update', () => {
    expect(resolvePublishedAt(EARLIER, undefined, NOW)).toBeUndefined();
  });
});
