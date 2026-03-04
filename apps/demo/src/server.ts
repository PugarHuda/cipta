import "dotenv/config"
import express from "express"
import cors from "cors"
import { cipta, ciptaHoneypot, generateRobotsTxt } from "@cipta/middleware"

const app = express()
app.use(cors())
app.use(express.json())

const WALLET = process.env.CREATOR_WALLET_ADDRESS || "0x0000000000000000000000000000000000000001"
const NETWORK = (process.env.NETWORK || "base-sepolia") as "base" | "base-sepolia"

const ciptaConfig = {
  wallet: WALLET,
  priceUSD: 0.001,
  network: NETWORK,
  whitelist: ["Googlebot"],
  botPricing: {
    GPTBot: 0.003,
    ClaudeBot: 0.002,
    PerplexityBot: 0.001,
  },
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  // ERC-8004 reputation-based pricing
  erc8004: true,
  signerKey: process.env.SIGNER_KEY as `0x${string}` | undefined,
  // Accept ETH as alternative payment
  ethPayment: true,
}

// ─── Robots.txt — hide trap from compliant bots ───────────────────────
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(generateRobotsTxt("/cipta-trap/"))
})

// ─── Honeypot trap — /cipta-trap/* ───────────────────────────────────
app.use("/cipta-trap", ciptaHoneypot(ciptaConfig))

// ─── Beacon endpoint for static site / WordPress integration ─────────
// Static site JS snippet: fetch('/api/beacon', { method: 'POST', body: JSON.stringify({ ua: navigator.userAgent, path: location.pathname }) })
app.post("/api/beacon", (req, res) => {
  const { ua, path: reqPath, wallet: beaconWallet } = req.body || {}
  if (!ua) return res.status(400).json({ error: "ua required" })

  console.log(`[Cipta Beacon] UA="${ua}" path="${reqPath}" wallet="${beaconWallet || WALLET}"`)
  res.json({ received: true })
})

// ─── 1x1 pixel endpoint for image tracking ───────────────────────────
// <img src="https://demo.cipta.dev/api/pixel/0xWALLET" width="1" height="1" />
app.get("/api/pixel/:wallet", (req, res) => {
  const userAgent = req.headers["user-agent"] || ""
  console.log(`[Cipta Pixel] UA="${userAgent}" wallet="${req.params.wallet}"`)

  // 1x1 transparent GIF
  const gif = Buffer.from(
    "47494638396101000100800000ffffff00000021f90401000000002c000000000100010000020244003b",
    "hex"
  )
  res.set("Content-Type", "image/gif")
  res.set("Cache-Control", "no-store, no-cache, must-revalidate")
  res.send(gif)
})

// ─── Health check — MUST be before cipta middleware ───────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    protected_by: "Cipta",
    features: ["x402/USDC", "ETH payment", "ERC-8004 reputation", "honeypot"],
    network: NETWORK,
    wallet: WALLET,
  })
})

// ─── Cipta middleware — protects all /content/* routes ───────────────
app.use(cipta(ciptaConfig))

// ─── Protected content ────────────────────────────────────────────────
app.get("/content/artikel-defi-2026", (req, res) => {
  res.json({
    title: "DeFi di 2026: Panduan Lengkap untuk Investor",
    author: "Cipta Demo Creator",
    published: "2026-03-03",
    content: `
      DeFi pada tahun 2026 telah berkembang jauh melampaui ekspektasi.
      Total Value Locked (TVL) mencapai $500 miliar, dengan Base menjadi
      chain terbesar kedua setelah Ethereum mainnet.

      AI agents kini mengelola 40% dari semua likuiditas DeFi secara otonom.
      Protokol seperti Aave, Morpho, dan Compound menjadi backbone dari
      ekosistem yield generation global...
    `,
    readTime: "8 menit",
    _protected_by: "Cipta x402 + ERC-8004",
  })
})

app.get("/content/analisis-base-2026", (req, res) => {
  res.json({
    title: "Mengapa Base Menjadi Chain Terpopuler di 2026",
    author: "Cipta Demo Creator",
    published: "2026-03-01",
    content: `
      Base berhasil mencapai 10 juta transaksi per hari pada Q1 2026.
      Kunci kesuksesannya: OnchainKit yang memudahkan developer,
      Smart Wallet yang menghilangkan friction untuk user baru,
      dan ekosistem builder yang aktif lewat program Base Batches...
    `,
    readTime: "5 menit",
    _protected_by: "Cipta x402 + ERC-8004",
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\n🛡️  Cipta Demo Server running on http://localhost:${PORT}`)
  console.log(`📄 Protected: /content/artikel-defi-2026`)
  console.log(`📄 Protected: /content/analisis-base-2026`)
  console.log(`🍯 Honeypot:  /cipta-trap/*`)
  console.log(`📡 Beacon:    POST /api/beacon`)
  console.log(`🖼️  Pixel:     GET  /api/pixel/${WALLET}`)
  console.log(`\nTest:`)
  console.log(`  curl -H "User-Agent: GPTBot/1.0" http://localhost:${PORT}/content/artikel-defi-2026`)
  console.log(`  curl -H "User-Agent: GPTBot/1.0" http://localhost:${PORT}/cipta-trap/secret  # honeypot`)
  console.log(`  curl http://localhost:${PORT}/robots.txt\n`)
})
