export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Sidebar skeleton */}
      <div className="w-[200px] flex-shrink-0" style={{ borderRight: "1px solid var(--border-subtle)", background: "var(--bg-sidebar)" }} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 flex-shrink-0 loading-shimmer" style={{ borderBottom: "1px solid var(--border-subtle)" }} />
        <div className="flex-1 p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl loading-shimmer" />)}
          </div>
          <div className="h-[420px] rounded-xl loading-shimmer" />
        </div>
      </div>
    </div>
  )
}
