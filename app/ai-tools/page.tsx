import type { Metadata } from 'next';
import { Suspense } from 'react';
import AIToolsClient from './AIToolsClient';

export const metadata: Metadata = {
  title: 'AI Tools Directory — Best AI Tools for Students 2026',
  description: 'Curated collection of the best AI tools for writing, coding, image generation, productivity and research. Updated for 2026.',
};

export default function AIToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#080808' }} />}>
      <AIToolsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AIToolsContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  return <AIToolsClient initialCategory={category} initialQ={q} />;
}
