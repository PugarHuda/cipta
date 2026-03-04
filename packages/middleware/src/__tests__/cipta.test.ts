/**
 * Tests untuk cipta() middleware — core payment gate
 */
import express, { Express } from "express"
import request from "supertest"

// Mock dependencies sebelum import cipta
jest.mock("x402-express", () => ({
  paymentMiddleware: jest.fn(() => (_req: any, res: any) => {
    res.status(402).json({ error: "Payment Required" })
  }),
}))

jest.mock("../tracker", () => ({
  initTracker: jest.fn(),
  logAccess: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../erc8004", () => ({
  getAgentReputation: jest.fn().mockResolvedValue(null),
  getReputationDiscount: jest.fn().mockReturnValue(0),
  giveAgentFeedback: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../eth-verifier", () => ({
  verifyETHPayment: jest.fn().mockResolvedValue({ success: false, error: "no tx" }),
  priceUsdToWei: jest.fn().mockReturnValue(BigInt("285714285714285")),
}))

import { cipta } from "../index"

function makeApp(config = {}) {
  const app: Express = express()
  app.use(cipta({
    wallet: "0x1234567890123456789012345678901234567890",
    priceUSD: 0.001,
    network: "base-sepolia",
    ...config,
  }))
  app.get("/content", (_req, res) => res.json({ data: "protected" }))
  return app
}

describe("cipta() middleware", () => {
  test("Browser biasa (bukan bot) → pass through, dapat konten", async () => {
    const app = makeApp()
    const res = await request(app)
      .get("/content")
      .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0) Chrome/120.0")

    expect(res.status).toBe(200)
    expect(res.body.data).toBe("protected")
  })

  test("Bot GPTBot tanpa payment → 402 Payment Required", async () => {
    const app = makeApp()
    const res = await request(app)
      .get("/content")
      .set("User-Agent", "GPTBot/1.0 (+https://openai.com/gptbot)")

    expect(res.status).toBe(402)
  })

  test("Bot di whitelist → pass through gratis", async () => {
    const app = makeApp({ whitelist: ["Googlebot"] })
    const res = await request(app)
      .get("/content")
      .set("User-Agent", "Googlebot/2.1 (+http://www.google.com/bot.html)")

    expect(res.status).toBe(200)
  })

  test("Bot ClaudeBot tanpa payment → 402", async () => {
    const app = makeApp()
    const res = await request(app)
      .get("/content")
      .set("User-Agent", "ClaudeBot/1.0")

    expect(res.status).toBe(402)
  })

  test("Bot PerplexityBot tanpa payment → 402", async () => {
    const app = makeApp()
    const res = await request(app)
      .get("/content")
      .set("User-Agent", "PerplexityBot/1.0")

    expect(res.status).toBe(402)
  })

  test("Tanpa user-agent → pass through (bukan bot)", async () => {
    const app = makeApp()
    const res = await request(app).get("/content")

    expect(res.status).toBe(200)
  })
})
