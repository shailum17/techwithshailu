import { permanentRedirect } from 'next/navigation';

/**
 * Legacy URL: /resources/<roadmap-slug>
 *
 * Roadmaps now live at /resources/roadmaps/<slug> (data from Supabase via
 * lib/roadmaps.ts). This route used to render from an empty local map and
 * 404'd for every slug, so redirect old links (and search-engine entries)
 * to the real page. Static siblings such as /resources/cheat-sheets take
 * precedence over this dynamic segment and are unaffected.
 */
export default async function LegacyRoadmapRedirect(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  permanentRedirect(`/resources/roadmaps/${encodeURIComponent(slug)}`);
}
