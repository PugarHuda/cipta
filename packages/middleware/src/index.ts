import type { Request, Response, NextFunction } from "express"
import { paymentMiddleware } from "x402-express"
import { detectBot, isWhitelisted } from "./bot-detector"
import { initTracker, logAccess } from "./tracker"
import type { CiptaConfig } from "./types"

export { getEarnings } from "./tracker"
export type { CiptaConfig, AccessLog, CreatorEarnings, BotStats } from "./types"

const FACILITATOR_URL = "https://x402.org/facilitator"

/**
 * Cipta middleware — satu baris untuk lindungi kontenmu dari AI scrapers
 *
 * @example
 * app.use(cipta({
 *   wallet: "0xALAMAT_KAMU",
 *   priceUSD: 0.001,
 * }))
 */
export function cipta(config: CiptaConfig) {
  const {
    wallet,
    priceUSD,
    network = "base-sepolia",
    whitelist = [],
    botPricing = {},
    supabaseUrl,
    supabaseKey,
  } = config

  // Init tracker kalau Supabase dikonfigurasi
  if (supabaseUrl && supabaseKey) {
    initTracker(supabaseUrl, supabaseKey)
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"] || ""
    const { isBot, isAIBot, botName, company } = detectBot(userAgent)

    // Bukan bot sama sekali → langsung lewat
    if (!isBot) return next()

    const timestamp = new Date().toISOString()

    // Bot di whitelist → lewat gratis + catat
    if (botName && isWhitelisted(botName, whitelist)) {
      await logAccess({
        creator_wallet: wallet,
        bot_agent: botName || userAgent,
        path: req.path,
        status: "whitelisted",
        timestamp,
      })
      return next()
    }

    // Tentukan harga: cek botPricing dulu, fallback ke priceUSD default
    const price = botName && botPricing[botName]
      ? botPricing[botName]
      : priceUSD

    // Catat attempt
    await logAccess({
      creator_wallet: wallet,
      bot_agent: botName || userAgent,
      path: req.path,
      status: "attempted",
      timestamp,
    })

    // Terapkan x402 paywall
    const routeKey = `${req.method} ${req.path}`
    const x402Handler = paymentMiddleware(
      wallet as `0x${string}`,
      {
        [routeKey]: {
          price: `$${price}`,
          network,
        },
      },
      { url: FACILITATOR_URL }
    )

    return x402Handler(req, res, async () => {
      // Payment sukses → catat earnings
      await logAccess({
        creator_wallet: wallet,
        bot_agent: botName || userAgent,
        path: req.path,
        status: "paid",
        amount_usd: price,
        timestamp: new Date().toISOString(),
      })

      next()
    })
  }
}
