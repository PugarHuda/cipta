"use client"

import { useState } from "react"
import { Copy, Check, Circle } from "lucide-react"

type Tab = "node" | "wordpress" | "static" | "vercel"

const TAB_META: Record<Tab, { label: string; lang: string; ext: string }> = {
  node:      { label: "Node.js",    lang: "TypeScript", ext: "ts"  },
  wordpress: { label: "WordPress",  lang: "PHP",        ext: "php" },
  static:    { label: "Static",     lang: "HTML",       ext: "html"},
  vercel:    { label: "Vercel Edge",lang: "TypeScript", ext: "ts"  },
}

// Simple token-based colorizer — no external deps
function colorize(code: string, lang: string): string {
  if (lang === "PHP") {
    return code
      .replace(/(&lt;|&gt;|<|>)/g, (m) => m === "<" ? "&lt;" : "&gt;")
      .replace(/(\/\/[^\n]*)/g, `<span style="color:#4A607A">$1</span>`)
      .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, `<span style="color:#10D9A0">$1</span>`)
      .replace(/\b(function|if|foreach|return|exit|array|true|false|null)\b/g, `<span style="color:#A78BFA">$1</span>`)
      .replace(/\b(http_response_code|wp_send_json|add_action|stripos|isset)\b/g, `<span style="color:#4F6EF7">$1</span>`)
      .replace(/(\$\w+)/g, `<span style="color:#F59E0B">$1</span>`)
  }
  if (lang === "HTML") {
    return code
      .replace(/(&lt;|&gt;|<(?!span)|>)/g, (m) => (m === "<" || m === "&lt;") ? "&lt;" : "&gt;")
      .replace(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g, `<span style="color:#4A607A">$1</span>`)
      .replace(/('[^']*'|"[^"]*")/g, `<span style="color:#10D9A0">$1</span>`)
      .replace(/\b(fetch|const|let|function|if)\b/g, `<span style="color:#A78BFA">$1</span>`)
  }
  // TypeScript / JS
  return code
    .replace(/(\/\/[^\n]*)/g, `<span style="color:#4A607A">$1</span>`)
    .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, `<span style="color:#10D9A0">$1</span>`)
    .replace(/\b(import|from|export|const|let|function|async|await|return|if|default|type)\b/g, `<span style="color:#A78BFA">$1</span>`)
    .replace(/\b(cipta|ciptaHoneypot|generateRobotsTxt|NextResponse|NextRequest|middleware)\b/g, `<span style="color:#4F6EF7">$1</span>`)
    .replace(/\b(true|false|null|undefined)\b/g, `<span style="color:#F59E0B">$1</span>`)
}

export function EmbedCode({ walletAddress }: { walletAddress: string }) {
  const [tab, setTab]       = useState<Tab>("node")
  const [copied, setCopied] = useState(false)

  const raw: Record<Tab, string> = {
    node: `import { cipta, ciptaHoneypot, generateRobotsTxt } from "@cipta/middleware"

// One-line protection — bots pay, humans pass free
app.use(cipta({
  wallet: "${walletAddress}",
  priceUSD: 0.001,
  network: "base",
  erc8004: true,     // reputation-based pricing
  ethPayment: true,  // accept ETH as alternative
}))

// Honeypot: traps disobedient scrapers
app.use("/cipta-trap", ciptaHoneypot({ wallet: "${walletAddress}" }))
app.get("/robots.txt", (_req, res) =>
  res.type("text/plain").send(generateRobotsTxt()))`,

    wordpress: `<?php
// functions.php — protect WordPress from AI scrapers
function cipta_protect_content() {
  $ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
  $ai_bots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bytespider'];

  foreach ($ai_bots as $bot) {
    if (stripos($ua, $bot) !== false) {
      http_response_code(402);
      wp_send_json([
        'error'     => 'Payment Required',
        'pay_to'    => '${walletAddress}',
        'price_usd' => 0.001,
        'protocol'  => 'x402',
        'network'   => 'base',
      ]);
      exit;
    }
  }
}
add_action('template_redirect', 'cipta_protect_content');`,

    static: `<!-- Add to <head> — works on GitHub Pages, Netlify, Hugo, Jekyll -->

<!-- 1×1 tracking pixel: logs bot User-Agents server-side -->
<img src="https://demo.cipta.xyz/api/pixel/${walletAddress}"
     width="1" height="1" style="display:none" alt="" />

<!-- JS beacon: catches headless browsers (Puppeteer, Playwright) -->
<script>
(function() {
  fetch('https://demo.cipta.xyz/api/beacon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ua:     navigator.userAgent,
      path:   location.pathname,
      wallet: '${walletAddress}'
    })
  });
})();
</script>`,

    vercel: `// middleware.ts — runs at Vercel Edge (zero cold start)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AI_BOTS = ['GPTBot','ClaudeBot','PerplexityBot','Bytespider']

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''
  if (AI_BOTS.some(b => ua.includes(b))) {
    return NextResponse.json({
      error:     'Payment Required',
      pay_to:    '${walletAddress}',
      price_usd: 0.001,
      protocol:  'x402',
      network:   'base',
    }, { status: 402 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*', '/content/:path*']
}`,
  }

  const meta = TAB_META[tab]
  const code = raw[tab]

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-xl overflow-hidden h-full flex flex-col"
      style={{ background: "#0D1117", border: "1px solid var(--border-subtle)" }}
    >
      {/* VS Code-style title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: "#161B22", borderBottom: "1px solid var(--border-dim)" }}
      >
        {/* Traffic-light dots */}
        <Circle size={8} fill="#EF4444" stroke="none" />
        <Circle size={8} fill="#F59E0B" stroke="none" />
        <Circle size={8} fill="#10D9A0" stroke="none" />
        <span
          className="ml-2 text-[10px]"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}
        >
          cipta.{meta.ext}
        </span>
      </div>

      {/* File tabs */}
      <div
        className="flex items-center gap-0 overflow-x-auto"
        style={{ background: "#161B22", borderBottom: "1px solid var(--border-dim)" }}
      >
        {(Object.keys(TAB_META) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3.5 py-2 text-[10px] font-[500] whitespace-nowrap transition-all duration-150 border-b-[1.5px]"
            style={{
              fontFamily: "var(--font-data)",
              color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
              borderColor: tab === t ? "var(--blue)" : "transparent",
              background: tab === t ? "rgba(79,110,247,0.07)" : "transparent",
            }}
          >
            {TAB_META[t].label}
          </button>
        ))}

        {/* Lang badge + copy */}
        <div className="flex items-center gap-2 ml-auto px-3">
          <span
            className="text-[9px] tracking-[0.06em]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
          >
            {meta.lang}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 rounded transition-colors"
            style={{ color: copied ? "var(--green)" : "var(--text-secondary)" }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Code body with line numbers */}
      <div className="flex-1 overflow-auto p-4" style={{ fontFamily: "var(--font-data)" }}>
        <table className="w-full border-collapse text-[11px] leading-[1.7]">
          <tbody>
            {code.split("\n").map((line, i) => (
              <tr key={i} className="group">
                <td
                  className="pr-4 select-none text-right w-6 align-top"
                  style={{ color: "var(--text-dim)", userSelect: "none" }}
                >
                  {i + 1}
                </td>
                <td>
                  <span
                    style={{ color: "#CDD9F0" }}
                    dangerouslySetInnerHTML={{ __html: colorize(line || " ", meta.lang) || "&nbsp;" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
