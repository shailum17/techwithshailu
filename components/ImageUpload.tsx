'use client';

import { useRef, useState, useCallback } from 'react';

interface Props {
  value: string;                    // current URL (controlled)
  onChange: (url: string) => void;  // called with final URL
  label?: string;                   // e.g. "Company Logo"
  hint?: string;                    // sub-label
  size?: number;                    // preview box px
  adminKey: string;                 // sent to /api/admin/cloudinary-sign
}

interface SignedParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

/**
 * Signed upload: ask our admin-only API for a short-lived signature, then
 * upload straight to Cloudinary. No unsigned preset is exposed to the browser.
 */
async function uploadToCloudinary(file: File, adminKey: string): Promise<string> {
  const signRes = await fetch('/api/admin/cloudinary-sign', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  if (!signRes.ok) {
    const body = await signRes.json().catch(() => ({}));
    throw new Error(body.error ?? 'Could not authorise upload');
  }
  const p = (await signRes.json()) as SignedParams;

  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', p.apiKey);
  fd.append('timestamp', String(p.timestamp));
  fd.append('folder', p.folder);
  fd.append('signature', p.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${p.cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url as string;
}

export default function ImageUpload({ value, onChange, label = 'Image', hint, size = 56, adminKey }: Props) {
  const [mode, setMode]       = useState<'url' | 'file'>('file');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]     = useState('');
  const [imgErr, setImgErr]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('Max file size is 5 MB.'); return; }
    setError('');
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, adminKey);
      onChange(url);
      setImgErr(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onChange, adminKey]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const IS: React.CSSProperties = {
    width: '100%', background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '8px 10px', color: '#F0F0F0',
    fontSize: 12, outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: '#A0A0A0', fontSize: 12, fontWeight: 600 }}>{label}</span>
          {hint && <span style={{ color: '#444', fontSize: 11, marginLeft: 6 }}>{hint}</span>}
        </div>
        {/* Toggle tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#080808', borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.08)', padding: 3 }}>
          {(['file','url'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(''); }}
              style={{
                background: mode === m ? 'rgba(255,255,255,0.05)' : 'none',
                border: mode === m ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                color: mode === m ? '#F0F0F0' : '#555',
                borderRadius: 6, padding: '3px 10px', fontSize: 11,
                cursor: 'pointer', fontWeight: mode === m ? 600 : 400,
              }}>
              {m === 'file' ? 'Upload' : 'URL'}
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

        {/* Input / dropzone */}
        <div style={{ flex: 1 }}>
          {mode === 'file' ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => !uploading && inputRef.current?.click()}
              style={{
                border: `1.5px dashed ${dragging ? '#A8E63D' : '#2A2A2A'}`,
                borderRadius: 10, padding: '16px 12px', textAlign: 'center',
                cursor: uploading ? 'not-allowed' : 'pointer',
                background: dragging ? 'rgba(168,230,61,0.04)' : '#080808',
                transition: 'all 0.15s ease',
              }}>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value=''; }}
              />
              {uploading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%',
                                  border: '2px solid #A8E63D', borderTopColor: 'transparent',
                                  animation: 'spin 0.7s linear infinite', display: 'inline-block' }}/>
                  <span style={{ color: '#888', fontSize: 12 }}>Uploading…</span>
                </div>
              ) : (
                <>
                  <p style={{ color: '#A8E63D', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                    Click or drag &amp; drop
                  </p>
                  <p style={{ color: '#444', fontSize: 11 }}>PNG, JPG, SVG, WebP · max 5 MB</p>
                </>
              )}
            </div>
          ) : (
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={value}
              onChange={e => { onChange(e.target.value); setImgErr(false); setError(''); }}
              style={IS}
            />
          )}
          {error && (
            <p style={{ color: '#f87171', fontSize: 11, marginTop: 5 }}>{error}</p>
          )}
        </div>

        {/* Preview thumbnail */}
        <div style={{
          width: size, height: size, borderRadius: 10, flexShrink: 0,
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${value && !imgErr ? '#A8E63D40' : '#2A2A2A'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          {value && !imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value} alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={() => setImgErr(true)}
            />
          ) : (
            <span style={{ color: '#333', fontSize: 11, textAlign: 'center',
                           lineHeight: 1.3, padding: '4px' }}>
              {imgErr ? 'broken' : 'preview'}
            </span>
          )}
          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); setImgErr(false); }}
              style={{
                position: 'absolute', top: 2, right: 2,
                background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                width: 16, height: 16, cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, lineHeight: 1,
              }}
              title="Remove image"
            >×</button>
          )}
        </div>
      </div>
    </div>
  );
}
