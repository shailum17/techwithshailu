export default function JobDetailLoading() {
  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#080808' }}>
      {/* Company banner skeleton */}
      <div className="skeleton-dark h-48 w-full mb-8" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="skeleton-dark h-7 w-3/4 rounded-lg" />
              <div className="skeleton-dark h-4 w-1/2 rounded" />
              <div className="flex gap-2 flex-wrap pt-1">
                {[80, 90, 70, 100].map((w, i) => (
                  <div key={i} className="skeleton-dark h-6 rounded-full" style={{ width: w }} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-3"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="skeleton-dark h-5 w-40 rounded mb-4" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-dark h-4 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl p-5 space-y-3"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="skeleton-dark h-11 w-full rounded-xl" />
              <div className="skeleton-dark h-4 w-2/3 rounded mx-auto" />
            </div>
            <div className="rounded-2xl p-5 space-y-3"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="skeleton-dark h-4 w-1/3 rounded" />
                  <div className="skeleton-dark h-4 w-2/5 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
