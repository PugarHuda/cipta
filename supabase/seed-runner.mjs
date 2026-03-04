// Seed runner — inserts demo data via Supabase REST API
// Usage: node supabase/seed-runner.mjs

const SUPABASE_URL = "https://iqkpsoqxytlowmwtxhnh.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3Bzb3F4eXRsb3dtd3R4aG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDA4OTYsImV4cCI6MjA4ODA3Njg5Nn0.v3UJHC56ypdSIHeCHSJZD2F1Ifw5WIQf8FZ-st9v9rg"

const W = "0x0fc7b2C6Ed68f4553F4b2c7B52d4269a673B666f"

function daysAgo(days, hours = 0) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(d.getHours() - hours)
  return d.toISOString()
}

function normalize(rows) {
  // Collect all keys across all rows
  const allKeys = new Set()
  rows.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)))
  // Fill missing keys with null
  return rows.map(r => {
    const out = {}
    for (const k of allKeys) out[k] = r[k] !== undefined ? r[k] : null
    return out
  })
}

async function insert(table, rows) {
  rows = normalize(rows)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`❌ ${table} insert failed: ${res.status} ${err}`)
    return false
  }
  console.log(`✅ Inserted ${rows.length} rows into ${table}`)
  return true
}

// ── access_logs ────────────────────────────────────────────────
const accessLogs = [
  // GPTBot — paling sering, bayar x402
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/artikel-defi-2026",  status: "paid",      amount_usd: 0.003, tx_hash: "0xabc111", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(0, 2) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/analisis-onchain",   status: "paid",      amount_usd: 0.003, tx_hash: "0xabc112", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(0, 5) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/artikel-defi-2026",  status: "paid",      amount_usd: 0.003, tx_hash: "0xabc113", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(1) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/token-ekonomi",      status: "paid",      amount_usd: 0.003, tx_hash: "0xabc114", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(1, 3) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/analisis-onchain",   status: "paid",      amount_usd: 0.003, tx_hash: "0xabc115", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(2) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/artikel-defi-2026",  status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(2, 1) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/token-ekonomi",      status: "paid",      amount_usd: 0.003, tx_hash: "0xabc116", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(3) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/analisis-onchain",   status: "paid",      amount_usd: 0.003, tx_hash: "0xabc117", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(4) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/artikel-defi-2026",  status: "paid",      amount_usd: 0.003, tx_hash: "0xabc118", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(5) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/token-ekonomi",      status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(6) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/analisis-onchain",   status: "paid",      amount_usd: 0.003, tx_hash: "0xabc119", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(7) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/artikel-defi-2026",  status: "paid",      amount_usd: 0.003, tx_hash: "0xabc11a", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(9) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/token-ekonomi",      status: "paid",      amount_usd: 0.003, tx_hash: "0xabc11b", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(11) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/analisis-onchain",   status: "paid",      amount_usd: 0.003, tx_hash: "0xabc11c", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(14) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/artikel-defi-2026",  status: "paid",      amount_usd: 0.003, tx_hash: "0xabc11d", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(18) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/token-ekonomi",      status: "paid",      amount_usd: 0.003, tx_hash: "0xabc11e", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(22) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0", path: "/content/analisis-onchain",   status: "paid",      amount_usd: 0.003, tx_hash: "0xabc11f", payment_type: "x402", erc8004_score: 88, timestamp: daysAgo(26) },
  // ClaudeBot — bayar ETH, ERC-8004 TRUSTED
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/artikel-defi-2026", status: "paid", amount_usd: 0.002, tx_hash: "0xdef111", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(0, 1) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/analisis-onchain",  status: "paid", amount_usd: 0.002, tx_hash: "0xdef112", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(1, 2) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/token-ekonomi",     status: "paid", amount_usd: 0.002, tx_hash: "0xdef113", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(3) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/artikel-defi-2026", status: "paid", amount_usd: 0.002, tx_hash: "0xdef114", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(6) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/analisis-onchain",  status: "paid", amount_usd: 0.002, tx_hash: "0xdef115", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(10) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/token-ekonomi",     status: "paid", amount_usd: 0.002, tx_hash: "0xdef116", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(15) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0", path: "/content/artikel-defi-2026", status: "paid", amount_usd: 0.002, tx_hash: "0xdef117", payment_type: "eth", erc8004_agent_id: "agent_claude_001", erc8004_score: 94, timestamp: daysAgo(20) },
  // PerplexityBot — campuran
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/artikel-defi-2026", status: "paid",      amount_usd: 0.001, tx_hash: "0xppp111", payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(0, 3) },
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/analisis-onchain",  status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(1) },
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/token-ekonomi",     status: "paid",      amount_usd: 0.001, tx_hash: "0xppp112", payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(2) },
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/artikel-defi-2026", status: "paid",      amount_usd: 0.001, tx_hash: "0xppp113", payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(4) },
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/analisis-onchain",  status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(7) },
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/token-ekonomi",     status: "paid",      amount_usd: 0.001, tx_hash: "0xppp114", payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(12) },
  { creator_wallet: W, bot_agent: "PerplexityBot/1.0", path: "/content/artikel-defi-2026", status: "paid",      amount_usd: 0.001, tx_hash: "0xppp115", payment_type: "x402", erc8004_score: 76, timestamp: daysAgo(17) },
  // Bytespider — banyak, conversion rendah
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/artikel-defi-2026", status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", timestamp: daysAgo(0, 4) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/analisis-onchain",  status: "paid",      amount_usd: 0.001, tx_hash: "0xbyt111", payment_type: "x402", timestamp: daysAgo(1) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/token-ekonomi",     status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", timestamp: daysAgo(2) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/artikel-defi-2026", status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", timestamp: daysAgo(3) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/analisis-onchain",  status: "paid",      amount_usd: 0.001, tx_hash: "0xbyt112", payment_type: "x402", timestamp: daysAgo(5) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/token-ekonomi",     status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", timestamp: daysAgo(8) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/artikel-defi-2026", status: "paid",      amount_usd: 0.001, tx_hash: "0xbyt113", payment_type: "x402", timestamp: daysAgo(13) },
  { creator_wallet: W, bot_agent: "Bytespider", path: "/content/analisis-onchain",  status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", timestamp: daysAgo(19) },
  // Googlebot — whitelist
  { creator_wallet: W, bot_agent: "Googlebot/2.1", path: "/content/artikel-defi-2026", status: "whitelisted", timestamp: daysAgo(0, 6) },
  { creator_wallet: W, bot_agent: "Googlebot/2.1", path: "/content/analisis-onchain",  status: "whitelisted", timestamp: daysAgo(1) },
  { creator_wallet: W, bot_agent: "Googlebot/2.1", path: "/content/token-ekonomi",     status: "whitelisted", timestamp: daysAgo(3) },
  { creator_wallet: W, bot_agent: "Googlebot/2.1", path: "/content/artikel-defi-2026", status: "whitelisted", timestamp: daysAgo(7) },
  // Amazonbot
  { creator_wallet: W, bot_agent: "Amazonbot/0.1", path: "/content/artikel-defi-2026", status: "paid",      amount_usd: 0.001, tx_hash: "0xamz111", payment_type: "x402", timestamp: daysAgo(2) },
  { creator_wallet: W, bot_agent: "Amazonbot/0.1", path: "/content/analisis-onchain",  status: "attempted", amount_usd: null,  tx_hash: null,       payment_type: "x402", timestamp: daysAgo(5) },
  { creator_wallet: W, bot_agent: "Amazonbot/0.1", path: "/content/artikel-defi-2026", status: "paid",      amount_usd: 0.001, tx_hash: "0xamz112", payment_type: "x402", timestamp: daysAgo(12) },
]

const honeypotLogs = [
  { creator_wallet: W, bot_agent: "ScrapeBot/3.1",   trap_path: "/cipta-trap/premium-content", erc8004_agent_id: null,              timestamp: daysAgo(0, 1) },
  { creator_wallet: W, bot_agent: "DataMiner/1.0",   trap_path: "/cipta-trap/artikel",         erc8004_agent_id: null,              timestamp: daysAgo(0, 8) },
  { creator_wallet: W, bot_agent: "GPTBot/1.0",      trap_path: "/cipta-trap/secret-data",     erc8004_agent_id: "agent_gpt_rogue", timestamp: daysAgo(1) },
  { creator_wallet: W, bot_agent: "UnknownBot/2.0",  trap_path: "/cipta-trap/premium-content", erc8004_agent_id: null,              timestamp: daysAgo(2) },
  { creator_wallet: W, bot_agent: "AhrefsBot/7.0",   trap_path: "/cipta-trap/artikel",         erc8004_agent_id: null,              timestamp: daysAgo(3) },
  { creator_wallet: W, bot_agent: "SemrushBot/3.1",  trap_path: "/cipta-trap/premium-content", erc8004_agent_id: null,              timestamp: daysAgo(4) },
  { creator_wallet: W, bot_agent: "MJ12bot/v1.4.8",  trap_path: "/cipta-trap/secret-data",     erc8004_agent_id: null,              timestamp: daysAgo(5) },
  { creator_wallet: W, bot_agent: "DataMiner/1.0",   trap_path: "/cipta-trap/artikel",         erc8004_agent_id: null,              timestamp: daysAgo(6) },
  { creator_wallet: W, bot_agent: "ScrapeBot/3.1",   trap_path: "/cipta-trap/premium-content", erc8004_agent_id: null,              timestamp: daysAgo(8) },
  { creator_wallet: W, bot_agent: "UnknownBot/2.0",  trap_path: "/cipta-trap/artikel",         erc8004_agent_id: null,              timestamp: daysAgo(10) },
  { creator_wallet: W, bot_agent: "ClaudeBot/1.0",   trap_path: "/cipta-trap/secret-data",     erc8004_agent_id: "agent_claude_bad",timestamp: daysAgo(13) },
  { creator_wallet: W, bot_agent: "Bytespider",      trap_path: "/cipta-trap/premium-content", erc8004_agent_id: null,              timestamp: daysAgo(17) },
]

console.log("🌱 Seeding Supabase...")
await insert("access_logs", accessLogs)
await insert("honeypot_logs", honeypotLogs)
console.log("✅ Seed complete!")
