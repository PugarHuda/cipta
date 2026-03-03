/**
 * CIPTA — Demo Script
 * Jalankan: npm run demo (dari packages/agent)
 *
 * Ini yang ditunjukkan saat Demo Day:
 * 1. Server dengan Cipta middleware jalan
 * 2. PayerAgent (AI) coba akses konten
 * 3. Agent dapat 402 → otomatis bayar USDC
 * 4. Agent dapat konten
 * 5. Dashboard kreator: earnings naik
 */

import { PayerAgent } from "./payer-agent"

const DEMO_SERVER_URL = process.env.DEMO_SERVER_URL || "http://localhost:3001"
// Untuk demo: pakai private key test wallet Base Sepolia (JANGAN pakai mainnet key!)
const AGENT_PRIVATE_KEY = (process.env.AGENT_PRIVATE_KEY || "") as `0x${string}`

async function runDemo() {
  console.log("\n" + "=".repeat(60))
  console.log("  CIPTA — Demo: AI Agent Bayar Konten Kreator")
  console.log("=".repeat(60) + "\n")

  // ─── STEP 1: Init AI Agent dengan wallet Base Sepolia ───────
  console.log("📦 Step 1: Inisialisasi AI Agent dengan wallet Base...")

  if (!AGENT_PRIVATE_KEY) {
    console.log("   ⚠️  AGENT_PRIVATE_KEY belum diset di environment")
    console.log("   Set dulu: export AGENT_PRIVATE_KEY=0xYOUR_TEST_PRIVATE_KEY")
    console.log("\n   Simulasi flow:\n")
    console.log("   ┌─ GPTBot/1.0 ──▶ GET /content/artikel ─────────────────┐")
    console.log("   │◀─ 402 Payment Required { price: $0.001 USDC } ─────────│")
    console.log("   │── Sign EIP-3009 USDC transfer ────────────────────────▶│")
    console.log("   │── GET /content/artikel + X-PAYMENT: <signed> ─────────▶│")
    console.log("   │◀─ 200 OK + artikel content ────────────────────────────│")
    console.log("   └────────────────────────────────────────────────────────┘")
    console.log("\n   ✅ Kreator earn: +$0.001 USDC (langsung ke wallet)")
    console.log("   ✅ Dashboard update real-time via Supabase")
    return
  }

  const agent = new PayerAgent()
  await agent.init({
    privateKey: AGENT_PRIVATE_KEY,
    network: "base-sepolia",
  })

  // ─── STEP 2: Coba akses konten tanpa payment ─────────────────
  console.log("\n🤖 Step 2: Agent coba akses artikel premium...")
  console.log(`   URL: ${DEMO_SERVER_URL}/content/artikel-defi-2026`)

  try {
    const res1 = await fetch(`${DEMO_SERVER_URL}/content/artikel-defi-2026`, {
      headers: { "User-Agent": "CiptaPayerAgent/1.0" },
    })
    console.log(`   HTTP Response: ${res1.status}`)

    if (res1.status === 402) {
      const paymentRequired = await res1.json()
      console.log("\n💳 Server minta pembayaran:")
      console.log(`   Price: ${paymentRequired.accepts?.[0]?.maxAmountRequired} USDC units`)
      console.log(`   Network: ${paymentRequired.accepts?.[0]?.network}`)
      console.log(`   Pay to: ${paymentRequired.accepts?.[0]?.payTo?.slice(0, 20)}...`)
    }
  } catch {
    console.log("   (Demo server belum jalan — skip ke step berikutnya)")
  }

  // ─── STEP 3: Akses dengan auto-payment ───────────────────────
  console.log("\n💰 Step 3: Agent bayar otomatis via x402 + akses konten...")

  try {
    const response = await agent.fetch(
      `${DEMO_SERVER_URL}/content/artikel-defi-2026`,
      "CiptaPayerAgent/1.0"
    )

    if (response.ok) {
      const content = await response.json()
      console.log("\n✅ Berhasil! Konten diterima:")
      console.log(`   Title: ${content.title}`)
      console.log(`   Excerpt: ${content.content?.slice(0, 80)}...`)
      console.log("\n💵 Kreator earned: +$0.001 USDC")
      console.log("📊 Dashboard update otomatis via Supabase realtime")
    }
  } catch {
    console.log("   Server belum jalan. Jalankan `npm run dev` di apps/demo dulu.")
  }

  console.log("\n" + "=".repeat(60))
  console.log("  Demo selesai! Cek dashboard di http://localhost:3000")
  console.log("=".repeat(60) + "\n")
}

runDemo().catch(console.error)
