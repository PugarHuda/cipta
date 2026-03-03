import { createClient } from "@supabase/supabase-js"

const OPENROUTER_MODEL = "arcee-ai/trinity-large-preview:free"
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

interface PriceRecommendation {
  bot: string
  currentPrice: number
  recommendedPrice: number
  reason: string
  projectedDailyGain: number
}

interface OptimizerResult {
  recommendations: PriceRecommendation[]
  summary: string
  projectedMonthlyIncrease: number
}

/**
 * OptimizerAgent — AI agent yang analisis earnings kreator & rekomendasikan harga optimal.
 * Pakai OpenRouter (arcee-ai/trinity-large-preview:free) untuk analisis.
 */
export class OptimizerAgent {
  private openrouterKey: string
  private supabase: ReturnType<typeof createClient>

  constructor(config: { openrouterApiKey: string; supabaseUrl: string; supabaseKey: string }) {
    this.openrouterKey = config.openrouterApiKey
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey)
  }

  async analyzeAndOptimize(
    creatorWallet: string,
    currentDefaultPrice: number
  ): Promise<OptimizerResult> {
    console.log("[OptimizerAgent] Menganalisis data earnings 30 hari terakhir...")

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    type AccessLog = { bot_agent: string | null; status: string; amount_usd: number | null; timestamp: string }

    const { data: logs, error } = await this.supabase
      .from("access_logs")
      .select("bot_agent, status, amount_usd, timestamp")
      .eq("creator_wallet", creatorWallet)
      .gte("timestamp", thirtyDaysAgo.toISOString())
      .returns<AccessLog[]>()

    if (error) throw new Error(`Database error: ${error.message}`)
    if (!logs?.length) {
      return {
        recommendations: [],
        summary: "Belum ada data akses. Tunggu beberapa hari setelah memasang Cipta.",
        projectedMonthlyIncrease: 0,
      }
    }

    // Agregasi stats per bot
    const botMap: Record<string, { attempts: number; paid: number; earned: number }> = {}
    for (const log of logs) {
      const bot = log.bot_agent || "unknown"
      if (!botMap[bot]) botMap[bot] = { attempts: 0, paid: 0, earned: 0 }
      botMap[bot].attempts++
      if (log.status === "paid") {
        botMap[bot].paid++
        botMap[bot].earned += log.amount_usd || 0
      }
    }

    const botStats = Object.entries(botMap).map(([bot, stats]) => ({
      bot,
      ...stats,
      payRate: stats.attempts > 0 ? (stats.paid / stats.attempts) * 100 : 0,
      avgDailyRequests: stats.attempts / 30,
    }))

    const prompt = `Kamu adalah price optimization AI untuk platform Cipta (lindungi konten kreator dari AI scrapers).
Analisis data akses AI bot berikut dan rekomendasikan harga optimal per bot.

Data akses 30 hari terakhir:
${JSON.stringify(botStats, null, 2)}

Harga default saat ini: $${currentDefaultPrice} per request

ATURAN OPTIMASI:
- Bot dengan pay rate tinggi (>80%) → bisa dinaikkan harganya 2-3x
- Bot dengan pay rate rendah (<20%) → turunkan atau tetap sama
- Bot dengan volume tinggi → prioritas utama untuk optimasi
- Jangan naikkan terlalu agresif (max 5x dari harga awal)

Berikan rekomendasi dalam format JSON (tanpa teks lain, hanya JSON):
{
  "recommendations": [
    {
      "bot": "nama_bot",
      "currentPrice": 0.001,
      "recommendedPrice": 0.003,
      "reason": "alasan singkat",
      "projectedDailyGain": 0.50
    }
  ],
  "summary": "ringkasan singkat dalam bahasa Indonesia",
  "projectedMonthlyIncrease": 15.00
}`

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cipta.dev",
        "X-Title": "Cipta OptimizerAgent",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenRouter error ${response.status}: ${err}`)
    }

    const data = await response.json() as { choices: { message: { content: string } }[] }
    const text = data.choices[0]?.message?.content || ""

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("AI tidak return JSON yang valid")

    const result: OptimizerResult = JSON.parse(jsonMatch[0])
    console.log("[OptimizerAgent] Analisis selesai.")
    console.log(`[OptimizerAgent] ${result.recommendations.length} rekomendasi harga`)
    console.log(`[OptimizerAgent] Proyeksi kenaikan: +$${result.projectedMonthlyIncrease}/bulan`)

    return result
  }
}
