export default function ResourcesLoading() {
  return (
    <div className="pt-24 min-h-screen pb-20 px-4" style={{ background: '#080808' }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 space-y-3">
          <div className="skeleton-dark h-10 w-64 rounded-xl mx-auto" />
          <div className="skeleton-dark h-5 w-80 rounded mx-auto" />
        </div>

        {/* Resource card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-4"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="skeleton-dark w-12 h-12 rounded-2xl" />
              <div className="space-y-2">
                <div className="skeleton-dark h-5 w-3/4 rounded" />
                <div className="skeleton-dark h-4 w-full rounded" />
                <div className="skeleton-dark h-4 w-5/6 rounded" />
              </div>
              <div className="skeleton-dark h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
