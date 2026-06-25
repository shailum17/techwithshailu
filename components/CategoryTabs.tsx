'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: string[];
  active: string;
}

export default function CategoryTabs({ categories, active }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    router.push(`?${params.toString()}`);
  }

  const normalizedActive = active || 'All';

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map(cat => {
        const isActive = normalizedActive === cat;
        return (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className="relative px-4 py-2 text-sm font-medium rounded-full
                       transition-colors duration-200 z-10 focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-lime"
          >
            {isActive && (
              <motion.span
                layoutId="activeTab"
                className="absolute inset-0 rounded-full -z-10"
                style={{ background: '#A8E63D' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {!isActive && (
              <span className="absolute inset-0 rounded-full -z-10 transition-colors"
                    style={{ border: '1px solid #2A2A2A' }} />
            )}
            <span className={isActive ? 'text-black font-semibold' : 'text-ink-muted hover:text-ink'}>
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}
