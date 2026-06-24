'use client';

import { motion } from 'framer-motion';

type NodeStatus = 'completed' | 'in-progress' | 'locked';

interface Node {
  title: string;
  status: NodeStatus;
  resources: { label: string; url: string; type: 'video' | 'article' | 'course' }[];
}

const typeLabel: Record<string, string> = {
  video:   'Video',
  article: 'Article',
  course:  'Course',
};

const nodeStyles: Record<NodeStatus, { dot: string; card: string; badge: string }> = {
  completed: {
    dot:   'bg-purple-brand border-purple-brand text-white',
    card:  'border-purple-brand/20 bg-purple-tint',
    badge: 'bg-purple-tint text-purple-brand border-purple-brand/30',
  },
  'in-progress': {
    dot:   'bg-lime border-lime text-white node-active',
    card:  'border-lime/30 bg-lime-light',
    badge: 'bg-lime-light text-lime border-lime/30',
  },
  locked: {
    dot:   'bg-surface-tertiary border-surface-border text-ink-faint',
    card:  'border-surface-border bg-white opacity-60',
    badge: 'bg-surface-tertiary text-ink-faint border-surface-border',
  },
};

const statusLabel: Record<NodeStatus, string> = {
  completed:    'Completed',
  'in-progress': 'In Progress',
  locked:       'Locked',
};

export default function RoadmapTrack({ nodes }: { nodes: Node[] }) {
  return (
    <div className="space-y-0">
      {nodes.map((node, index) => {
        const s = nodeStyles[node.status];
        return (
          <motion.div
            key={node.title}
            className="flex gap-5"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: index * 0.07 }}
          >
            {/* Timeline */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                               text-sm font-bold z-10 flex-shrink-0 ${s.dot}`}>
                {node.status === 'completed'
                  ? '✓'
                  : node.status === 'in-progress'
                    ? <span className="text-xs font-bold">•</span>
                    : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                }
              </div>
              {index < nodes.length - 1 && (
                <div className={`w-0.5 flex-1 my-1 min-h-8 ${
                  node.status === 'completed'
                    ? 'bg-purple-brand/30'
                    : node.status === 'in-progress'
                      ? 'bg-lime/40'
                      : 'bg-surface-border'
                }`} />
              )}
            </div>

            {/* Card */}
            <div className={`flex-1 border rounded-2xl p-5 mb-4 ${s.card}`}>
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <h3 className={`font-poppins font-semibold text-base ${
                  node.status === 'locked' ? 'text-ink-muted' : 'text-ink'
                }`}>
                  {node.title}
                </h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.badge}`}>
                  {statusLabel[node.status]}
                </span>
              </div>

              {node.status !== 'locked' ? (
                <div className="space-y-2">
                  {node.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-sm text-ink-muted
                                  hover:text-lime transition-colors group">
                      <span className="text-xs font-medium text-ink-faint bg-surface-tertiary
                                       border border-surface-border px-1.5 py-0.5 rounded flex-shrink-0">
                        {typeLabel[r.type]}
                      </span>
                      <span className="group-hover:underline">{r.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-ink-faint text-sm">
                  Complete previous modules to unlock this topic.
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
