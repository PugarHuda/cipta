"use client"

import { useEffect, useState } from "react"
import supabase from "../lib/supabase"
import { useRefreshTick } from "../context/RealtimeContext"
import type { BotStats } from "../lib/types"

// Deterministic color per bot name
function botColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  const palette = ["#4F6EF7", "#10D9A0", "#F59E0B", "#EF4444", "#A78BFA", "#EC4899", "#06B6D4"]
  return palette[Math.abs(h) % palette.length]
}

function botInitials(name: string): string {
  return name.replace(/Bot|bot|Spider|Crawler/g, "").slice(0, 2).toUpperCase() || "AI"
}

const STATUS_DOT: Record<string, string> = {
  paid:        "dot-green",
  attempted:   "dot-amber",
  whitelisted: "dot-blue",
  blocked:     "dot-red",
  honeypot:    "dot-red",
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  paid:        { label: "PAID",       color: "var(--green)" },
  attempted:   { label: "ATTEMPT",    color: "var(--amber)" },
  whitelisted: { label: "FREE",       color: "var(--blue)"  },
  blocked:     { label: "BLOCKED",    color: "var(--red)"   },
  honeypot:    { label: "HONEYPOT",   color: "var(--red)"   },
}

export function BotActivityTable({ walletAddress }: { walletAddress: string }) {
  const [bots, setBots]           = useState<BotStats[]>([])
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const tick = useRefreshTick()

  useEffect(() => {
    async function fetchData() {
      const [botsRes, logsRes] = await Promise.all([
        supabase
          .from("top_bots")
          .select("*")
          .eq("creator_wallet", walletAddress)
          .limit(8),
        supabase
          .from("access_logs")
          .select("*")
          .eq("creator_wallet", walletAddress)
          .order("timestamp", { ascending: false })
          .limit(15),
      ])
      if (botsRes.data) setBots(botsRes.data)
      if (logsRes.data) setRecentLogs(logsRes.data)
      setLoading(false)
    }

    fetchData()

  }, [walletAddress, tick])

  const maxEarned = bots.length ? Math.max(...bots.map((b) => b.total_earned_usd)) : 1

  return (
    <div
      className="rounded-xl overflow-hidden h-full"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border-dim)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] font-[600] tracking-[0.18em]"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
          >
            BOT INTELLIGENCE
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-[600]"
            style={{
              background: "rgba(79,110,247,0.1)",
              color: "var(--blue)",
              fontFamily: "var(--font-data)",
            }}
          >
            {bots.length} AGENTS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full dot-green live-pulse" />
          <span
            className="text-[9px] tracking-[0.1em]"
            style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}
          >
            REALTIME
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x" style={{ borderColor: "var(--border-dim)" }}>
        {/* ── Left: Top Bots leaderboard ────────────── */}
        <div className="p-4">
          <div
            className="text-[8px] tracking-[0.2em] font-[600] mb-3"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}
          >
            TOP AGENTS BY EARNINGS
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg loading-shimmer" />
              ))}
            </div>
          ) : bots.length === 0 ? (
            <div className="py-10 text-center">
              <div
                className="text-[10px] tracking-[0.12em] mb-1"
                style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
              >
                NO_DATA
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Install the middleware to start tracking
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {bots.map((bot, i) => {
                const color  = botColor(bot.bot_agent)
                const initials = botInitials(bot.bot_agent)
                const barPct = maxEarned > 0 ? (bot.total_earned_usd / maxEarned) * 100 : 0

                return (
                  <div key={bot.bot_agent} className="group relative">
                    {/* Earning bar background */}
                    <div
                      className="absolute inset-0 rounded-lg transition-all duration-500"
                      style={{ background: `${color}07`, width: `${barPct}%` }}
                    />

                    <div className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
                      {/* Rank */}
                      <span
                        className="w-4 text-[9px] font-[600] flex-shrink-0"
                        style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Avatar */}
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-[700]"
                        style={{ background: `${color}20`, color }}
                      >
                        {initials}
                      </div>

                      {/* Name + stats */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[11px] font-[600] truncate"
                          style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}
                        >
                          {bot.bot_agent.split("/")[0]}
                        </div>
                        <div
                          className="text-[9px]"
                          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
                        >
                          {bot.total_requests} req · {bot.total_paid} paid
                        </div>
                      </div>

                      {/* Earnings */}
                      <div
                        className="text-[11px] font-[600] flex-shrink-0"
                        style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}
                      >
                        ${bot.total_earned_usd.toFixed(4)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Right: Live activity feed ──────────────── */}
        <div className="p-4">
          <div
            className="text-[8px] tracking-[0.2em] font-[600] mb-3"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}
          >
            LIVE ACTIVITY FEED
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 rounded loading-shimmer" />
              ))}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="py-10 text-center">
              <div
                className="text-[10px] tracking-[0.12em] mb-1"
                style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
              >
                AWAITING_SIGNAL
              </div>
            </div>
          ) : (
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {recentLogs.map((log) => {
                const st  = STATUS_LABEL[log.status] || { label: log.status, color: "var(--text-secondary)" }
                const dot = STATUS_DOT[log.status] || "dot-muted"
                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    {/* Status dot */}
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />

                    {/* Status badge */}
                    <span
                      className="text-[8px] font-[700] tracking-[0.08em] w-14 flex-shrink-0"
                      style={{ color: st.color, fontFamily: "var(--font-data)" }}
                    >
                      {st.label}
                    </span>

                    {/* Bot name */}
                    <span
                      className="text-[10px] flex-1 truncate"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}
                    >
                      {log.bot_agent?.split("/")[0] ?? "unknown"}
                    </span>

                    {/* Amount */}
                    {log.amount_usd ? (
                      <span
                        className="text-[10px] font-[600] flex-shrink-0"
                        style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}
                      >
                        +${parseFloat(log.amount_usd).toFixed(4)}
                      </span>
                    ) : null}

                    {/* Time */}
                    <span
                      className="text-[9px] flex-shrink-0 w-12 text-right"
                      style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
