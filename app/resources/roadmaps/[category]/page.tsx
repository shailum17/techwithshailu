import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { roadmapCategories } from '../data';
import RoadmapCategoryClient from './RoadmapCategoryClient';

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = roadmapCategories.find(c => c.id === category);
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat.title} Roadmap — Resources`,
    description: cat.subtitle,
  };
}

export default async function RoadmapCategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = roadmapCategories.find(c => c.id === category);
  if (!cat) notFound();

  return <RoadmapCategoryClient category={cat} />;
}
