import "dotenv/config"
import express from "express"
import cors from "cors"
import { cipta } from "@cipta/middleware"

const app = express()
app.use(cors())
app.use(express.json())

// ─── Cipta middleware — satu baris ini yang lindungi semua konten ───
app.use(
  cipta({
    wallet: process.env.CREATOR_WALLET_ADDRESS || "0x0000000000000000000000000000000000000001",
    priceUSD: 0.001,
    network: "base-sepolia",
    whitelist: ["Googlebot"],           // Google boleh gratis
    botPricing: {
      GPTBot: 0.003,                    // OpenAI bayar 3x lebih mahal
      ClaudeBot: 0.002,                 // Anthropic bayar 2x
      PerplexityBot: 0.001,             // Perplexity harga normal
    },
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  })
)

// ─── Konten yang dilindungi ──────────────────────────────────────────
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
  })
})

// ─── Health check ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", protected_by: "Cipta x402", network: "base-sepolia" })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\n🛡️  Cipta Demo Server running on http://localhost:${PORT}`)
  console.log(`📄 Protected content: /content/artikel-defi-2026`)
  console.log(`📄 Protected content: /content/analisis-base-2026`)
  console.log(`\nTest dengan curl:`)
  console.log(`  curl -H "User-Agent: GPTBot/1.0" http://localhost:${PORT}/content/artikel-defi-2026`)
  console.log(`  curl -H "User-Agent: Mozilla/5.0" http://localhost:${PORT}/content/artikel-defi-2026\n`)
})
