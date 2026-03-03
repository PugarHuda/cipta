import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )

  const [summaryRes, logsRes] = await Promise.all([
    supabase
      .from("honeypot_summary")
      .select("*")
      .eq("creator_wallet", wallet)
      .single(),
    supabase
      .from("honeypot_logs")
      .select("*")
      .eq("creator_wallet", wallet)
      .order("timestamp", { ascending: false })
      .limit(10),
  ])

  return NextResponse.json({
    summary: summaryRes.data || { total_traps: 0, unique_bots: 0, erc8004_agents_caught: 0 },
    recent: logsRes.data || [],
  })
}
