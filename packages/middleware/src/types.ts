export interface CiptaConfig {
  /** Wallet address kreator untuk menerima USDC */
  wallet: string
  /** Harga default per request dalam USD (e.g. 0.001 = $0.001) */
  priceUSD: number
  /** Base network: mainnet atau testnet */
  network?: "base" | "base-sepolia"
  /** Bot yang boleh akses gratis (e.g. ["Googlebot"]) */
  whitelist?: string[]
  /** Harga custom per bot tertentu */
  botPricing?: Record<string, number>
  /** Supabase URL untuk tracking earnings */
  supabaseUrl?: string
  /** Supabase anon key */
  supabaseKey?: string
}

export interface AccessLog {
  id?: string
  creator_wallet: string
  bot_agent: string
  path: string
  status: "attempted" | "paid" | "blocked" | "whitelisted"
  amount_usd?: number
  tx_hash?: string
  timestamp: string
}

export interface BotStats {
  bot_agent: string
  total_requests: number
  total_paid: number
  total_earned_usd: number
  last_seen: string
}

export interface CreatorEarnings {
  total_earned_usd: number
  today_earned_usd: number
  total_requests: number
  paid_requests: number
  top_bots: BotStats[]
}
