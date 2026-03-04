"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { Sidebar } from "../../../components/Sidebar"
import { Copy, Check, Settings2, Code2, Globe } from "lucide-react"

const TABS = ["Node.js", "WordPress", "Static HTML", "Vercel Edge"] as const
type Tab = typeof TABS[number]

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return { copied, copy }
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const { copied, copy } = useCopy()
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: "#0D1117", border: "1px solid var(--border-dim)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--border-dim)", background: "rgba(255,255,255,0.02)" }}>
        <span className="text-[9px] font-[600] tracking-[0.12em]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}>{lang}</span>
        <button onClick={() => copy(code)}
          className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
          style={{ color: copied ? "var(--green)" : "var(--text-secondary)", fontFamily: "var(--font-data)" }}>
          {copied ? <Check size={10} /> : <Copy size={10} />}
          <span className="text-[9px]">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 text-[11px] overflow-x-auto leading-relaxed" style={{ color: "#E6EDF3", fontFamily: "var(--font-data)" }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function getSnippets(wallet: string): Record<Tab, string> {
  return {
    "Node.js": `import express from "express"
import { cipta } from "@cipta/middleware"

const app = express()

app.use(cipta({
  wallet: "${wallet || "0xYOUR_WALLET"}",
  priceUSD: 0.001,          // per request
  network: "base-sepolia",  // or "base"
  erc8004: true,            // reputation discounts
  ethPayment: true,         // accept ETH too
  whitelist: [],            // free-access agents
}))

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello, paying agent!" })
})

app.listen(3000)`,

    "WordPress": `<?php
// In functions.php or a plugin file
add_action("init", function() {
  if (strpos($_SERVER["REQUEST_URI"], "/api/") === 0) {
    $wallet  = "${wallet || "0xYOUR_WALLET"}";
    $price   = "0.001";
    $network = "base-sepolia";

    // Redirect to Node.js middleware proxy
    header("X-Cipta-Wallet: " . $wallet);
    header("X-Cipta-Price: " . $price);
  }
});`,

    "Static HTML": `<!-- 1x1 tracking pixel — add to <body> -->
<img src="https://YOUR_DEMO.railway.app/api/pixel/${wallet || "0xYOUR_WALLET"}"
     width="1" height="1" alt=""
     style="position:absolute;opacity:0;pointer-events:none" />

<!-- Beacon script -->
<script>
  fetch("https://YOUR_DEMO.railway.app/api/beacon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet: "${wallet || "0xYOUR_WALLET"}",
      page: window.location.pathname,
      ua: navigator.userAgent
    })
  }).catch(() => {})
</script>`,

    "Vercel Edge": `// middleware.ts (Next.js Edge Runtime)
import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: ["/api/:path*"],
}

export async function middleware(req: NextRequest) {
  const res = await fetch("https://YOUR_DEMO.railway.app/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...Object.fromEntries(req.headers),
    },
    body: JSON.stringify({
      wallet: "${wallet || "0xYOUR_WALLET"}",
      path: req.nextUrl.pathname,
    }),
  })

  if (!res.ok) return new NextResponse(null, { status: 402 })
  return NextResponse.next()
}`,
  }
}

