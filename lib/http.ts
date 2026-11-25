/**
 * lib/http.ts
 *
 * Outbound HTTP helpers for server code that calls third-party APIs.
 */

/** Default timeout for third-party calls, in ms. */
export const DEFAULT_FETCH_TIMEOUT_MS = 8000;

/**
 * fetch() that aborts after `ms`, so one slow upstream can't hold a
 * serverless function until the platform kills it. Rejects with an
 * AbortError (`isTimeout(err)` is true) when the timeout fires.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  ms = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** True for the error fetchWithTimeout throws when it times out. */
export function isTimeout(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}
