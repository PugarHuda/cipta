"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function EmbedCode({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"npm" | "script">("npm")

  const npmCode = `import { cipta } from "cipta"

app.use(cipta({
  wallet: "${walletAddress}",
  priceUSD: 0.001,
  network: "base",
}))`

  const scriptCode = `<script
  src="https://cdn.cipta.xyz/v1/cipta.js"
  data-wallet="${walletAddress}"
  data-price="0.001"
></script>`

  const activeCode = activeTab === "npm" ? npmCode : scriptCode

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-full">
      <h3 className="font-semibold text-white mb-4">Embed Code</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["npm", "script"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#0052FF] text-white"
                : "bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            {tab === "npm" ? "Node.js" : "Script Tag"}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          {activeCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
        >
          {copied
            ? <Check size={14} className="text-green-400" />
            : <Copy size={14} className="text-white/60" />
          }
        </button>
      </div>

      <p className="text-white/30 text-xs mt-3">
        Pasang kode ini di server kamu. AI crawlers akan langsung kena paywall.
      </p>
    </div>
  )
}