export default function SettingsPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<Tab>("Node.js")
  const { copied: walletCopied, copy: copyWallet } = useCopy()

  if (!isConnected) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <ConnectWallet />
    </div>
  )

  const snippets = getSnippets(address || "")

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center px-6 h-14"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(11,15,25,0.8)" }}>
          <div className="flex items-center gap-2">
            <Settings2 size={13} style={{ color: "var(--text-secondary)" }} />
            <div>
              <div className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>SETTINGS</div>
              <div className="text-[11px] font-[500]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>Integration &amp; Configuration</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Wallet info */}
          <div className="rounded-xl p-5 fade-up fade-up-1 accent-top-blue"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="text-[9px] tracking-[0.18em] font-[600] mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>YOUR CREATOR WALLET</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-lg font-mono text-[12px]"
                style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-dim)" }}>
                {address}
              </div>
              <button onClick={() => copyWallet(address || "")}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-[10px] font-[600] transition-colors"
                style={{
                  background: walletCopied ? "rgba(16,217,160,0.12)" : "var(--bg-elevated)",
                  color: walletCopied ? "var(--green)" : "var(--text-secondary)",
                  border: `1px solid ${walletCopied ? "rgba(16,217,160,0.3)" : "var(--border-dim)"}`,
                  fontFamily: "var(--font-data)",
                }}>
                {walletCopied ? <Check size={11} /> : <Copy size={11} />}
                {walletCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="mt-3 text-[10px]" style={{ color: "var(--text-dim)" }}>
              This is the wallet that receives USDC and ETH payments from AI agents.
            </div>
          </div>

          {/* Pricing info */}
          <div className="rounded-xl p-5 fade-up fade-up-2"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="text-[9px] tracking-[0.18em] font-[600] mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>ERC-8004 REPUTATION DISCOUNTS</div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { tier: "Score ≥ 90", label: "TRUSTED", discount: "−40%", color: "var(--green)", bg: "rgba(16,217,160,0.08)" },
                { tier: "Score ≥ 75", label: "VERIFIED", discount: "−20%", color: "var(--blue)",  bg: "rgba(79,110,247,0.08)" },
                { tier: "Score < 75", label: "UNKNOWN",  discount: "0%",   color: "var(--text-secondary)", bg: "rgba(255,255,255,0.04)" },
              ].map((t) => (
                <div key={t.tier} className="rounded-lg p-4" style={{ background: t.bg, border: `1px solid ${t.color}30` }}>
                  <div className="text-[10px] font-[700] mb-1" style={{ color: t.color, fontFamily: "var(--font-data)" }}>{t.tier}</div>
                  <div className="text-[9px] mb-2" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>{t.label}</div>
                  <div className="text-xl font-[700]" style={{ color: t.color, fontFamily: "var(--font-data)" }}>{t.discount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Embed code */}
          <div className="rounded-xl overflow-hidden fade-up fade-up-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-dim)" }}>
              <div className="flex items-center gap-2">
                <Code2 size={12} style={{ color: "var(--text-secondary)" }} />
                <span className="text-[9px] tracking-[0.18em] font-[600]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>INTEGRATION CODE</span>
              </div>
              <div className="flex gap-1">
                {TABS.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="px-2.5 py-1 rounded text-[9px] font-[600] tracking-[0.06em] transition-colors"
                    style={{
                      background: activeTab === tab ? "rgba(79,110,247,0.15)" : "transparent",
                      color: activeTab === tab ? "var(--blue)" : "var(--text-secondary)",
                      fontFamily: "var(--font-data)",
                    }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              <CodeBlock code={snippets[activeTab]} lang={activeTab} />
            </div>
          </div>

          {/* Links */}
          <div className="rounded-xl p-5 fade-up fade-up-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="text-[9px] tracking-[0.18em] font-[600] mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>RESOURCES</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "npm: @cipta/middleware", href: "https://www.npmjs.com/package/@cipta/middleware", desc: "Install the middleware package" },
                { label: "ERC-8004 Standard", href: "https://eips.ethereum.org/EIPS/eip-8004", desc: "Trustless AI Agent Identity Standard" },
                { label: "x402 Protocol", href: "https://x402.org", desc: "HTTP 402 micropayment protocol" },
                { label: "Base Network", href: "https://base.org", desc: "L2 network for payments" },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg group transition-colors"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-dim)" }}>
                  <Globe size={11} className="mt-0.5 flex-shrink-0 group-hover:text-blue-400 transition-colors" style={{ color: "var(--text-dim)" }} />
                  <div>
                    <div className="text-[10px] font-[600] group-hover:text-blue-400 transition-colors" style={{ color: "var(--text-primary)", fontFamily: "var(--font-data)" }}>
                      {link.label}
                    </div>
                    <div className="text-[9px] mt-0.5" style={{ color: "var(--text-dim)" }}>{link.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
