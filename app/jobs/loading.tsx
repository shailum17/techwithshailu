export default function JobsLoading() {
  return (
    <div className="pt-24 min-h-screen pb-20 px-4" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page heading skeleton */}
        <div className="mb-8">
          <div className="skeleton-dark h-8 w-64 rounded-lg mb-3" />
          <div className="skeleton-dark h-4 w-48 rounded" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[140, 110, 120, 100, 130].map((w, i) => (
            <div key={i} className="skeleton-dark h-9 rounded-xl" style={{ width: w }} />
          ))}
        </div>

        {/* Job card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start gap-3">
                <div className="skeleton-dark w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton-dark h-4 w-3/4 rounded" />
                  <div className="skeleton-dark h-3 w-1/2 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="skeleton-dark h-5 w-16 rounded-full" />
                <div className="skeleton-dark h-5 w-20 rounded-full" />
              </div>
              <div className="skeleton-dark h-3 w-1/3 rounded" />
              <div className="border-t border-white/[0.05] pt-3 flex gap-2">
                <div className="skeleton-dark h-5 w-12 rounded-md" />
                <div className="skeleton-dark h-5 w-14 rounded-md" />
                <div className="skeleton-dark h-5 w-10 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
