"use client"

import { useEffect, useState } from "react"
import supabase from "../lib/supabase"
import { useRefreshTick } from "../context/RealtimeContext"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts"


function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2.5 rounded-lg"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-medium)",
        fontFamily: "var(--font-data)",
      }}
    >
      <div className="text-[9px] tracking-[0.12em] mb-1" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
      <div className="text-sm font-[600]" style={{ color: "var(--green)" }}>
        {`$${(payload[0].value as number).toFixed(4)}`}
        <span className="text-[9px] ml-1 font-[400]" style={{ color: "var(--text-secondary)" }}>USDC</span>
      </div>
    </div>
  )
}

export function EarningsChart({ walletAddress }: { walletAddress: string }) {
  const [data, setData] = useState<{ date: string; earned: number }[]>([])
  const [loading, setLoading] = useState(true)
  const tick = useRefreshTick()
  const maxEarned = data.length ? Math.max(...data.map((d) => d.earned)) : 0

  useEffect(() => {
    async function fetchChartData() {
      const { data: logs } = await supabase
        .from("daily_earnings")
        .select("date, earned_usd")
        .eq("creator_wallet", walletAddress)
        .order("date", { ascending: true })
        .limit(30)

      if (logs) {
        setData(
          logs.map((l) => ({
            date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            earned: parseFloat(l.earned_usd) || 0,
          }))
        )
      }
      setLoading(false)
    }
    fetchChartData()
  }, [walletAddress, tick])

  return (
    <div
      className="rounded-xl p-5 h-full"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div
            className="text-[9px] tracking-[0.18em] font-[600] mb-1"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
          >
            EARNINGS_30D
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-[700]"
              style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}
            >
              ${data.reduce((s, d) => s + d.earned, 0).toFixed(4)}
            </span>
            <span
              className="text-[10px] tracking-[0.06em]"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
            >
              USDC TOTAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full dot-green live-pulse" />
          <span
            className="text-[9px] tracking-[0.12em] font-[600]"
            style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-44 rounded-lg loading-shimmer" />
      ) : data.length === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center gap-2">
          <div className="text-[10px] tracking-[0.14em]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
          >
            NO_DATA
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Install the middleware to start tracking
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#10D9A0" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#10D9A0" stopOpacity={0}    />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="0"
              stroke="rgba(255,255,255,0.03)"
              horizontal={true}
              vertical={false}
            />

            {maxEarned > 0 && (
              <ReferenceLine
                y={maxEarned}
                stroke="rgba(16,217,160,0.15)"
                strokeDasharray="3 3"
              />
            )}

            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-secondary)", fontSize: 9, fontFamily: "var(--font-data)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 9, fontFamily: "var(--font-data)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(16,217,160,0.2)", strokeWidth: 1 }} />

            <Area
              type="monotone"
              dataKey="earned"
              stroke="#10D9A0"
              strokeWidth={1.5}
              fill="url(#greenGrad)"
              dot={false}
              activeDot={{ r: 3, fill: "#10D9A0", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
