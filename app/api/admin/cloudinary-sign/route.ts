/**
 * app/api/admin/cloudinary-sign/route.ts
 *
 * POST /api/admin/cloudinary-sign  (admin only)
 *
 * Returns the parameters for a *signed* Cloudinary upload, so the browser
 * never needs a public unsigned upload preset (which would let anyone upload
 * to the account). The API secret stays on the server.
 *
 * Env: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Response: { cloudName, apiKey, timestamp, folder, signature }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { checkAdminAuth } from '@/lib/adminAuth';

const UPLOAD_FOLDER = 'techwithshailu';

export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[cloudinary-sign] Cloudinary env vars are not set');
    return NextResponse.json(
      { error: 'Image upload is not configured on the server.' },
      { status: 503 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature: SHA-1 of the alphabetically sorted params
  // ("key=value" joined by "&") followed directly by the API secret.
  const toSign    = `folder=${UPLOAD_FOLDER}&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(toSign + apiSecret).digest('hex');

  return NextResponse.json({ cloudName, apiKey, timestamp, folder: UPLOAD_FOLDER, signature });
}
