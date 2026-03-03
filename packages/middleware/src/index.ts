import type { Request, Response, NextFunction } from "express"
import { paymentMiddleware } from "x402-express"
import { detectBot, isWhitelisted } from "./bot-detector"
import { initTracker, logAccess } from "./tracker"
import { getAgentReputation, getReputationDiscount, giveAgentFeedback } from "./erc8004"
import { verifyETHPayment, priceUsdToWei } from "./eth-verifier"
import type { CiptaConfig } from "./types"

export { getEarnings } from "./tracker"
export { ciptaHoneypot, generateRobotsTxt } from "./honeypot"
export type { CiptaConfig, AccessLog, CreatorEarnings, BotStats, HoneypotLog, ERC8004Summary } from "./types"

const FACILITATOR_URL = "https://x402.org/facilitator"

/**
 * Cipta middleware — protect your content from AI scrapers.
 * Supports x402/USDC payments, ETH payments, and ERC-8004 reputation pricing.
 *
 * @example
 * app.use(cipta({
 *   wallet: "0xYOUR_WALLET",
 *   priceUSD: 0.001,
 *   erc8004: true,            // enable reputation-based pricing
 *   ethPayment: true,         // accept ETH as payment
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
    erc8004 = false,
    signerKey,
    ethPayment = false,
  } = config

  if (supabaseUrl && supabaseKey) {
    initTracker(supabaseUrl, supabaseKey)
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"] || ""
    const { isBot, botName } = detectBot(userAgent)

    if (!isBot) return next()

    const timestamp = new Date().toISOString()

    // Whitelisted bot → free pass
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

    // Base price
    let price = botName && botPricing[botName] ? botPricing[botName] : priceUSD
    let reputationScore: number | undefined
    let erc8004AgentId: string | undefined

    // ── ERC-8004 reputation discount ────────────────────────────────
    if (erc8004) {
      const agentAddress = req.headers["x-erc8004-address"] as string | undefined
      if (agentAddress) {
        const summary = await getAgentReputation(agentAddress, network)
        if (summary) {
          reputationScore = summary.score
          erc8004AgentId = summary.agentId
          const discount = getReputationDiscount(summary.score)
          if (discount > 0) {
            price = parseFloat((price * (1 - discount)).toFixed(6))
            console.log(
              `[Cipta ERC-8004] Agent ${agentAddress} score=${summary.score} → ${Math.round(discount * 100)}% discount → $${price}`
            )
          }
        }
      }
    }

    // Log attempt
    await logAccess({
      creator_wallet: wallet,
      bot_agent: botName || userAgent,
      path: req.path,
      status: "attempted",
      erc8004_agent_id: erc8004AgentId,
      erc8004_score: reputationScore,
      timestamp,
    })

    // ── ETH Payment path ─────────────────────────────────────────────
    if (ethPayment) {
      const ethTxHash = req.headers["x-eth-tx-hash"] as string | undefined
      if (ethTxHash) {
        const requiredWei = priceUsdToWei(price)
        const result = await verifyETHPayment(
          ethTxHash as `0x${string}`,
          wallet as `0x${string}`,
          requiredWei,
          network
        )

        if (result.success) {
          await logAccess({
            creator_wallet: wallet,
            bot_agent: botName || userAgent,
            path: req.path,
            status: "paid",
            amount_usd: price,
            tx_hash: ethTxHash,
            payment_type: "eth",
            erc8004_agent_id: erc8004AgentId,
            erc8004_score: reputationScore,
            timestamp: new Date().toISOString(),
          })

          // Positive ERC-8004 feedback after successful ETH payment
          if (erc8004 && signerKey && erc8004AgentId) {
            giveAgentFeedback(
              erc8004AgentId,
              true,
              `Paid ${price} USD via ETH for content access`,
              signerKey,
              network
            ).catch(() => {})
          }

          return next()
        }

        // ETH tx invalid → return 402 with both payment options
        return res.status(402).json({
          error: "ETH payment verification failed",
          reason: result.error,
          payment: {
            eth: {
              to: wallet,
              amount_usd: price,
              network,
              instructions: "Send ETH to the address above, then retry with X-ETH-TX-HASH header",
            },
            usdc: {
              protocol: "x402",
              facilitator: FACILITATOR_URL,
              price: `$${price}`,
              network,
            },
          },
        })
      }
    }

    // ── x402 / USDC payment path ─────────────────────────────────────
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
      const txHash = (req.headers["x-payment-response"] as string) || undefined

      await logAccess({
        creator_wallet: wallet,
        bot_agent: botName || userAgent,
        path: req.path,
        status: "paid",
        amount_usd: price,
        tx_hash: txHash,
        payment_type: "x402",
        erc8004_agent_id: erc8004AgentId,
        erc8004_score: reputationScore,
        timestamp: new Date().toISOString(),
      })

      // Positive ERC-8004 feedback
      if (erc8004 && signerKey && erc8004AgentId) {
        giveAgentFeedback(
          erc8004AgentId,
          true,
          `Paid ${price} USD via x402/USDC for content access`,
          signerKey,
          network
        ).catch(() => {})
      }

      next()
    })
  }
}
