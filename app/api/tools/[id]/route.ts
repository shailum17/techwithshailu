import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/adminAuth';
import Tool from '@/models/Tool';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  await connectDB();
  const body = await req.json();
  const tool = await Tool.findByIdAndUpdate(params.id, body, { new: true }).lean();
  if (!tool) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tool);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  await connectDB();
  await Tool.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
