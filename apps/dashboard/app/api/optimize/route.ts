import { NextRequest, NextResponse } from "next/server"
import { OptimizerAgent } from "../../../lib/optimizer-agent"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { wallet, currentPrice } = await req.json()
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

  const openrouterKey = process.env.OPENROUTER_API_KEY
  if (!openrouterKey) return NextResponse.json({ error: "OPENROUTER_API_KEY not set" }, { status: 500 })

  const optimizer = new OptimizerAgent({
    openrouterApiKey: openrouterKey,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  })

  const result = await optimizer.analyzeAndOptimize(wallet, currentPrice ?? 0.001)
  return NextResponse.json(result)
}
