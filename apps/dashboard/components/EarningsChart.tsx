"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export function EarningsChart({ walletAddress }: { walletAddress: string }) {
  const [data, setData] = useState<{ date: string; earned: number }[]>([])

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
            date: new Date(l.date).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
            earned: parseFloat(l.earned_usd) || 0,
          }))
        )
      }
    }

    fetchChartData()
  }, [walletAddress])

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-6">Earnings — 30 Hari Terakhir</h3>
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-white/30 text-sm">
          Belum ada data earnings. Pasang middleware dulu.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: "#ffffff30", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#ffffff30", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #ffffff20", borderRadius: 8 }}
              labelStyle={{ color: "#ffffff80" }}
              formatter={(v: number | undefined) => v !== undefined ? [`$${v.toFixed(4)} USDC`, "Earned"] : ["$0 USDC", "Earned"]}
            />
            <Area
              type="monotone"
              dataKey="earned"
              stroke="#0052FF"
              strokeWidth={2}
              fill="url(#earnGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
