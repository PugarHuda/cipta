import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: logs } = await supabase
    .from("access_logs")
    .select("status, amount_usd, timestamp")
    .eq("creator_wallet", wallet)

  if (!logs) return NextResponse.json({ error: "fetch failed" }, { status: 500 })

  const total_earned_usd = logs
    .filter((l) => l.status === "paid")
    .reduce((sum, l) => sum + (l.amount_usd || 0), 0)

  const today_earned_usd = logs
    .filter((l) => l.status === "paid" && new Date(l.timestamp) >= today)
    .reduce((sum, l) => sum + (l.amount_usd || 0), 0)

  return NextResponse.json({
    total_earned_usd,
    today_earned_usd,
    total_requests: logs.length,
    paid_requests: logs.filter((l) => l.status === "paid").length,
  })
}
