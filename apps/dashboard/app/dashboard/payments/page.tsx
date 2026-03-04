"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { Sidebar } from "../../../components/Sidebar"
import supabase from "../../../lib/supabase"
import ReputationBadge from "../../../components/ReputationBadge"
import { CreditCard, Zap, Coins, ExternalLink } from "lucide-react"

type Log = {
  id: string
  timestamp: string
  bot_agent: string
  payment_type: "x402" | "eth" | "free"
  amount_usd: number
  tx_hash?: string
  erc8004_agent_id?: string
  erc8004_score?: number
  path: string
}

const PAYMENT_META: Record<string, { label: string; color: string; icon: typeof CreditCard }> = {
  x402:  { label: "x402 · USDC", color: "var(--blue)",   icon: CreditCard },
  eth:   { label: "ETH",         color: "var(--purple)", icon: Coins },
  free:  { label: "Whitelist",   color: "var(--green)",  icon: Zap },
}

export default function PaymentsPage() {
  const { address, isConnected } = useAccount()
  const [logs, setLogs]         = useState<Log[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<"all" | "x402" | "eth" | "free">("all")

  useEffect(() => {
    if (!address) return
    let q = supabase
      .from("access_logs")
      .select("id,timestamp,bot_agent,payment_type,amount_usd,tx_hash,erc8004_agent_id,erc8004_score,path")
      .eq("creator_wallet", address)
      .order("timestamp", { ascending: false })
      .limit(100)

    if (filter !== "all") q = q.eq("payment_type", filter)

    q.then(({ data }) => { setLogs(data || []); setLoading(false) })
  }, [address, filter])

  if (!isConnected) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <ConnectWallet />
    </div>
  )

  const totalUSD   = logs.filter(l => l.payment_type !== "free").reduce((s, l) => s + (l.amount_usd || 0), 0)
  const x402Count  = logs.filter(l => l.payment_type === "x402").length
  const ethCount   = logs.filter(l => l.payment_type === "eth").length
  const freeCount  = logs.filter(l => l.payment_type === "free").length

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center px-6 h-14"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(11,15,25,0.8)" }}>
          <div>
            <div className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>PAYMENT LEDGER</div>
            <div className="text-[11px] font-[500]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
              {loading ? "—" : `${logs.length} transactions`}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 fade-up fade-up-1">
            {[
              { label: "TOTAL REVENUE",  value: `$${totalUSD.toFixed(4)}`, color: "var(--green)",  cls: "accent-top-green" },
              { label: "x402 · USDC",    value: x402Count,                 color: "var(--blue)",   cls: "accent-top-blue" },
              { label: "ETH PAYMENTS",   value: ethCount,                  color: "var(--purple)", cls: "accent-top-purple" },
              { label: "WHITELIST FREE", value: freeCount,                 color: "var(--amber)",  cls: "accent-top-amber" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-5 ${s.cls}`}
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <div className="text-[9px] tracking-[0.16em] font-[600] mb-3" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>{s.label}</div>
                <div className="text-2xl font-[700]" style={{ color: s.color, fontFamily: "var(--font-data)" }}>
                  {loading ? "—" : s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden fade-up fade-up-2"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-dim)" }}>
              <span className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>TRANSACTION HISTORY</span>
              <div className="flex gap-1">
                {(["all", "x402", "eth", "free"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-2.5 py-1 rounded text-[9px] font-[600] tracking-[0.08em] transition-colors"
                    style={{
                      background: filter === f ? "rgba(79,110,247,0.15)" : "transparent",
                      color: filter === f ? "var(--blue)" : "var(--text-secondary)",
                      fontFamily: "var(--font-data)",
                    }}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-5 space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="h-10 rounded loading-shimmer"/>)}</div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center">
                <CreditCard size={32} style={{ color: "var(--text-dim)", margin: "0 auto 8px" }} />
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>No transactions yet.</div>
                <div className="text-[10px] mt-1 font-mono" style={{ color: "var(--text-dim)" }}>
                  Install the middleware and start receiving requests.
                </div>
              </div>
            ) : (
              <>
                {/* Header row */}
                <div className="grid px-5 py-2" style={{ gridTemplateColumns: "1fr 8rem 6rem 7rem 8rem 2rem" }}>
                  {["AGENT", "TYPE", "AMOUNT", "ERC-8004", "TIME", ""].map((h) => (
                    <div key={h} className="text-[8px] tracking-[0.14em] font-[600]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}>{h}</div>
                  ))}
                </div>

                <div className="divide-y" style={{ borderColor: "var(--border-dim)" }}>
                  {logs.map((log) => {
                    const meta = PAYMENT_META[log.payment_type] || PAYMENT_META.free
                    const Icon = meta.icon
                    return (
                      <div key={log.id}
                        className="grid items-center px-5 py-3 hover:bg-white/[0.02] transition-colors"
                        style={{ gridTemplateColumns: "1fr 8rem 6rem 7rem 8rem 2rem" }}>
                        <div>
                          <div className="text-[11px] font-[500]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
                            {log.bot_agent?.split("/")[0]}
                          </div>
                          <div className="text-[9px] mt-0.5" style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}>
                            {log.path}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Icon size={10} style={{ color: meta.color, flexShrink: 0 }} />
                          <span className="text-[10px] font-[600]" style={{ color: meta.color, fontFamily: "var(--font-data)" }}>
                            {meta.label}
                          </span>
                        </div>

                        <span className="text-[11px] font-[600]" style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}>
                          {log.payment_type === "free" ? "—" : `$${(log.amount_usd || 0).toFixed(4)}`}
                        </span>

                        <div>
                          {log.erc8004_agent_id && log.erc8004_score != null ? (
                            <ReputationBadge
                              score={log.erc8004_score}
                              agentId={log.erc8004_agent_id.slice(0, 6)}
                            />
                          ) : (
                            <span className="text-[9px]" style={{ color: "var(--text-dim)" }}>—</span>
                          )}
                        </div>

                        <span className="text-[9px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}>
                          {new Date(log.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>

                        <div className="flex justify-end">
                          {log.tx_hash && (
                            <a
                              href={`https://basescan.org/tx/${log.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-40 hover:opacity-100 transition-opacity">
                              <ExternalLink size={11} style={{ color: "var(--text-secondary)" }} />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
