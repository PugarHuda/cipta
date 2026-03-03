import { createClient, SupabaseClient } from "@supabase/supabase-js"
import type { AccessLog, CreatorEarnings, BotStats } from "./types"

let supabase: SupabaseClient | null = null

export function initTracker(supabaseUrl: string, supabaseKey: string) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function logAccess(log: Omit<AccessLog, "id">): Promise<void> {
  if (!supabase) return // Tracking opsional, skip kalau tidak dikonfigurasi

  const { error } = await supabase.from("access_logs").insert(log)
  if (error) console.error("[Cipta] Failed to log access:", error.message)
}

export async function getEarnings(creatorWallet: string): Promise<CreatorEarnings> {
  if (!supabase) {
    return { total_earned_usd: 0, today_earned_usd: 0, total_requests: 0, paid_requests: 0, top_bots: [] }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [allLogs, todayLogs] = await Promise.all([
    supabase
      .from("access_logs")
      .select("*")
      .eq("creator_wallet", creatorWallet),
    supabase
      .from("access_logs")
      .select("*")
      .eq("creator_wallet", creatorWallet)
      .gte("timestamp", today.toISOString()),
  ])

  const logs: AccessLog[] = allLogs.data || []
  const todayData: AccessLog[] = todayLogs.data || []

  // Hitung total earnings
  const total_earned_usd = logs
    .filter((l) => l.status === "paid")
    .reduce((sum, l) => sum + (l.amount_usd || 0), 0)

  const today_earned_usd = todayData
    .filter((l) => l.status === "paid")
    .reduce((sum, l) => sum + (l.amount_usd || 0), 0)

  // Stats per bot
  const botMap: Record<string, BotStats> = {}
  for (const log of logs) {
    if (!botMap[log.bot_agent]) {
      botMap[log.bot_agent] = {
        bot_agent: log.bot_agent,
        total_requests: 0,
        total_paid: 0,
        total_earned_usd: 0,
        last_seen: log.timestamp,
      }
    }
    botMap[log.bot_agent].total_requests++
    if (log.status === "paid") {
      botMap[log.bot_agent].total_paid++
      botMap[log.bot_agent].total_earned_usd += log.amount_usd || 0
    }
    if (log.timestamp > botMap[log.bot_agent].last_seen) {
      botMap[log.bot_agent].last_seen = log.timestamp
    }
  }

  const top_bots = Object.values(botMap)
    .sort((a, b) => b.total_earned_usd - a.total_earned_usd)
    .slice(0, 10)

  return {
    total_earned_usd,
    today_earned_usd,
    total_requests: logs.length,
    paid_requests: logs.filter((l) => l.status === "paid").length,
    top_bots,
  }
}
