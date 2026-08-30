import type { Metadata } from 'next';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import AIToolsClient from './AIToolsClient';
import type { AiTool } from './AIToolsClient';

export const metadata: Metadata = {
  title: 'AI Tools Directory — Best AI Tools for Students 2026',
  description: 'Curated collection of the best AI tools for writing, coding, image generation, productivity and research. Updated for 2026.',
};

// Revalidate every hour so new tools added in the DB appear quickly
export const revalidate = 3600;

async function fetchTools(): Promise<AiTool[]> {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, description, category, url, logo, is_free, votes, is_featured')
      .order('votes', { ascending: false });

    if (error) {
      console.error('[AIToolsPage] Supabase error:', error.message);
      return [];
    }
    return (data ?? []) as AiTool[];
  } catch (err) {
    console.error('[AIToolsPage] fetch failed:', err);
    return [];
  }
}

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
  const [{ category, q }, tools] = await Promise.all([
    searchParams,
    fetchTools(),
  ]);

  return <AIToolsClient initialTools={tools} initialCategory={category} initialQ={q} />;
}
