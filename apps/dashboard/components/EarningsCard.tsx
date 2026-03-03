"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { CreatorEarnings } from "@cipta/middleware"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export function EarningsCard({ walletAddress }: { walletAddress: string }) {
  const [earnings, setEarnings] = useState<CreatorEarnings>({
    total_earned_usd: 0,
    today_earned_usd: 0,
    total_requests: 0,
    paid_requests: 0,
    top_bots: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEarnings() {
      const { data } = await supabase
        .from("access_logs")
        .select("status, amount_usd, timestamp")
        .eq("creator_wallet", walletAddress)

      if (!data) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const total_earned_usd = data
        .filter((l) => l.status === "paid")
        .reduce((sum, l) => sum + (l.amount_usd || 0), 0)

      const today_earned_usd = data
        .filter((l) => l.status === "paid" && new Date(l.timestamp) >= today)
        .reduce((sum, l) => sum + (l.amount_usd || 0), 0)

      setEarnings({
        total_earned_usd,
        today_earned_usd,
        total_requests: data.length,
        paid_requests: data.filter((l) => l.status === "paid").length,
        top_bots: [],
      })
      setLoading(false)
    }

    fetchEarnings()

    // Realtime update via Supabase
    const channel = supabase
      .channel("earnings_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "access_logs" }, () => {
        fetchEarnings()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [walletAddress])

  const stats = [
    {
      label: "Total Earned",
      value: `$${earnings.total_earned_usd.toFixed(4)}`,
      sub: "USDC · All time",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      label: "Today",
      value: `$${earnings.today_earned_usd.toFixed(4)}`,
      sub: "USDC · Today",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Bot Requests",
      value: earnings.total_requests.toLocaleString(),
      sub: "Total attempted",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Paid Access",
      value: earnings.paid_requests.toLocaleString(),
      sub: `${earnings.total_requests > 0 ? Math.round((earnings.paid_requests / earnings.total_requests) * 100) : 0}% pay rate`,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`border rounded-xl p-5 ${stat.bg}`}
        >
          <div className="text-white/50 text-sm mb-2">{stat.label}</div>
          <div className={`text-2xl font-bold ${stat.color} ${loading ? "animate-pulse" : ""}`}>
            {loading ? "—" : stat.value}
          </div>
          <div className="text-white/30 text-xs mt-1">{stat.sub}</div>
        </div>
      ))}
    </div>
  )
}
