'use client';

import { motion } from 'framer-motion';
import JobCard from './JobCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.38, ease: 'easeOut' } },
};

interface JobCardsGridProps {
  jobs: Parameters<typeof JobCard>[0][];
}

export default function JobCardsGrid({ jobs }: JobCardsGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {jobs.slice(0, 8).map(job => (
        <motion.div key={job._id} variants={cardVariants}>
          <JobCard {...job} />
        </motion.div>
      ))}
    </motion.div>
  );
}
