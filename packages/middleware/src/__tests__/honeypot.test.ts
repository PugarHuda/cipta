/**
 * Tests untuk honeypot trap + robots.txt generator
 */
import express from "express"
import request from "supertest"

jest.mock("../tracker", () => ({
  logHoneypot: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../erc8004", () => ({
  giveAgentFeedback: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../bot-detector", () => ({
  detectBot: jest.fn((ua: string) => ({
    isBot: ua.includes("Bot") || ua.includes("bot"),
    isAIBot: ua.includes("GPTBot") || ua.includes("ClaudeBot"),
    botName: ua.split("/")[0],
    company: "TestCo",
  })),
}))

import { ciptaHoneypot, generateRobotsTxt } from "../honeypot"

function makeHoneypotApp() {
  const app = express()
  app.use("/cipta-trap", ciptaHoneypot({
    wallet: "0x1234567890123456789012345678901234567890",
    network: "base-sepolia",
  }))
  return app
}

describe("ciptaHoneypot()", () => {
  test("Request ke trap path → 200 dengan fake content", async () => {
    const app = makeHoneypotApp()
    const res = await request(app)
      .get("/cipta-trap/artikel-premium")
      .set("User-Agent", "GPTBot/1.0")

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("title")
    expect(res.body._trap).toBe(true)
  })

  test("Semua method di-trap (POST juga)", async () => {
    const app = makeHoneypotApp()
    const res = await request(app)
      .post("/cipta-trap/data")
      .set("User-Agent", "ClaudeBot/1.0")

    expect(res.status).toBe(200)
    expect(res.body._trap).toBe(true)
  })

  test("Bot biasa (bukan AI) juga di-trap", async () => {
    const app = makeHoneypotApp()
    const res = await request(app)
      .get("/cipta-trap/konten")
      .set("User-Agent", "Scraper/1.0")

    expect(res.status).toBe(200)
    expect(res.body._trap).toBe(true)
  })
})

describe("generateRobotsTxt()", () => {
  test("Mengandung Disallow untuk path yang diberikan", () => {
    const txt = generateRobotsTxt("/cipta-trap/")
    expect(txt).toContain("Disallow: /cipta-trap/")
  })

  test("Mengandung Allow untuk Googlebot", () => {
    const txt = generateRobotsTxt("/cipta-trap/")
    expect(txt).toContain("User-agent: Googlebot")
    expect(txt).toContain("Allow: /")
  })

  test("Mengandung rule untuk semua AI bots utama", () => {
    const txt = generateRobotsTxt("/cipta-trap/")
    expect(txt).toContain("GPTBot")
    expect(txt).toContain("ClaudeBot")
    expect(txt).toContain("PerplexityBot")
    expect(txt).toContain("Bytespider")
  })

  test("Default path adalah /cipta-trap/", () => {
    const txt = generateRobotsTxt()
    expect(txt).toContain("Disallow: /cipta-trap/")
  })

  test("Custom path didukung", () => {
    const txt = generateRobotsTxt("/my-trap/")
    expect(txt).toContain("Disallow: /my-trap/")
    expect(txt).not.toContain("Disallow: /cipta-trap/")
  })
})
