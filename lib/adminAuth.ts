import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifies the x-admin-key header matches ADMIN_SECRET.
 * Returns a 401 response if not authorized, null if OK.
 */
export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const key = req.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
