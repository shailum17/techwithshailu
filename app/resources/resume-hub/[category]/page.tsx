import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories } from '../data';
import ResumeCategoryClient from './ResumeCategoryClient';

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find(c => c.id === category);
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat.title} — Resume Hub`,
    description: cat.subtitle,
  };
}

export default async function ResumeCategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = categories.find(c => c.id === category);
  if (!cat) notFound();

  return <ResumeCategoryClient category={cat} />;
}
