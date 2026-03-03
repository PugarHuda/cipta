"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { BotStats } from "@cipta/middleware"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  attempted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  whitelisted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  blocked: "bg-red-500/10 text-red-400 border-red-500/20",
}

export function BotActivityTable({ walletAddress }: { walletAddress: string }) {
  const [bots, setBots] = useState<BotStats[]>([])
  const [recentLogs, setRecentLogs] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const [botsRes, logsRes] = await Promise.all([
        supabase
          .from("top_bots")
          .select("*")
          .eq("creator_wallet", walletAddress)
          .limit(10),
        supabase
          .from("access_logs")
          .select("*")
          .eq("creator_wallet", walletAddress)
          .order("timestamp", { ascending: false })
          .limit(20),
      ])

      if (botsRes.data) setBots(botsRes.data)
      if (logsRes.data) setRecentLogs(logsRes.data)
    }

    fetchData()

    const channel = supabase
      .channel("bot_activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "access_logs" }, () => {
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [walletAddress])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Bots */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Top AI Bots</h3>
        {bots.length === 0 ? (
          <div className="text-white/30 text-sm py-8 text-center">
            Belum ada data. Pasang embed code dulu.
          </div>
        ) : (
          <div className="space-y-3">
            {bots.map((bot) => (
              <div key={bot.bot_agent} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{bot.bot_agent}</div>
                  <div className="text-xs text-white/40">
                    {bot.total_requests} requests · {bot.total_paid} paid
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-400">
                    ${bot.total_earned_usd.toFixed(4)}
                  </div>
                  <div className="text-xs text-white/30">earned</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
        {recentLogs.length === 0 ? (
          <div className="text-white/30 text-sm py-8 text-center">
            Belum ada aktivitas bot.
          </div>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${STATUS_STYLES[log.status] || ""}`}
                  >
                    {log.status}
                  </span>
                  <span className="text-white/50 truncate">{log.bot_agent}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {log.amount_usd && (
                    <span className="text-green-400 font-medium">
                      +${log.amount_usd}
                    </span>
                  )}
                  <span className="text-white/20 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
