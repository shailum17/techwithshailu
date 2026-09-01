export default function BlogLoading() {
  return (
    <div className="pt-24 min-h-screen pb-20 px-4" style={{ background: '#080808' }}>
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-10 space-y-3">
          <div className="skeleton-dark h-10 w-48 rounded-xl" />
          <div className="skeleton-dark h-5 w-80 rounded" />
        </div>

        {/* Blog card skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Cover image placeholder */}
              <div className="skeleton-dark h-44 w-full" />
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="skeleton-dark h-5 w-16 rounded-full" />
                  <div className="skeleton-dark h-5 w-20 rounded-full" />
                </div>
                <div className="skeleton-dark h-5 w-full rounded" />
                <div className="skeleton-dark h-5 w-3/4 rounded" />
                <div className="space-y-1.5">
                  <div className="skeleton-dark h-3 w-full rounded" />
                  <div className="skeleton-dark h-3 w-5/6 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="skeleton-dark h-4 w-24 rounded" />
                  <div className="skeleton-dark h-4 w-16 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
