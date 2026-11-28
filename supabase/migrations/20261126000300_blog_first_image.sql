-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — blogs.first_image_url
--
-- The blog list and the post sidebar show the first <img> in a post as
-- its thumbnail when cover_url is empty. They used to load every post's
-- full HTML to find it. This generated column keeps that URL up to date
-- whenever content changes, so list queries select it instead of content.
--
-- Same match as the app's former JS regex: /<img[^>]+src=["']([^"']+)["']/i
-- (first match, case-insensitive; null when the post has no image).
-- Idempotent.
-- ═══════════════════════════════════════════════════════════════

alter table blogs add column if not exists first_image_url text
  generated always as (
    substring(content from '(?i)<img[^>]+src=["'']([^"'']+)["'']')
  ) stored;
