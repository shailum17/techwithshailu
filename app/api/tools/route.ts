import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/adminAuth';
import Tool from '@/models/Tool';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json([]);
  }
  const { searchParams } = new URL(req.url);

  const filter: Record<string, unknown> = {};
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search   = searchParams.get('q');

  if (category) filter.category = category;
  if (featured === 'true') filter.is_featured = true;
  if (search)   filter.$text = { $search: search };

  const tools = await Tool.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(tools);
}

export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  await connectDB();
  const body = await req.json();
  const tool = await Tool.create(body);
  return NextResponse.json(tool, { status: 201 });
}
