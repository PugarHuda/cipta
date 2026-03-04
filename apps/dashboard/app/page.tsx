import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* Grid background overlay */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(79,110,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 h-14"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(11,15,25,0.8)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-[700]"
            style={{ background: "var(--blue)", color: "#fff", fontFamily: "var(--font-data)" }}>C</div>
          <span className="text-[14px] font-[700]" style={{ fontFamily: "var(--font-ui)", letterSpacing: "-0.01em" }}>Cipta</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-[600] tracking-[0.1em]"
            style={{ background: "rgba(16,217,160,0.1)", color: "var(--green)", border: "1px solid rgba(16,217,160,0.2)" }}>LIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/PugarHuda/cipta" target="_blank" rel="noopener noreferrer"
            className="text-[11px] font-[500] transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-data)" }}>GitHub</a>
          <Link href="/dashboard"
            className="px-4 py-1.5 rounded-lg text-[11px] font-[600] transition-colors"
            style={{ background: "var(--blue)", color: "#fff", fontFamily: "var(--font-data)" }}>
            Open Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
          style={{ background: "rgba(79,110,247,0.08)", border: "1px solid rgba(79,110,247,0.2)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--blue)" }} />
          <span className="text-[10px] font-[600] tracking-[0.12em]" style={{ color: "var(--blue)", fontFamily: "var(--font-ui)" }}>
            BUILT ON BASE · POWERED BY x402 · ERC-8004
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl mb-6 leading-[1.1]"
          style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 700, fontFamily: "var(--font-ui)", letterSpacing: "-0.03em" }}>
          Make AI Agents{" "}
          <span style={{ color: "var(--green)" }}>Pay</span>{" "}
          for Your Content
        </h1>

        <p className="max-w-xl mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)", fontSize: "clamp(0.9rem,2vw,1.05rem)" }}>
          AI crawlers scrape your blog, docs, and creative work every day — for free.
          Cipta intercepts them, charges micropayments in USDC or ETH,
          and sends the revenue directly to your wallet.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-20">
          <Link href="/dashboard"
            className="px-7 py-3 rounded-xl font-[600] transition-all hover:scale-[1.02]"
            style={{ background: "var(--blue)", color: "#fff", fontFamily: "var(--font-data)", fontSize: "13px" }}>
            Start Earning →
          </Link>
          <a href="https://github.com/PugarHuda/cipta" target="_blank" rel="noopener noreferrer"
            className="px-7 py-3 rounded-xl font-[600] transition-colors hover:opacity-80"
            style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", fontFamily: "var(--font-data)", fontSize: "13px" }}>
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-lg mb-20">
          {[
            { label: "x402 Transactions",    value: "100M+",  color: "var(--blue)"   },
            { label: "AI Crawlers Detected",  value: "15+",    color: "var(--green)"  },
            { label: "Lines to Integrate",    value: "1",      color: "var(--amber)"  },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <div className="text-3xl font-[700] mb-1" style={{ color: s.color, fontFamily: "var(--font-data)" }}>{s.value}</div>
              <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Code card */}
        <div className="w-full max-w-xl rounded-xl overflow-hidden text-left"
          style={{ background: "#0D1117", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: "1px solid var(--border-dim)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F56" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27C93F" }} />
            <span className="ml-2 text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}>server.ts</span>
          </div>
          <pre className="p-5 text-[12px] leading-relaxed overflow-x-auto" style={{ fontFamily: "var(--font-data)" }}>
<span style={{ color: "#8B949E" }}>{"// One line → AI agents pay to access your content"}</span>{"\n"}
<span style={{ color: "#FF7B72" }}>{"import"}</span>{" "}<span style={{ color: "#E6EDF3" }}>{"{ cipta }"}</span>{" "}<span style={{ color: "#FF7B72" }}>{"from"}</span>{" "}<span style={{ color: "#A5D6FF" }}>{'"@cipta/middleware"'}</span>{"\n\n"}
{"app."}<span style={{ color: "#D2A8FF" }}>{"use"}</span>{"("}<span style={{ color: "#79C0FF" }}>{"cipta"}</span>{"({"}{"\n"}
{"  "}<span style={{ color: "#E6EDF3" }}>{"wallet"}</span>{":         "}<span style={{ color: "#A5D6FF" }}>{'"0xYOUR_WALLET"'}</span>{",\n"}
{"  "}<span style={{ color: "#E6EDF3" }}>{"priceUSD"}</span>{":      "}<span style={{ color: "#79C0FF" }}>{"0.001"}</span>{",\n"}
{"  "}<span style={{ color: "#E6EDF3" }}>{"erc8004"}</span>{":      "}<span style={{ color: "#79C0FF" }}>{"true"}</span>{",  "}<span style={{ color: "#8B949E" }}>{"// reputation discounts"}</span>{"\n"}
{"}))"}
          </pre>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[9px] tracking-[0.22em] font-[600] mb-3" style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}>HOW IT WORKS</div>
            <h2 className="text-2xl font-[700]" style={{ fontFamily: "var(--font-ui)", letterSpacing: "-0.02em" }}>Three steps to monetize AI traffic</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Install Middleware",
                desc: "npm install @cipta/middleware — works with Express, Next.js, Fastify, and any Node.js server.",
                color: "var(--blue)",
              },
              {
                step: "02",
                title: "Agent Pays in USDC / ETH",
                desc: "Compliant AI agents (x402 + ERC-8004) automatically pay micropayments via Base. Humans pass through for free.",
                color: "var(--green)",
              },
              {
                step: "03",
                title: "Revenue to Your Wallet",
                desc: "USDC and ETH land directly in your Base wallet. Track earnings, bot intel, and honeypot traps on the dashboard.",
                color: "var(--amber)",
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="rounded-xl p-6"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <div className="text-[28px] font-[700] mb-4 leading-none" style={{ color, fontFamily: "var(--font-data)", opacity: 0.3 }}>{step}</div>
                <div className="text-[13px] font-[600] mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>{title}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 px-8 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "x402 Protocol",     desc: "HTTP 402 USDC micropayments",   color: "var(--blue)"   },
            { label: "ETH Payments",      desc: "Native ETH on Base Sepolia",     color: "var(--purple)" },
            { label: "ERC-8004",          desc: "Reputation-based discounts",     color: "var(--green)"  },
            { label: "Honeypot Traps",    desc: "Catch disobedient scrapers",     color: "var(--red)"    },
          ].map((f) => (
            <div key={f.label} className="rounded-xl p-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <div className="w-1.5 h-1.5 rounded-full mb-3" style={{ background: f.color }} />
              <div className="text-[11px] font-[600] mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>{f.label}</div>
              <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 pb-24 text-center">
        <div className="max-w-lg mx-auto rounded-2xl p-10"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <div className="text-[9px] tracking-[0.2em] font-[600] mb-4" style={{ color: "var(--text-dim)", fontFamily: "var(--font-ui)" }}>GET STARTED NOW</div>
          <h3 className="text-xl font-[700] mb-3" style={{ fontFamily: "var(--font-ui)", letterSpacing: "-0.02em" }}>
            Your content has value.<br />Start charging for it.
          </h3>
          <p className="text-[11px] mb-6" style={{ color: "var(--text-secondary)" }}>
            Connect your Base wallet and get your embed code in 30 seconds.
          </p>
          <Link href="/dashboard"
            className="inline-block px-8 py-3 rounded-xl font-[600] transition-all hover:scale-[1.02]"
            style={{ background: "var(--blue)", color: "#fff", fontFamily: "var(--font-data)", fontSize: "13px" }}>
            Open Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-[700]"
              style={{ background: "var(--blue)", color: "#fff", fontFamily: "var(--font-data)" }}>C</div>
            <span className="text-[10px] font-[600]" style={{ fontFamily: "var(--font-ui)" }}>Cipta</span>
          </div>
          <div className="text-[9px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}>
            Built for Base Batches 003 · 2025
          </div>
        </div>
      </footer>
    </main>
  )
}
