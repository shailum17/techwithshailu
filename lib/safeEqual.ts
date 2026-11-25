import { timingSafeEqual } from 'crypto';

/**
 * Constant-time string comparison. Returns false for differing lengths
 * without leaking where the strings differ.
 */
export function safeEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still burn a comparison so timing doesn't reveal the length mismatch early
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}
