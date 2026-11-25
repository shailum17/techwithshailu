/**
 * POST /api/admin/blogs/upload-md
 *
 * Accepts a multipart/form-data upload with a single field "file" containing
 * a .md file. Parses frontmatter + Markdown body, converts to HTML, and
 * upserts into the `blogs` Supabase table (keyed on `slug`).
 *
 * Auth: x-admin-key header required.
 *
 * Returns:
 *   { slug, status: 'created' | 'updated', title, published }
 */

import { NextRequest, NextResponse } from 'next/server';
import matter from 'gray-matter';
import { marked } from 'marked';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { resolvePublishedAt } from '@/lib/blogPublish';

marked.setOptions({ gfm: true, breaks: false });

interface FrontMatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  tags?: string | string[];
  cover_url?: string;
  read_time?: string;
  published?: boolean;
  author?: string;
}

export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  // ── 1. Parse multipart form ─────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded. Send a .md file in the "file" field.' }, { status: 400 });
  }

  const fileName = (file as File).name ?? '';
  if (!fileName.endsWith('.md')) {
    return NextResponse.json({ error: 'Only .md files are accepted.' }, { status: 400 });
  }

  const raw = await (file as File).text();

  // ── 2. Parse frontmatter ────────────────────────────────────
  const { data, content: mdBody } = matter(raw) as { data: FrontMatter; content: string };

  if (!data.title) {
    return NextResponse.json({ error: 'Missing required frontmatter: title' }, { status: 422 });
  }
  if (!data.slug) {
    return NextResponse.json({ error: 'Missing required frontmatter: slug' }, { status: 422 });
  }

  // ── 3. Markdown → HTML (sanitized) ────────────────────────────
  let html: string;
  try {
    const rawHtml = await Promise.resolve(marked(mdBody));
    html = sanitizeBlogHtml(rawHtml);
  } catch (err) {
    console.error('[POST /api/admin/blogs/upload-md] markdown parse:', err);
    return NextResponse.json({ error: 'Markdown parse error' }, { status: 422 });
  }

  // ── 4. Normalise tags ───────────────────────────────────────
  let tags: string[] = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags.map(t => String(t).trim()).filter(Boolean);
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  const isPublished = data.published === true;
  const now = new Date().toISOString();

  // ── 5. Check if slug already exists ────────────────────────
  const { data: existing } = await supabaseAdmin
    .from('blogs')
    .select('id, published_at')
    .eq('slug', data.slug)
    .maybeSingle();

  const isUpdate = !!existing;

  // ── 6. Upsert — try with optional cols, fall back without them ──
  const basePayload: Record<string, unknown> = {
    title:        data.title,
    slug:         data.slug,
    excerpt:      data.excerpt   ?? '',
    content:      html,
    cover_url:    data.cover_url ?? '',
    author:       data.author    ?? 'Shailu',
    tags,
    published:    isPublished,
    // Re-uploading an already-published post keeps its original date
    published_at: resolvePublishedAt(existing?.published_at, isPublished),
    updated_at:   now,
  };

  // category / read_time are added by
  // supabase/migrations/20261124000000_schema_sync.sql; the fallback below
  // keeps uploads working on databases where it hasn't been applied yet.
  const extendedPayload = {
    ...basePayload,
    ...(data.category  !== undefined ? { category:  data.category  } : {}),
    ...(data.read_time !== undefined ? { read_time: data.read_time } : {}),
  };

  let upserted: { id: string; slug: string; title: string; published: boolean } | null = null;

  // First attempt — with optional columns
  const { data: result1, error: error1 } = await supabaseAdmin
    .from('blogs')
    .upsert(extendedPayload, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id, slug, title, published')
    .single();

  if (!error1) {
    upserted = result1;
  } else {
    // If the error is about a missing column, retry without those columns
    const isMissingCol = error1.message.includes('column') ||
                         error1.message.includes('schema cache') ||
                         error1.message.includes('category') ||
                         error1.message.includes('read_time');

    if (isMissingCol) {
      const { data: result2, error: error2 } = await supabaseAdmin
        .from('blogs')
        .upsert(basePayload, { onConflict: 'slug', ignoreDuplicates: false })
        .select('id, slug, title, published')
        .single();

      if (error2) {
        console.error('[POST /api/admin/blogs/upload-md] fallback error:', error2.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      upserted = result2;
    } else {
      console.error('[POST /api/admin/blogs/upload-md]', error1.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  if (!upserted) {
    return NextResponse.json({ error: 'Upsert returned no data' }, { status: 500 });
  }

  return NextResponse.json({
    status:    isUpdate ? 'updated' : 'created',
    slug:      upserted.slug,
    title:     upserted.title,
    published: upserted.published,
  }, { status: isUpdate ? 200 : 201 });
}
