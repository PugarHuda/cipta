import { isbot } from "isbot"

// Daftar AI crawlers yang dikenal — ini yang kena paywall
const AI_CRAWLERS: Record<string, string> = {
  GPTBot: "OpenAI",
  ChatGPT: "OpenAI",
  "ClaudeBot": "Anthropic",
  "Claude-Web": "Anthropic",
  Googlebot: "Google",
  "Google-Extended": "Google",
  PerplexityBot: "Perplexity",
  "Perplexity-User": "Perplexity",
  YouBot: "You.com",
  FacebookBot: "Meta",
  "Meta-ExternalAgent": "Meta",
  Applebot: "Apple",
  Bytespider: "ByteDance/TikTok",
  Amazonbot: "Amazon",
  "cohere-ai": "Cohere",
  CCBot: "Common Crawl",
  DataForSeoBot: "DataForSEO",
  omgili: "Webz.io",
  "Diffbot": "Diffbot",
}

export interface BotDetectionResult {
  isBot: boolean
  isAIBot: boolean
  botName: string | null
  company: string | null
  userAgent: string
}

export function detectBot(userAgent: string): BotDetectionResult {
  if (!userAgent) {
    return { isBot: false, isAIBot: false, botName: null, company: null, userAgent }
  }

  // Cek apakah AI crawler yang dikenal
  for (const [botName, company] of Object.entries(AI_CRAWLERS)) {
    if (userAgent.toLowerCase().includes(botName.toLowerCase())) {
      return { isBot: true, isAIBot: true, botName, company, userAgent }
    }
  }

  // Fallback: cek generic bot detection
  const genericBot = isbot(userAgent)
  return {
    isBot: genericBot,
    isAIBot: false,
    botName: genericBot ? "unknown-bot" : null,
    company: null,
    userAgent,
  }
}

export function isWhitelisted(botName: string | null, whitelist: string[]): boolean {
  if (!botName) return false
  return whitelist.some((w) =>
    botName.toLowerCase().includes(w.toLowerCase())
  )
}
