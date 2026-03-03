"use client"

import { useAccount } from "wagmi"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { EarningsCard } from "../../components/EarningsCard"
import { BotActivityTable } from "../../components/BotActivityTable"
import { EarningsChart } from "../../components/EarningsChart"
import { EmbedCode } from "../../components/EmbedCode"
import HoneypotCard from "../../components/HoneypotCard"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0052FF] rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-6">
            C
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Cipta Dashboard</h1>
          <p className="text-white/50 mb-8">Connect wallet untuk lihat earnings kamu</p>
          <ConnectWallet />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center font-bold text-sm">
            C
          </div>
          <span className="font-bold text-lg">Cipta</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Protected · Base Sepolia
          </div>
          <ConnectWallet />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Earnings cards */}
        <EarningsCard walletAddress={address!} />

        {/* Chart + Embed Code */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EarningsChart walletAddress={address!} />
          </div>
          <div>
            <EmbedCode walletAddress={address!} />
          </div>
        </div>

        {/* Honeypot + Bot activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <HoneypotCard wallet={address!} />
          </div>
          <div className="lg:col-span-2">
            <BotActivityTable walletAddress={address!} />
          </div>
        </div>
      </main>
    </div>
  )
}
