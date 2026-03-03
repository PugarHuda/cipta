"use client"

import { useEffect, useState } from "react"
import { Target, Shield, AlertTriangle } from "lucide-react"

interface HoneypotSummary {
  total_traps: number
  unique_bots: number
  last_trap: string | null
  erc8004_agents_caught: number
}

interface HoneypotLog {
  id: string
  bot_agent: string
  trap_path: string
  erc8004_agent_id: string | null
  timestamp: string
}

export default function HoneypotCard({ wallet }: { wallet: string }) {
  const [summary, setSummary] = useState<HoneypotSummary | null>(null)
  const [recent, setRecent]   = useState<HoneypotLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wallet) return
    fetch(`/api/honeypot?wallet=${wallet}`)
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary)
        setRecent(data.recent || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [wallet])

  const traps  = summary?.total_traps ?? 0
  const armed  = true // always armed when middleware is active

  if (loading) {
    return (
      <div
        className="rounded-xl p-5 h-full"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="h-5 w-32 rounded loading-shimmer mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg loading-shimmer" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="scanlines rounded-xl overflow-hidden h-full flex flex-col"
      style={{
        background: "linear-gradient(160deg, #120A0A 0%, #0B0F19 100%)",
        border: "1px solid rgba(239,68,68,0.18)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(239,68,68,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <Target size={13} style={{ color: "var(--red)" }} />
          <span
            className="text-[9px] font-[700] tracking-[0.18em]"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
          >
            HONEYPOT
          </span>
        </div>

        {/* Armed badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full threat-pulse"
          style={{
            background: armed ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${armed ? "rgba(239,68,68,0.3)" : "var(--border-subtle)"}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 live-pulse"
            style={{ background: armed ? "var(--red)" : "var(--text-secondary)" }}
          />
          <span
            className="text-[9px] font-[700] tracking-[0.1em]"
            style={{
              color: armed ? "var(--red)" : "var(--text-secondary)",
              fontFamily: "var(--font-data)",
            }}
          >
            {armed ? "ARMED" : "DISARMED"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-0 px-5 py-4" style={{ borderBottom: "1px solid rgba(239,68,68,0.07)" }}>
        {[
          { label: "TRAPPED",   value: traps,                              color: "var(--red)"    },
          { label: "UNIQUE",    value: summary?.unique_bots ?? 0,           color: "var(--amber)"  },
          { label: "ERC-8004",  value: summary?.erc8004_agents_caught ?? 0, color: "var(--purple)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <div
              className="text-2xl font-[700] leading-none"
              style={{ color, fontFamily: "var(--font-data)" }}
            >
              {value}
            </div>
            <div
              className="text-[8px] tracking-[0.12em] mt-1 font-[600]"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Live feed */}
      <div className="flex-1 px-5 py-3 flex flex-col">
        <div
          className="text-[8px] tracking-[0.2em] font-[600] mb-2"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}
        >
          RECENT CAPTURES
        </div>

        {recent.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
            <Shield size={20} style={{ color: "rgba(239,68,68,0.25)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
              No bots trapped yet
            </span>
            <div
              className="text-[9px] px-3 py-1.5 rounded font-[500] text-center leading-relaxed"
              style={{ background: "rgba(239,68,68,0.06)", color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}
            >
              Disallow: /cipta-trap/
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 overflow-y-auto max-h-44">
            {recent.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}
              >
                <AlertTriangle size={9} style={{ color: "var(--amber)", flexShrink: 0 }} />
                <span
                  className="text-[10px] font-[500] flex-1 truncate"
                  style={{ color: "var(--amber)", fontFamily: "var(--font-data)" }}
                >
                  {log.bot_agent.split("/")[0]}
                </span>
                {log.erc8004_agent_id && (
                  <span
                    className="text-[8px] px-1 py-0.5 rounded flex-shrink-0"
                    style={{ background: "rgba(167,139,250,0.1)", color: "var(--purple)", fontFamily: "var(--font-data)" }}
                  >
                    ERC-8004
                  </span>
                )}
                <span
                  className="text-[9px] flex-shrink-0"
                  style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
                >
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
