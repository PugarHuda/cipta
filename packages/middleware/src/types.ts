export interface CiptaConfig {
  /** Wallet address kreator untuk menerima USDC/ETH */
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
  /** Enable ERC-8004 reputation-based pricing */
  erc8004?: boolean
  /** Private key untuk give feedback on-chain (hex string) */
  signerKey?: `0x${string}`
  /** Enable ETH payment sebagai alternatif x402/USDC */
  ethPayment?: boolean
  /** Harga ETH per request (override otomatis dari priceUSD jika tidak diset) */
  ethPriceWei?: bigint
}

export interface AccessLog {
  id?: string
  creator_wallet: string
  bot_agent: string
  path: string
  status: "attempted" | "paid" | "blocked" | "whitelisted" | "honeypot"
  amount_usd?: number
  tx_hash?: string
  payment_type?: "x402" | "eth"
  erc8004_agent_id?: string
  erc8004_score?: number
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

export interface HoneypotLog {
  id?: string
  creator_wallet: string
  bot_agent: string
  trap_path: string
  erc8004_agent_id?: string
  timestamp: string
}

export interface ERC8004Summary {
  agentId: string
  score: number        // 0-100
  feedbackCount: number
  lastUpdated: number
}

export interface ETHPaymentResult {
  success: boolean
  txHash?: string
  amountWei?: bigint
  error?: string
}
