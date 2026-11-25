import { describe, it, expect } from 'vitest';
import {
  normalizeJobType, parseFetchFilters, applyFetchFilters, jsearchDatePosted,
} from '@/lib/jobPipeline';

describe('normalizeJobType', () => {
  it.each([
    ['FULLTIME', '', 'Full-time'],
    ['full_time', '', 'Full-time'],
    ['Full-time', '', 'Full-time'],
    ['INTERN', '', 'Internship'],
    ['PARTTIME', '', 'Job'],
    ['CONTRACTOR', '', 'Job'],
    [undefined, '', 'Job'],
    ['FULLTIME', 'Software Engineering Intern', 'Internship'],
    ['', 'Backend Internship 2026', 'Internship'],
    ['', 'Internal Tools Engineer', 'Job'],
  ])('%j + title %j → %s', (raw, title, expected) => {
    expect(normalizeJobType(raw, title)).toBe(expected);
  });
});

describe('parseFetchFilters', () => {
  it('reads valid filters', () => {
    const f = parseFetchFilters(new URLSearchParams('type=Internship&source=adzuna&location=%20Pune%20&max_days=7'));
    expect(f).toEqual({ type: 'Internship', source: 'adzuna', location: 'Pune', maxDays: 7 });
  });

  it('ignores unknown or invalid values', () => {
    const f = parseFetchFilters(new URLSearchParams('type=Gig&source=linkedin&location=%20&max_days=-1'));
    expect(f).toEqual({});
  });

  it('caps max_days', () => {
    expect(parseFetchFilters(new URLSearchParams('max_days=9999')).maxDays).toBe(365);
  });
});

describe('applyFetchFilters', () => {
  const jobs = [
    { type: 'Internship', location: 'Pune, Maharashtra' },
    { type: 'Job',        location: 'Bengaluru' },
    { type: 'Internship', location: 'Remote' },
  ];

  it('filters by type and location (case-insensitive)', () => {
    expect(applyFetchFilters(jobs, { type: 'Internship', location: 'pune' })).toEqual([jobs[0]]);
  });

  it('returns everything without filters', () => {
    expect(applyFetchFilters(jobs, {})).toHaveLength(3);
  });
});

describe('jsearchDatePosted', () => {
  it.each([[undefined, 'all'], [1, 'today'], [3, '3days'], [7, 'week'], [14, 'month'], [30, 'month'], [90, 'all']])(
    '%j days → %s', (days, expected) => {
      expect(jsearchDatePosted(days as number | undefined)).toBe(expected);
    },
  );
});
