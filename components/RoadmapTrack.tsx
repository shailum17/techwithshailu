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

const statusLabel: Record<NodeStatus, string> = {
  completed:    'Completed',
  'in-progress': 'In Progress',
  locked:       'Locked',
};

export default function RoadmapTrack({ nodes }: { nodes: Node[] }) {
  return (
    <div className="space-y-0">
      {nodes.map((node, index) => {
        const isCompleted  = node.status === 'completed';
        const isInProgress = node.status === 'in-progress';
        const isLocked     = node.status === 'locked';

        const dotStyle = isCompleted
          ? { background: '#9B7FE8', border: '2px solid #9B7FE8', color: '#fff' }
          : isInProgress
            ? { background: '#A8E63D', border: '2px solid #A8E63D', color: '#000' }
            : { background: '#1A1A1A', border: '2px solid #2A2A2A', color: '#606060' };

        const cardStyle = isCompleted
          ? { background: 'rgba(155,127,232,0.08)', border: '1px solid rgba(155,127,232,0.2)' }
          : isInProgress
            ? { background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.25)' }
            : { background: '#111111', border: '1px solid #2A2A2A', opacity: 0.6 };

        const badgeStyle = isCompleted
          ? { background: 'rgba(155,127,232,0.12)', color: '#B49EF0', border: '1px solid rgba(155,127,232,0.3)' }
          : isInProgress
            ? { background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.3)' }
            : { background: '#1A1A1A', color: '#606060', border: '1px solid #2A2A2A' };

        const lineColor = isCompleted ? '#9B7FE8' : isInProgress ? 'rgba(168,230,61,0.4)' : '#2A2A2A';

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
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold z-10 flex-shrink-0"
                   style={dotStyle}>
                {isCompleted
                  ? '✓'
                  : isInProgress
                    ? <span className="text-xs font-bold">●</span>
                    : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                }
              </div>
              {index < nodes.length - 1 && (
                <div className="w-0.5 flex-1 my-1 min-h-8 rounded-full"
                     style={{ background: lineColor }} />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 rounded-2xl p-5 mb-4" style={cardStyle}>
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <h3 className="font-poppins font-semibold text-base"
                    style={{ color: isLocked ? '#606060' : '#F0F0F0' }}>
                  {node.title}
                </h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={badgeStyle}>
                  {statusLabel[node.status]}
                </span>
              </div>

              {!isLocked ? (
                <div className="space-y-2">
                  {node.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-sm text-ink-muted hover:text-lime transition-colors group">
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#A0A0A0' }}>
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
