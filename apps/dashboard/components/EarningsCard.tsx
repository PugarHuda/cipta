"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import type { CreatorEarnings } from "@cipta/middleware"
import { TrendingUp, Activity, DollarSign, Percent } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

function useCountUp(target: number, duration = 900, decimals = 4) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setValue(parseFloat((eased * target).toFixed(decimals)))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, decimals])

  return value
}

const METRICS = [
  {
    key: "total_earned_usd" as const,
    label: "TOTAL EARNED",
    sublabel: "ALL TIME · USDC",
    icon: DollarSign,
    accent: "var(--green)",
    accentClass: "accent-top-green",
    format: (v: number) => `$${v.toFixed(4)}`,
    decimals: 4,
  },
  {
    key: "today_earned_usd" as const,
    label: "TODAY",
    sublabel: "SINCE MIDNIGHT",
    icon: TrendingUp,
    accent: "var(--blue)",
    accentClass: "accent-top-blue",
    format: (v: number) => `$${v.toFixed(4)}`,
    decimals: 4,
  },
  {
    key: "total_requests" as const,
    label: "BOT REQUESTS",
    sublabel: "TOTAL ATTEMPTS",
    icon: Activity,
    accent: "var(--amber)",
    accentClass: "accent-top-amber",
    format: (v: number) => v.toLocaleString(),
    decimals: 0,
  },
  {
    key: "paid_requests" as const,
    label: "PAID ACCESS",
    sublabel: "CONVERSION RATE",
    icon: Percent,
    accent: "var(--purple)",
    accentClass: "accent-top-purple",
    format: (v: number) => v.toLocaleString(),
    decimals: 0,
  },
]

function MetricCard({
  metric,
  value,
  total,
  loading,
}: {
  metric: typeof METRICS[0]
  value: number
  total: number
  loading: boolean
}) {
  const animated = useCountUp(loading ? 0 : value, 900, metric.decimals)
  const Icon = metric.icon
  const payRate = metric.key === "paid_requests" && total > 0
    ? Math.round((value / total) * 100)
    : null

  return (
    <div
      className={`relative rounded-xl p-5 ${metric.accentClass} transition-all duration-300`}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Icon */}
      <div
        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${metric.accent}14` }}
      >
        <Icon size={13} style={{ color: metric.accent }} />
      </div>

      {/* Label */}
      <div
        className="text-[9px] tracking-[0.16em] font-[600] mb-3"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
      >
        {metric.label}
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-9 w-28 rounded-md loading-shimmer mb-2" />
      ) : (
        <div
          className="text-3xl font-[700] leading-none mb-2"
          style={{ color: metric.accent, fontFamily: "var(--font-data)" }}
        >
          {metric.format(animated)}
        </div>
      )}

      {/* Sub */}
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] tracking-[0.1em]"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
        >
          {metric.sublabel}
        </span>
        {payRate !== null && !loading && (
          <span
            className="text-[9px] font-[600] px-1.5 py-0.5 rounded"
            style={{
              background: `${metric.accent}18`,
              color: metric.accent,
              fontFamily: "var(--font-data)",
            }}
          >
            {payRate}%
          </span>
        )}
      </div>
    </div>
  )
}

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

    const channel = supabase
      .channel("earnings_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "access_logs" }, () => {
        fetchEarnings()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [walletAddress])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((metric) => (
        <MetricCard
          key={metric.key}
          metric={metric}
          value={earnings[metric.key] as number}
          total={earnings.total_requests}
          loading={loading}
        />
      ))}
    </div>
  )
}
