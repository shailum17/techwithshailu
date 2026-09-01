export default function BlogPostLoading() {
  return (
    <div className="pt-20 pb-20 min-h-screen" style={{ background: '#080808' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="skeleton-dark h-4 w-12 rounded" />
          <div className="skeleton-dark h-3 w-2 rounded" />
          <div className="skeleton-dark h-4 w-10 rounded" />
          <div className="skeleton-dark h-3 w-2 rounded" />
          <div className="skeleton-dark h-4 w-40 rounded" />
        </div>

        {/* Post header */}
        <div className="mb-8 space-y-4">
          <div className="skeleton-dark h-6 w-20 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton-dark h-8 w-full rounded-lg" />
            <div className="skeleton-dark h-8 w-3/4 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton-dark h-4 w-28 rounded" />
            <div className="skeleton-dark h-4 w-24 rounded" />
            <div className="skeleton-dark h-4 w-16 rounded" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="rounded-2xl p-6 md:p-8 mb-8 space-y-3"
          style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="skeleton-dark h-4 rounded"
              style={{ width: i % 5 === 4 ? '60%' : i % 3 === 2 ? '80%' : '100%' }} />
          ))}
        </div>

        {/* CTA skeleton */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="skeleton-dark h-4 w-72 rounded mx-auto" />
          <div className="flex gap-3 justify-center">
            <div className="skeleton-dark h-10 w-32 rounded-xl" />
            <div className="skeleton-dark h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
