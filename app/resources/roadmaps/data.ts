/**
 * Type definitions for roadmap data.
 * All actual data is stored in and fetched from Supabase — see lib/roadmaps.ts.
 */

import type { NodeResources } from '@/app/resources/roadmaps/[category]/resources-data';
export type { NodeResources };

export interface RoadmapResource {
  name: string;
  description: string;
  url: string;
  domain: string;
  tags: { label: string; color: string; bg: string }[];
}

export interface RoadmapCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  dotColor: string;
  resources: RoadmapResource[];
  nodeResources?: Record<string, NodeResources>;
  tags?: string[];
  proTip?: { text: string; linkLabel?: string; linkUrl?: string };
}
