import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center font-bold text-sm">
            C
          </div>
          <span className="font-bold text-lg">Cipta</span>
        </div>
        <Link
          href="/dashboard"
          className="bg-[#0052FF] hover:bg-[#3374FF] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Open Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#0052FF]/10 border border-[#0052FF]/30 text-[#3374FF] text-sm px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-[#0052FF] rounded-full animate-pulse" />
          Built on Base · Powered by x402
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Your Content.
          <br />
          <span className="text-[#0052FF]">Your Earnings.</span>
        </h1>

        <p className="text-xl text-white/60 mb-10 max-w-2xl">
          AI crawlers read your articles, blogs, and creative work every day — for free.
          Cipta makes them pay. One line of code. USDC to your wallet. Automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="bg-[#0052FF] hover:bg-[#3374FF] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Start Earning →
          </Link>
          <a
            href="https://github.com/your-repo/cipta"
            className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 w-full max-w-2xl">
          {[
            { label: "x402 Transactions", value: "100M+" },
            { label: "AI Crawlers Detected", value: "15+" },
            { label: "Lines to Integrate", value: "1" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-[#0052FF]">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Code snippet */}
        <div className="mt-16 w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/40 text-xs ml-2">server.ts</span>
          </div>
          <pre className="text-sm text-green-400 overflow-x-auto">
{`import { cipta } from "cipta"

// Satu baris ini → AI yang akses kontenmu harus bayar
app.use(cipta({
  wallet: "0xALAMAT_KAMU",
  priceUSD: 0.001,
}))`}
          </pre>
        </div>
      </div>
    </main>
  )
}
