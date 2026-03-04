import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "var(--bg-base)" }}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-[72px] font-[700] leading-none tabular-nums"
          style={{ color: "var(--blue)", fontFamily: "var(--font-data)", opacity: 0.15 }}>
          404
        </div>

        <div>
          <div className="text-[9px] tracking-[0.2em] font-[600] mb-2"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}>NOT FOUND</div>
          <div className="text-sm font-[600]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
            Page not found
          </div>
          <div className="text-[11px] mt-2" style={{ color: "var(--text-secondary)" }}>
            This route doesn&apos;t exist.
          </div>
        </div>

        <Link href="/dashboard"
          className="px-5 py-2 rounded-lg text-[11px] font-[600] tracking-[0.06em] transition-colors"
          style={{ background: "rgba(79,110,247,0.12)", color: "var(--blue)", border: "1px solid rgba(79,110,247,0.25)", fontFamily: "var(--font-data)" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
