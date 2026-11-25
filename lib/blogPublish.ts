/**
 * lib/blogPublish.ts
 *
 * Decides what `published_at` should be when a blog post is saved.
 *
 *  - First publish            → now
 *  - Already has a date        → keep it (editing a live post must not
 *                                "re-publish" it and reorder the blog)
 *  - Unpublished, never dated  → null
 *  - `published` not in request → undefined (leave the column untouched)
 */
export function resolvePublishedAt(
  currentPublishedAt: string | null | undefined,
  published: unknown,
  now: Date = new Date(),
): string | null | undefined {
  if (published === true)  return currentPublishedAt ?? now.toISOString();
  if (published === false) return currentPublishedAt ?? null;
  return undefined;
}
