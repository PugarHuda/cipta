"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { Sidebar } from "../../../components/Sidebar"
import { Target, AlertTriangle, Shield } from "lucide-react"

export default function HoneypotPage() {
  const { address, isConnected } = useAccount()
  const [summary, setSummary] = useState<any>(null)
  const [logs, setLogs]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address) return
    fetch(`/api/honeypot?wallet=${address}`)
      .then(r => r.json())
      .then(d => { setSummary(d.summary); setLogs(d.recent || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [address])

  if (!isConnected) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <ConnectWallet />
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center px-6 h-14"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(11,15,25,0.8)" }}>
          <div className="flex items-center gap-2">
            <Target size={13} style={{ color: "var(--red)" }} />
            <div>
              <div className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>HONEYPOT TRAP</div>
              <div className="text-[11px] font-[500]" style={{ color: "var(--red)", fontFamily: "var(--font-data)" }}>ARMED · /cipta-trap/*</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 fade-up fade-up-1">
            {[
              { label: "TOTAL TRAPPED", value: summary?.total_traps ?? 0, color: "var(--red)" },
              { label: "UNIQUE BOTS",   value: summary?.unique_bots ?? 0, color: "var(--amber)" },
              { label: "ERC-8004 AGENTS", value: summary?.erc8004_agents_caught ?? 0, color: "var(--purple)" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-5"
                style={{ background: "linear-gradient(160deg,#120A0A,#0B0F19)", border: "1px solid rgba(239,68,68,0.18)" }}>
                <div className="text-[9px] tracking-[0.16em] font-[600] mb-3" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>{s.label}</div>
                <div className="text-3xl font-[700]" style={{ color: s.color, fontFamily: "var(--font-data)" }}>
                  {loading ? "—" : s.value}
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="rounded-xl p-5 fade-up fade-up-2"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="text-[9px] tracking-[0.18em] font-[600] mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>HOW HONEYPOT WORKS</div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: "01", title: "robots.txt Disallow", desc: "Compliant bots read robots.txt and avoid /cipta-trap/", icon: Shield },
                { step: "02", title: "Scraper Visits Trap", desc: "Disobedient scrapers that ignore robots.txt visit the path", icon: AlertTriangle },
                { step: "03", title: "Negative ERC-8004", desc: "Bot gets negative reputation on-chain — future requests cost more", icon: Target },
              ].map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="flex gap-3">
                  <div className="text-[11px] font-[700] w-6 flex-shrink-0 mt-0.5" style={{ color: "var(--red)", fontFamily: "var(--font-data)" }}>{step}</div>
                  <div>
                    <div className="text-[11px] font-[600] mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>{title}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trap log */}
          <div className="rounded-xl overflow-hidden fade-up fade-up-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border-dim)" }}>
              <span className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>CAPTURE LOG</span>
            </div>
            {loading ? (
              <div className="p-5 space-y-2">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded loading-shimmer"/>)}</div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center">
                <Shield size={32} style={{ color: "var(--text-dim)", margin: "0 auto 8px" }} />
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>No captures yet.</div>
                <div className="text-[10px] mt-1 font-mono" style={{ color: "var(--text-dim)" }}>
                  Add to robots.txt: Disallow: /cipta-trap/
                </div>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border-dim)" }}>
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                    <AlertTriangle size={11} style={{ color: "var(--amber)", flexShrink: 0 }} />
                    <span className="flex-1 text-[11px] font-[500]" style={{ color: "var(--amber)", fontFamily: "var(--font-data)" }}>
                      {log.bot_agent?.split("/")[0]}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}>{log.trap_path}</span>
                    {log.erc8004_agent_id && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(167,139,250,0.1)", color: "var(--purple)", fontFamily: "var(--font-data)" }}>ERC-8004</span>
                    )}
                    <span className="text-[9px] w-14 text-right" style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
