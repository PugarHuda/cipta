// Types mirrored from @cipta/middleware — kept local so dashboard
// can build independently without the workspace package on Vercel.

export interface BotStats {
  bot_agent: string
  total_requests: number
  total_paid: number
  total_earned_usd: number
  erc8004_score?: number
  erc8004_agent_id?: string
  last_seen: string
}

export interface CreatorEarnings {
  total_earned_usd: number
  today_earned_usd: number
  total_requests: number
  paid_requests: number
  top_bots: BotStats[]
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

export interface HoneypotLog {
  id?: string
  creator_wallet: string
  bot_agent: string
  trap_path: string
  erc8004_agent_id?: string
  timestamp: string
}
