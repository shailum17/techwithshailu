import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoadmapCategory, getRoadmapCategories } from '@/lib/roadmaps';
import RoadmapCategoryClient from './RoadmapCategoryClient';

export const revalidate = 60;

/* ── Pre-generate all known category paths at build time ──── */
export async function generateStaticParams() {
  const categories = await getRoadmapCategories();
  return categories.map(cat => ({ category: cat.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = await getRoadmapCategory(category);
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat.title} Roadmap — techwithshailu`,
    description: cat.subtitle,
  };
}

export default async function RoadmapCategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = await getRoadmapCategory(category);
  if (!cat) notFound();

  return <RoadmapCategoryClient category={cat} />;
}
