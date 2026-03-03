import { detectBot, isWhitelisted } from "../bot-detector"

describe("detectBot", () => {
  test("GPTBot → terdeteksi sebagai AI bot OpenAI", () => {
    const result = detectBot("GPTBot/1.0 (+https://openai.com/gptbot)")
    expect(result.isBot).toBe(true)
    expect(result.isAIBot).toBe(true)
    expect(result.botName).toBe("GPTBot")
    expect(result.company).toBe("OpenAI")
  })

  test("ClaudeBot → terdeteksi sebagai AI bot Anthropic", () => {
    const result = detectBot("ClaudeBot/1.0")
    expect(result.isBot).toBe(true)
    expect(result.isAIBot).toBe(true)
    expect(result.company).toBe("Anthropic")
  })

  test("Browser biasa → bukan bot", () => {
    const result = detectBot("Mozilla/5.0 (Windows NT 10.0) Chrome/120.0")
    expect(result.isBot).toBe(false)
    expect(result.isAIBot).toBe(false)
  })

  test("User agent kosong → bukan bot", () => {
    const result = detectBot("")
    expect(result.isBot).toBe(false)
  })

  test("PerplexityBot → terdeteksi", () => {
    const result = detectBot("PerplexityBot/1.0")
    expect(result.isAIBot).toBe(true)
    expect(result.company).toBe("Perplexity")
  })
})

describe("isWhitelisted", () => {
  test("Bot di whitelist → true", () => {
    expect(isWhitelisted("Googlebot", ["Googlebot"])).toBe(true)
  })

  test("Bot tidak di whitelist → false", () => {
    expect(isWhitelisted("GPTBot", ["Googlebot"])).toBe(false)
  })

  test("Case insensitive matching", () => {
    expect(isWhitelisted("googlebot", ["Googlebot"])).toBe(true)
  })

  test("Bot null → false", () => {
    expect(isWhitelisted(null, ["Googlebot"])).toBe(false)
  })
})
