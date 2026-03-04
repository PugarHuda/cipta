"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "var(--bg-base)" }}>
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={22} style={{ color: "var(--red)" }} />
        </div>

        <div>
          <div className="text-[9px] tracking-[0.2em] font-[600] mb-2"
            style={{ color: "var(--red)", fontFamily: "var(--font-ui)" }}>RUNTIME ERROR</div>
          <div className="text-sm font-[600]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
            Something went wrong
          </div>
          <div className="text-[11px] mt-2" style={{ color: "var(--text-secondary)" }}>
            {error.message || "An unexpected error occurred."}
          </div>
          {error.digest && (
            <div className="text-[9px] mt-2 font-mono px-3 py-1.5 rounded"
              style={{ background: "var(--bg-elevated)", color: "var(--text-dim)" }}>
              Digest: {error.digest}
            </div>
          )}
        </div>

        <button onClick={reset}
          className="px-5 py-2 rounded-lg text-[11px] font-[600] tracking-[0.06em] transition-colors"
          style={{ background: "rgba(79,110,247,0.12)", color: "var(--blue)", border: "1px solid rgba(79,110,247,0.25)", fontFamily: "var(--font-data)" }}>
          Try again
        </button>
      </div>
    </div>
  )
}
