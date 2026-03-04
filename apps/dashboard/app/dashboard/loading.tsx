export default function DashboardLoading() {
  return (
    <div
      className="flex h-screen"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Sidebar skeleton */}
      <div
        className="w-[200px] flex-shrink-0"
        style={{ background: "var(--bg-sidebar)", borderRight: "1px solid var(--border-subtle)" }}
      />

      <div className="flex-1 flex flex-col">
        {/* Topbar skeleton */}
        <div
          className="h-14 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        />

        {/* Content skeleton */}
        <div className="flex-1 px-6 py-6 space-y-5">
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl loading-shimmer"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>

          {/* Chart row */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 h-64 rounded-xl loading-shimmer" />
            <div className="h-64 rounded-xl loading-shimmer" style={{ animationDelay: "0.1s" }} />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-3 gap-5">
            <div className="h-56 rounded-xl loading-shimmer" />
            <div className="col-span-2 h-56 rounded-xl loading-shimmer" style={{ animationDelay: "0.1s" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
