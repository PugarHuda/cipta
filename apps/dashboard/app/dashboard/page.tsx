"use client"

import { useAccount } from "wagmi"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { Sidebar } from "../../components/Sidebar"
import { EarningsCard } from "../../components/EarningsCard"
import { BotActivityTable } from "../../components/BotActivityTable"
import { EarningsChart } from "../../components/EarningsChart"
import { EmbedCode } from "../../components/EmbedCode"
import HoneypotCard from "../../components/HoneypotCard"
import { RealtimeProvider } from "../../context/RealtimeContext"
import { Wifi, Zap } from "lucide-react"
import { useState } from "react"

function truncate(addr: string) {
  return `${addr.slice(0, 6)}···${addr.slice(-4)}`
}

const DEMO_SERVER = process.env.NEXT_PUBLIC_DEMO_SERVER_URL || "https://cipta-demo.railway.app"
const BOT_UAS = ["GPTBot/1.0", "ClaudeBot/1.0", "PerplexityBot/1.0", "Bytespider"]

async function simulateBot(wallet: string) {
  const ua = BOT_UAS[Math.floor(Math.random() * BOT_UAS.length)]
  try {
    await fetch(`${DEMO_SERVER}/content/artikel-defi-2026`, {
      headers: { "User-Agent": ua, "X-Creator-Wallet": wallet },
      mode: "no-cors",
    })
  } catch { /* no-cors, expected */ }
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [simulating, setSimulating] = useState(false)

  async function handleSimulate() {
    if (!address || simulating) return
    setSimulating(true)
    await simulateBot(address)
    setTimeout(() => setSimulating(false), 2000)
  }

  if (!isConnected) {
    return (
      <div
        className="min-h-screen flex items-center justify-center grid-bg"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(79,110,247,0.06) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div className="relative text-center fade-up">
          {/* Logo mark */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #4F6EF7 0%, #10D9A0 100%)",
              boxShadow: "0 0 40px rgba(79,110,247,0.3)",
            }}
          >
            <span className="text-2xl font-[800]" style={{ fontFamily: "var(--font-ui)" }}>C</span>
          </div>

          {/* Wordmark */}
          <div className="mb-1 text-[11px] tracking-[0.25em] font-[600]"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
          >
            INTELLIGENCE TERMINAL
          </div>
          <h1 className="text-3xl font-[800] mb-2" style={{ fontFamily: "var(--font-ui)" }}>
            Cipta
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Connect wallet to access your creator dashboard
          </p>

          {/* Stats teaser */}
          <div className="flex gap-6 justify-center mb-8 text-center">
            {[
              { label: "Bots Blocked", value: "15+" },
              { label: "Networks", value: "Base" },
              { label: "Protocol", value: "x402" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl font-[700] font-data" style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}>{s.value}</div>
                <div className="text-[10px] tracking-[0.1em]" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <ConnectWallet />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-6 h-14"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(11,15,25,0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div>
            <div className="text-[10px] tracking-[0.15em] mb-0.5"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
            >
              CREATOR DASHBOARD
            </div>
            <div className="text-[11px] font-[500]"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}
            >
              {truncate(address!)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulate bot button */}
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-[600] tracking-[0.06em] transition-all"
              style={{
                background: simulating ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.07)",
                border: `1px solid rgba(245,158,11,${simulating ? "0.4" : "0.2"})`,
                color: "var(--amber)",
                fontFamily: "var(--font-data)",
                cursor: simulating ? "wait" : "pointer",
              }}
              title="Kirim request bot ke demo server — cocok untuk demo"
            >
              <Zap size={10} />
              {simulating ? "SENDING…" : "SIMULATE BOT"}
            </button>

            {/* Network badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-[600] tracking-[0.06em]"
              style={{
                background: "rgba(16,217,160,0.07)",
                border: "1px solid rgba(16,217,160,0.2)",
                color: "var(--green)",
                fontFamily: "var(--font-data)",
              }}
            >
              <Wifi size={10} />
              BASE SEPOLIA
            </div>
            <ConnectWallet />
          </div>
        </header>

        {/* Main scroll area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <RealtimeProvider>

          {/* Row 1 — KPI Cards */}
          <div className="fade-up fade-up-1">
            <EarningsCard walletAddress={address!} />
          </div>

          {/* Row 2 — Chart + Embed */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 fade-up fade-up-2">
            <div className="xl:col-span-2">
              <EarningsChart walletAddress={address!} />
            </div>
            <div>
              <EmbedCode walletAddress={address!} />
            </div>
          </div>

          {/* Row 3 — Honeypot + Bot feed */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 fade-up fade-up-3">
            <div>
              <HoneypotCard wallet={address!} />
            </div>
            <div className="xl:col-span-2">
              <BotActivityTable walletAddress={address!} />
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </RealtimeProvider>
        </main>
      </div>
    </div>
  )
}
