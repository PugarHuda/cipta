"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { Sidebar } from "../../../components/Sidebar"
import supabase from "../../../lib/supabase"
import ReputationBadge from "../../../components/ReputationBadge"
import { Bot, TrendingUp, DollarSign, Activity } from "lucide-react"

function botColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  const p = ["#4F6EF7","#10D9A0","#F59E0B","#EF4444","#A78BFA","#EC4899","#06B6D4"]
  return p[Math.abs(h) % p.length]
}

export default function BotsPage() {
  const { address, isConnected } = useAccount()
  const [bots, setBots]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort]     = useState<"earned"|"requests"|"paid">("earned")

  useEffect(() => {
    if (!address) return
    supabase
      .from("top_bots")
      .select("*")
      .eq("creator_wallet", address)
      .order(sort === "earned" ? "total_earned_usd" : sort === "requests" ? "total_requests" : "total_paid", { ascending: false })
      .limit(50)
      .then(({ data }) => { setBots(data || []); setLoading(false) })
  }, [address, sort])

  if (!isConnected) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <ConnectWallet />
    </div>
  )

  const totalEarned   = bots.reduce((s, b) => s + (b.total_earned_usd || 0), 0)
  const totalRequests = bots.reduce((s, b) => s + (b.total_requests || 0), 0)
  const totalPaid     = bots.reduce((s, b) => s + (b.total_paid || 0), 0)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center px-6 h-14"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(11,15,25,0.8)" }}>
          <div>
            <div className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>BOT INTELLIGENCE</div>
            <div className="text-[11px] font-[500]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
              {bots.length} agents tracked
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 fade-up fade-up-1">
            {[
              { label: "TOTAL EARNED", value: `$${totalEarned.toFixed(4)}`, icon: DollarSign, color: "var(--green)", cls: "accent-top-green" },
              { label: "TOTAL REQUESTS", value: totalRequests.toLocaleString(), icon: Activity, color: "var(--amber)", cls: "accent-top-amber" },
              { label: "PAID ACCESS", value: totalPaid.toLocaleString(), icon: TrendingUp, color: "var(--blue)", cls: "accent-top-blue" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-5 ${s.cls}`}
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] tracking-[0.16em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>{s.label}</span>
                  <s.icon size={13} style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-[700]" style={{ color: s.color, fontFamily: "var(--font-data)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden fade-up fade-up-2"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-dim)" }}>
              <span className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>ALL AGENTS</span>
              <div className="flex gap-1">
                {(["earned","requests","paid"] as const).map((s) => (
                  <button key={s} onClick={() => setSort(s)}
                    className="px-2.5 py-1 rounded text-[9px] font-[600] tracking-[0.08em] transition-colors"
                    style={{
                      background: sort === s ? "rgba(79,110,247,0.15)" : "transparent",
                      color: sort === s ? "var(--blue)" : "var(--text-secondary)",
                      fontFamily: "var(--font-data)",
                    }}>
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-5 space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="h-10 rounded loading-shimmer"/>)}</div>
            ) : bots.length === 0 ? (
              <div className="py-16 text-center">
                <Bot size={32} style={{ color: "var(--text-dim)", margin: "0 auto 8px" }} />
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>No bots detected yet. Install the middleware.</div>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border-dim)" }}>
                {/* Header row */}
                <div className="grid px-5 py-2" style={{ gridTemplateColumns: "2rem 1fr 7rem 7rem 7rem 8rem" }}>
                  {["#","AGENT","REQUESTS","PAID","CONVERSION","EARNED"].map((h) => (
                    <div key={h} className="text-[8px] tracking-[0.14em] font-[600]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}>{h}</div>
                  ))}
                </div>

                {bots.map((bot, i) => {
                  const color = botColor(bot.bot_agent)
                  const rate  = bot.total_requests > 0 ? Math.round((bot.total_paid/bot.total_requests)*100) : 0
                  return (
                    <div key={bot.bot_agent}
                      className="grid items-center px-5 py-3 hover:bg-white/[0.02] transition-colors"
                      style={{ gridTemplateColumns: "2rem 1fr 7rem 7rem 7rem 8rem" }}>
                      <span className="text-[9px] font-[600]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}>{String(i+1).padStart(2,"0")}</span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-[700] flex-shrink-0"
                          style={{ background: `${color}20`, color }}>
                          {bot.bot_agent.replace(/Bot|bot|Spider/g,"").slice(0,2).toUpperCase()||"AI"}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-[500]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
                            {bot.bot_agent.split("/")[0]}
                          </span>
                          {bot.erc8004_score != null && (
                            <ReputationBadge score={bot.erc8004_score} agentId={bot.erc8004_agent_id?.slice(0,6)} />
                          )}
                        </div>
                      </div>
                      <span className="text-[11px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}>{bot.total_requests.toLocaleString()}</span>
                      <span className="text-[11px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}>{bot.total_paid}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full" style={{ background: "var(--bg-elevated)" }}>
                          <div className="h-full rounded-full" style={{ width: `${rate}%`, background: rate>50?"var(--green)":"var(--amber)" }}/>
                        </div>
                        <span className="text-[9px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}>{rate}%</span>
                      </div>
                      <span className="text-[11px] font-[600]" style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}>
                        ${parseFloat(bot.total_earned_usd||0).toFixed(4)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
