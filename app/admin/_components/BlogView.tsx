'use client';

/* Blog editor, Markdown upload and post list. */

import { useState, useMemo } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Card, IS } from './shared';

/* ═══════════════════════════════════════════════════════════════
   BLOG VIEW — create, edit, publish blog posts
   ═══════════════════════════════════════════════════════════════ */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  published: boolean;
  published_at: string | null;
  read_time: string;
  cover_url?: string;
  tags?: string[];
}

export const BLOG_CATEGORIES = ['Jobs', 'AI Tools', 'Roadmap', 'Career', 'Interview Prep', 'General'];

export function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function BlogView({ blogs, loading, onRefresh }: {
  blogs: BlogPost[]; loading: boolean; onRefresh: () => void;
}) {
  const emptyForm = {
    title: '', slug: '', excerpt: '', content: '', category: 'Jobs',
    read_time: '', cover_url: '', tags: '', published: false,
  };
  const [form,    setForm]    = useState(emptyForm);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [msg,     setMsg]     = useState('');
  const [msgOk,   setMsgOk]   = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [preview, setPreview] = useState(false);

  // Client-side preview sanitization: strip script tags, event handlers,
  // and javascript: URLs to prevent self-XSS in the admin preview pane.
  // (Full sanitization via sanitize-html runs server-side on every save.)
  const safePreviewHtml = useMemo(() => {
    const raw = form.content || '<p style="color:rgba(255,255,255,0.2)">Nothing to preview yet…</p>';
    return raw
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/\s+on\w+\s*=\s*(['"])[^'"]*\1/gi, '')
      .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/href\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'href="#"')
      .replace(/src\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'src=""');
   
  }, [form.content]);

  function flash(text: string, ok = true) {
    setMsg(text); setMsgOk(ok); setTimeout(() => setMsg(''), 4000);
  }

  // Auto-generate slug from title when creating a new post
  function handleTitleChange(val: string) {
    setForm(f => ({ ...f, title: val, slug: editing ? f.slug : slugify(val) }));
  }

  function startEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title:      post.title,
      slug:       post.slug,
      excerpt:    post.excerpt ?? '',
      content:    post.content ?? '',
      category:   post.category ?? 'Jobs',
      read_time:  post.read_time ?? '',
      cover_url:  post.cover_url ?? '',
      tags:       post.tags?.join(', ') ?? '',
      published:  post.published,
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setPreview(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    try {
      const url    = editing ? `/api/blogs/${editing.id}` : '/api/blogs';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        flash(editing ? 'Post updated ✓' : 'Post created ✓');
        cancelEdit();
        onRefresh();
      } else {
        const d = await res.json().catch(() => ({}));
        flash(d.error ?? d.detail ?? `Error ${res.status}`, false);
      }
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Network error', false);
    }
    setSaving(false);
  }

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) { flash('Post deleted'); onRefresh(); }
    else flash('Delete failed', false);
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch(`/api/blogs/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) onRefresh();
    else flash('Update failed', false);
  }

  const [uploading,   setUploading]   = useState(false);
  const [uploadResult, setUploadResult] = useState<{ status: string; slug: string; title: string; published: boolean } | null>(null);
  const [uploadError,  setUploadError]  = useState('');
  const [dragOver,     setDragOver]     = useState(false);

  async function uploadMd(file: File) {
    if (!file.name.endsWith('.md')) {
      setUploadError('Only .md files are accepted.');
      return;
    }
    setUploading(true);
    setUploadResult(null);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/blogs/upload-md', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadResult(data);
        onRefresh();
      } else {
        setUploadError(data.error ?? `Upload failed (${res.status})`);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Network error');
    }
    setUploading(false);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadMd(file);
    e.target.value = ''; // reset so same file can be re-uploaded
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadMd(file);
  }

  const pubCount   = blogs.filter(b => b.published).length;
  const draftCount = blogs.length - pubCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Upload .md file ──────────────────────────────────── */}
      <div style={{
        background: '#0E0E0E', border: `1px solid ${dragOver ? 'rgba(168,230,61,0.5)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14, padding: '20px 24px',
        transition: 'border-color 0.2s',
      }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>

          {/* Left — description */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <p className="font-poppins font-semibold text-white" style={{ fontSize: 13, marginBottom: 4 }}>
              Upload Markdown File
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.7 }}>
              Upload a <span style={{ fontFamily: 'monospace', color: '#A8E63D' }}>.md</span> file to create or update a blog post.
              The file must have a frontmatter block at the top with at least <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>title</span> and{' '}
              <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>slug</span>. Uploading a file with an existing slug will update that post.
            </p>

            {/* Frontmatter reference */}
            <pre style={{
              marginTop: 10, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              fontSize: 11, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)',
              fontFamily: 'monospace', overflowX: 'auto',
            }}>{`---
title: "Your Post Title"      # required
slug: "your-post-slug"        # required
excerpt: "Short description"
category: "Career"
tags: ["tag1", "tag2"]
read_time: "5 min read"
cover_url: ""
published: false
---

## Write Markdown here`}</pre>

            {/* Result / error feedback */}
            {uploadResult && (
              <div style={{
                marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>
                    Post {uploadResult.status} — &ldquo;{uploadResult.title}&rdquo;
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>
                    <span style={{ fontFamily: 'monospace' }}>/blog/{uploadResult.slug}</span>
                    {' · '}
                    <span style={{ color: uploadResult.published ? '#4ade80' : '#fb923c' }}>
                      {uploadResult.published ? 'Live' : 'Draft'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {uploadError && (
              <div style={{
                marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8,
                background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ color: '#f87171', fontSize: 12 }}>{uploadError}</p>
              </div>
            )}
          </div>

          {/* Right — drop zone + button */}
          <label style={{
            flexShrink: 0, width: 180,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '24px 16px', borderRadius: 12,
            border: `2px dashed ${dragOver ? 'rgba(168,230,61,0.6)' : 'rgba(255,255,255,0.12)'}`,
            background: dragOver ? 'rgba(168,230,61,0.05)' : 'rgba(255,255,255,0.02)',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}>
            <input type="file" accept=".md" style={{ display: 'none' }}
              disabled={uploading} onChange={handleFileInput} />

            {uploading ? (
              <>
                <span style={{
                  width: 28, height: 28, border: '3px solid rgba(168,230,61,0.2)',
                  borderTopColor: '#A8E63D', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block',
                }} />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Uploading…</span>
              </>
            ) : (
              <>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke={dragOver ? '#A8E63D' : 'rgba(255,255,255,0.3)'}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'stroke 0.2s' }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: dragOver ? '#A8E63D' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, transition: 'color 0.2s' }}>
                    Click or drop
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 2 }}>
                    .md files only
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ── Form ─────────────────────────────────────────── */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>
              {editing ? 'Edit Post' : 'New Blog Post'}
            </p>
            {editing && (
              <button onClick={cancelEdit}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                          cursor: 'pointer', fontSize: 13, padding: '4px 8px' }}>
                ✕ Cancel
              </button>
            )}
          </div>

          {/* Flash */}
          {msg && (
            <div style={{
              background: msgOk ? 'rgba(168,230,61,0.08)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${msgOk ? 'rgba(168,230,61,0.25)' : 'rgba(248,113,113,0.25)'}`,
              color: msgOk ? '#A8E63D' : '#f87171',
              borderRadius: 10, padding: '10px 13px', fontSize: 12, marginBottom: 14,
            }}>{msg}</div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                               letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                Title <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input type="text" placeholder="Post title" required value={form.title}
                onChange={e => handleTitleChange(e.target.value)} style={IS} />
            </div>

            {/* Slug */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                               letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                Slug <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input type="text" placeholder="url-friendly-slug" required value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                style={{ ...IS, fontFamily: 'monospace', fontSize: 12 }} />
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                               letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                Excerpt
              </label>
              <textarea placeholder="Short description shown on cards" rows={2} value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                style={{ ...IS, resize: 'vertical' }} />
            </div>

            {/* Category + Read time row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                                 letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                  Category
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {BLOG_CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))}
                      style={{
                        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                        transition: 'all 0.15s',
                        background: form.category === c ? 'rgba(168,230,61,0.15)' : 'rgba(255,255,255,0.05)',
                        border: form.category === c ? '1px solid rgba(168,230,61,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: form.category === c ? '#A8E63D' : 'rgba(255,255,255,0.45)',
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                                 letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                  Read Time
                </label>
                <input type="text" placeholder="e.g. 5 min read" value={form.read_time}
                  onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))} style={IS} />
              </div>
            </div>

            {/* Cover Image */}
            <ImageUpload
              label="Cover Image"
              hint="(optional)"
              value={form.cover_url}
              onChange={url => setForm(f => ({ ...f, cover_url: url }))}
              size={64}
            />

            {/* Tags */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                               letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>
                Tags <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', fontWeight: 400 }}>(comma-separated)</span>
              </label>
              <input type="text" placeholder="react, nextjs, interview" value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={IS} />
            </div>

            {/* Content — with preview toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
                                 letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  Content <span style={{ color: '#f87171' }}>*</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', fontWeight: 400, marginLeft: 6 }}>(HTML)</span>
                </label>
                <button type="button" onClick={() => setPreview(p => !p)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)', borderRadius: 7, padding: '3px 10px',
                            fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-outfit)' }}>
                  {preview ? '✎ Edit' : '👁 Preview'}
                </button>
              </div>
              {preview ? (
                <div
                  className="prose prose-sm prose-invert max-w-none"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10, padding: '12px 14px', minHeight: 160, fontSize: 13 }}
                  dangerouslySetInnerHTML={{ __html: safePreviewHtml }}
                />
              ) : (
                <textarea required rows={10} placeholder="<h2>Heading</h2><p>Your content…</p>"
                  value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  style={{ ...IS, resize: 'vertical', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }} />
              )}
            </div>

            {/* Published toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                             color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={form.published}
                onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-lime" />
              Publish immediately
            </label>

            <button type="submit" disabled={saving || loading} className="btn-lime w-full py-2.5 text-sm"
              style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {saving ? (
                <><span style={{ width: 13, height: 13, border: '2px solid rgba(0,0,0,0.2)',
                                  borderTopColor: '#080808', borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Saving…</>
              ) : editing ? 'Update Post' : 'Create Post'}
            </button>
          </form>
        </Card>

        {/* ── List ─────────────────────────────────────────── */}
        <div>
          {/* Header row — title + refresh */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p className="font-poppins font-bold text-white" style={{ fontSize: 15 }}>
              All Posts&nbsp;
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>({blogs.length})</span>
            </p>
            <button
              onClick={onRefresh}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(168,230,61,0.08)',
                border: '1px solid rgba(168,230,61,0.25)',
                color: loading ? 'rgba(255,255,255,0.3)' : '#A8E63D',
                borderRadius: 9, padding: '7px 14px',
                fontSize: 12, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-outfit)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!loading) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(168,230,61,0.15)'; b.style.borderColor = 'rgba(168,230,61,0.45)'; }}}
              onMouseLeave={e => { if (!loading) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(168,230,61,0.08)'; b.style.borderColor = 'rgba(168,230,61,0.25)'; }}}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 11, height: 11,
                    border: '2px solid rgba(255,255,255,0.15)',
                    borderTopColor: 'rgba(255,255,255,0.6)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }} />
                  Refreshing…
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                    <path d="M20.5 9A9 9 0 005.2 5.2L1 10m22 4l-4.2 4.8A9 9 0 013.5 15"/>
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Total',     value: blogs.length, color: '#A8E63D' },
              { label: 'Published', value: pubCount,     color: '#4ade80' },
              { label: 'Drafts',    value: draftCount,   color: '#fb923c' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '12px 16px', textAlign: 'center',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600,
                             letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {s.label}
                </p>
                <p className="font-poppins font-bold" style={{ fontSize: 22, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 680, overflowY: 'auto' }}
               className="hide-scrollbar">
            {blogs.map(post => (
              <div key={post.id}
                style={{
                  background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '13px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,230,61,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title + publish badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <p className="text-white" style={{ fontSize: 13, fontWeight: 600,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                      {post.title}
                    </p>
                    <span style={{
                      flexShrink: 0,
                      background: post.published ? 'rgba(74,222,128,0.1)' : 'rgba(251,146,60,0.1)',
                      border: `1px solid ${post.published ? 'rgba(74,222,128,0.25)' : 'rgba(251,146,60,0.25)'}`,
                      color: post.published ? '#4ade80' : '#fb923c',
                      borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700,
                    }}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Meta */}
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 2 }}>
                    {post.category}
                    {post.read_time && <> · {post.read_time}</>}
                    {post.published_at && (
                      <> · {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                    )}
                  </p>

                  {/* Slug */}
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'monospace' }}>
                    /blog/{post.slug}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  {/* Edit */}
                  <button onClick={() => startEdit(post)}
                    style={{ background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.2)',
                              color: '#A8E63D', borderRadius: 7, padding: '5px 12px',
                              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-outfit)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,230,61,0.16)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,230,61,0.08)'}>
                    Edit
                  </button>
                  {/* Publish / Unpublish */}
                  <button onClick={() => togglePublish(post)}
                    style={{
                      background: post.published ? 'rgba(251,146,60,0.08)' : 'rgba(74,222,128,0.08)',
                      border: `1px solid ${post.published ? 'rgba(251,146,60,0.2)' : 'rgba(74,222,128,0.2)'}`,
                      color: post.published ? '#fb923c' : '#4ade80',
                      borderRadius: 7, padding: '5px 12px',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.8'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}>
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  {/* Delete */}
                  <button onClick={() => del(post.id, post.title)}
                    style={{ background: 'none', border: 'none', color: '#f87171',
                              cursor: 'pointer', fontSize: 11, fontWeight: 600,
                              padding: '5px 12px', borderRadius: 7, fontFamily: 'var(--font-outfit)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}>
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {blogs.length === 0 && !loading && (
              <div style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
                             borderRadius: 12, padding: '48px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                  No posts yet. Write your first article above.
                </p>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.06)',
                                         borderRadius: 12, height: 80, animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
