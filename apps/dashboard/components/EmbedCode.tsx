"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

type Tab = "npm" | "wordpress" | "static" | "vercel"

export function EmbedCode({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("npm")

  const snippets: Record<Tab, string> = {
    npm: `import { cipta, ciptaHoneypot, generateRobotsTxt } from "@cipta/middleware"

app.use(cipta({
  wallet: "${walletAddress}",
  priceUSD: 0.001,
  network: "base",
  erc8004: true,     // reputation-based pricing
  ethPayment: true,  // accept ETH payments
}))

// Honeypot trap — add /cipta-trap/ to robots.txt Disallow
app.use("/cipta-trap", ciptaHoneypot({ wallet: "${walletAddress}" }))
app.get("/robots.txt", (_req, res) =>
  res.type("text/plain").send(generateRobotsTxt()))`,

    wordpress: `<?php
// Add to functions.php or as a plugin:
// Cipta — protect WordPress from AI scrapers

function cipta_protect_content() {
  $ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
  $ai_bots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bytespider', 'Amazonbot'];

  foreach ($ai_bots as $bot) {
    if (stripos($ua, $bot) !== false) {
      // Redirect to payment page or return 402
      http_response_code(402);
      wp_send_json([
        'error' => 'Payment Required',
        'pay_to' => '${walletAddress}',
        'price_usd' => 0.001,
        'protocol' => 'x402',
        'network' => 'base',
      ]);
      exit;
    }
  }
}
add_action('template_redirect', 'cipta_protect_content');

// Optional: JS beacon to catch headless crawlers
function cipta_beacon_script() { ?>
<script>
(function() {
  var ua = navigator.userAgent;
  fetch('https://demo.cipta.xyz/api/beacon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ua: ua, path: location.pathname, wallet: '${walletAddress}' })
  });
})();
</script>
<?php }
add_action('wp_footer', 'cipta_beacon_script');`,

    static: `<!-- Add to your HTML <head> — works on any static site (GitHub Pages, Netlify, Vercel) -->

<!-- 1x1 tracking pixel — logs bot User-Agents server-side -->
<img src="https://demo.cipta.xyz/api/pixel/${walletAddress}"
     width="1" height="1" style="display:none" alt="" />

<!-- JS beacon — catches headless browsers (Puppeteer, Playwright) -->
<script>
(function() {
  fetch('https://demo.cipta.xyz/api/beacon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ua: navigator.userAgent,
      path: location.pathname,
      wallet: '${walletAddress}'
    })
  });
})();
</script>

<!-- Hugo / Jekyll / Gatsby: add above to your base layout template -->`,

    vercel: `// middleware.ts — Vercel Edge Middleware (zero cold start)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bytespider', 'Amazonbot',
  'FacebookBot', 'Meta-ExternalAgent', 'cohere-ai', 'CCBot', 'YouBot', 'Diffbot']

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''
  const isAIBot = AI_BOTS.some(bot => ua.includes(bot))

  if (isAIBot) {
    // Check for ETH payment header
    const ethTx = request.headers.get('x-eth-tx-hash')
    if (ethTx) {
      // Let through — server will verify the tx
      return NextResponse.next()
    }

    return NextResponse.json({
      error: 'Payment Required',
      pay_to: '${walletAddress}',
      price_usd: 0.001,
      protocol: 'x402',
      network: 'base',
      eth_alternative: {
        send_to: '${walletAddress}',
        then_set_header: 'X-ETH-TX-HASH: <txHash>'
      }
    }, { status: 402 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*', '/articles/:path*', '/content/:path*']
}`,
  }

  const tabLabels: Record<Tab, string> = {
    npm: "Node.js",
    wordpress: "WordPress",
    static: "Static Site",
    vercel: "Vercel Edge",
  }

  const activeCode = snippets[activeTab]

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-full">
      <h3 className="font-semibold text-white mb-4">Embed Code</h3>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#0052FF] text-white"
                : "bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-green-400 overflow-x-auto leading-relaxed max-h-64">
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
        {activeTab === "npm" && "Pasang di Express server. Supports x402, ETH, dan ERC-8004 reputation pricing."}
        {activeTab === "wordpress" && "Tambahkan ke functions.php. Cocok untuk blog WordPress yang dihosting sendiri."}
        {activeTab === "static" && "Pixel + JS beacon untuk static site. Data tersimpan di Supabase real-time."}
        {activeTab === "vercel" && "Edge Middleware jalan di CDN edge — zero latency, zero cold start."}
      </p>
    </div>
  )
}
