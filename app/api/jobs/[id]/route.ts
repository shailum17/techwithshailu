import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/adminAuth';
import Job from '@/models/Job';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const job = await Job.findById(params.id).lean();
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  await connectDB();
  const body = await req.json();
  const job = await Job.findByIdAndUpdate(params.id, body, { new: true }).lean();
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  await connectDB();
  await Job.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
