/**
 * Minimal chainable stand-in for the supabase-js query builder.
 *
 * Every builder method records the call and returns the builder; awaiting
 * the builder (or calling .single() / .maybeSingle()) resolves to the next
 * queued result, or to { data: null, error: null } when none is queued.
 */

export interface Call { table: string; method: string; args: unknown[] }
export type Result = { data?: unknown; error?: unknown; count?: number | null };

export function createFakeSupabase() {
  const calls: Call[] = [];
  const results: Result[] = [];

  const next = (): Result => results.shift() ?? { data: null, error: null };

  function builder(table: string) {
    const b: Record<string, unknown> = {};
    const chain = (method: string) => (...args: unknown[]) => {
      calls.push({ table, method, args });
      return b;
    };
    for (const m of [
      'select', 'insert', 'update', 'upsert', 'delete', 'eq', 'neq', 'in', 'lt', 'gt',
      'ilike', 'contains', 'textSearch', 'order', 'limit', 'range',
    ]) b[m] = chain(m);
    b.single = (...args: unknown[]) => { calls.push({ table, method: 'single', args }); return Promise.resolve(next()); };
    b.maybeSingle = (...args: unknown[]) => { calls.push({ table, method: 'maybeSingle', args }); return Promise.resolve(next()); };
    b.then = (resolve: (r: Result) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve(next()).then(resolve, reject);
    return b;
  }

  const client = {
    from: (table: string) => { calls.push({ table, method: 'from', args: [] }); return builder(table); },
    // No rate-limit table in tests: callers fall back to the in-memory limiter
    rpc: async () => ({ data: null, error: { message: 'no db in tests' } }),
  };

  return {
    client,
    calls,
    /** Queue results returned by the next awaited queries, in order. */
    queue: (...r: Result[]) => { results.push(...r); },
    reset: () => { calls.length = 0; results.length = 0; },
    /** Calls of a given method, e.g. 'insert'. */
    of: (method: string) => calls.filter(c => c.method === method),
  };
}
