export default function AIToolsLoading() {
  return (
    <div className="pt-24 min-h-screen pb-20 px-4" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 space-y-3">
          <div className="skeleton-dark h-10 w-72 rounded-xl mx-auto" />
          <div className="skeleton-dark h-5 w-96 rounded mx-auto" />
        </div>

        {/* Category tabs skeleton */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {[80, 70, 90, 100, 85, 75, 95].map((w, i) => (
            <div key={i} className="skeleton-dark h-9 rounded-full flex-shrink-0" style={{ width: w }} />
          ))}
        </div>

        {/* Tool card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="skeleton-dark w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton-dark h-4 w-3/4 rounded" />
                  <div className="flex gap-1.5">
                    <div className="skeleton-dark h-4 w-14 rounded-full" />
                    <div className="skeleton-dark h-4 w-10 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="skeleton-dark h-3 w-full rounded" />
                <div className="skeleton-dark h-3 w-4/5 rounded" />
              </div>
              <div className="skeleton-dark h-8 w-full rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
