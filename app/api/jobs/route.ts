import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/adminAuth';
import Job from '@/models/Job';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json([]);
  }
  const { searchParams } = new URL(req.url);

  const filter: Record<string, unknown> = {};

  const type      = searchParams.get('type');
  const location  = searchParams.get('location');
  const batch     = searchParams.get('batch_year');
  const featured  = searchParams.get('featured');
  const search    = searchParams.get('q');

  if (type)     filter.type = type;
  if (location) filter.location = new RegExp(location, 'i');
  if (batch)    filter.batch_year = Number(batch);
  if (featured === 'true') filter.is_featured = true;
  if (search)   filter.$text = { $search: search };

  const sort = searchParams.get('sort') || 'newest';
  const sortObj: Record<string, 1 | -1> =
    sort === 'deadline' ? { deadline: 1 } : { createdAt: -1 };

  const jobs = await Job.find(filter).sort(sortObj).lean();
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  await connectDB();
  const body = await req.json();
  const job = await Job.create(body);
  return NextResponse.json(job, { status: 201 });
}
