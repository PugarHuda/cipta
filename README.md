# Cipta — Protect Your Content, Earn from AI

> **Built for Base Batches 003 · Student Track**

AI crawlers like GPTBot, ClaudeBot, and PerplexityBot scrape millions of articles, blogs, and creative works every day — for free. **Cipta** makes them pay. One line of code. USDC to your wallet. Automatically.

```ts
app.use(cipta({ wallet: "0xYOUR_WALLET", priceUSD: 0.001 }))
```

---

## How It Works

```
AI Bot visits your site
        │
        ▼
  Cipta detects bot User-Agent
        │
   ┌────┴────┐
   │  Bot?   │
   └────┬────┘
        │ Yes
        ▼
  HTTP 402 Payment Required
  { price: $0.001 USDC, payTo: "0xYOUR_WALLET" }
        │
        ▼
  Bot signs EIP-3009 USDC transfer
  (via x402 protocol on Base)
        │
        ▼
  ✅ Content delivered + USDC sent
  📊 Dashboard updates in real-time
```

Humans and whitelisted bots (e.g. Googlebot) pass through freely. Only AI scrapers pay.

---

## Features

- **One-line integration** — drop `cipta()` middleware into any Express app
- **15+ AI crawlers detected** — GPTBot, ClaudeBot, PerplexityBot, Bytespider, Amazonbot, and more
- **Per-bot pricing** — charge OpenAI 3x more than Perplexity if you want
- **Whitelist** — let Googlebot in for free (SEO stays intact)
- **USDC on Base** — payments via [x402 protocol](https://x402.org), gasless EIP-3009
- **Real-time dashboard** — earnings, bot activity, and charts via Supabase
- **AI price optimizer** — AI agent analyzes your access logs and recommends optimal pricing
- **Testnet ready** — Base Sepolia by default, one config change for mainnet

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Payment protocol | [x402](https://x402.org) (HTTP 402 + USDC on Base) |
| Blockchain | [Base](https://base.org) / Base Sepolia |
| Wallet integration | [OnchainKit](https://onchainkit.xyz) + Smart Wallet |
| Database | [Supabase](https://supabase.com) (Postgres + Realtime) |
| Dashboard | Next.js 15 + React 19 + Recharts |
| AI optimizer | OpenRouter (`arcee-ai/trinity-large-preview`) |
| Monorepo | Turborepo |

---

## Project Structure

```
cipta/
├── packages/
│   ├── middleware/        # @cipta/middleware — core Express middleware
│   │   └── src/
│   │       ├── index.ts          # cipta() main export
│   │       ├── bot-detector.ts   # AI crawler detection
│   │       ├── tracker.ts        # Supabase earnings logger
│   │       └── types.ts          # TypeScript interfaces
│   │
│   └── agent/             # @cipta/agent — AI agents
│       └── src/
│           ├── payer-agent.ts    # Auto-pays 402 responses in USDC
│           └── optimizer-agent.ts # AI-powered price recommendations
│
├── apps/
│   ├── demo/              # Express demo server (protected content)
│   └── dashboard/         # Next.js creator dashboard
│
└── supabase/
    └── migrations/        # Database schema
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/PugarHuda/cipta.git
cd cipta
npm install
```

### 2. Setup Environment

```bash
# Dashboard
cp apps/dashboard/.env.example apps/dashboard/.env.local

# Demo server
cp apps/demo/.env.example apps/demo/.env
```

Fill in your values:

**`apps/dashboard/.env.local`**
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=   # from portal.cdp.coinbase.com
NEXT_PUBLIC_SUPABASE_URL=         # from supabase.com
NEXT_PUBLIC_SUPABASE_KEY=         # anon public key
OPENROUTER_API_KEY=               # from openrouter.ai (free tier available)
```

**`apps/demo/.env`**
```env
CREATOR_WALLET_ADDRESS=0xYOUR_WALLET
SUPABASE_URL=
SUPABASE_KEY=
```

### 3. Setup Database

```bash
# Install Supabase CLI (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Link and push schema
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or run `supabase/schema.sql` manually in the Supabase SQL Editor.

### 4. Run

```bash
# Terminal 1 — Demo server (port 3001)
cd apps/demo && npx tsx src/server.ts

# Terminal 2 — Dashboard (port 3000)
cd apps/dashboard && npm run dev
```

---

## Using the Middleware

```bash
npm install @cipta/middleware
```

```ts
import express from "express"
import { cipta } from "@cipta/middleware"

const app = express()

app.use(cipta({
  wallet: "0xYOUR_WALLET_ADDRESS",   // receives USDC
  priceUSD: 0.001,                   // $0.001 default per request
  network: "base-sepolia",           // or "base" for mainnet
  whitelist: ["Googlebot"],          // these bots get in free
  botPricing: {
    GPTBot: 0.003,                   // OpenAI pays 3x
    ClaudeBot: 0.002,                // Anthropic pays 2x
  },
  supabaseUrl: process.env.SUPABASE_URL,     // optional tracking
  supabaseKey: process.env.SUPABASE_KEY,
}))

app.get("/content/:slug", (req, res) => {
  res.json({ content: "your protected content" })
})
```

When a bot hits `/content/*`:
1. Cipta detects the bot User-Agent
2. Returns `HTTP 402` with USDC payment requirements
3. x402-compatible bots pay automatically
4. Content is delivered + earnings logged

---

## Detected AI Crawlers

| Bot | Company | Default Price |
|-----|---------|--------------|
| GPTBot | OpenAI | configurable |
| ChatGPT-User | OpenAI | configurable |
| ClaudeBot | Anthropic | configurable |
| Claude-Web | Anthropic | configurable |
| PerplexityBot | Perplexity | configurable |
| Bytespider | ByteDance/TikTok | configurable |
| Amazonbot | Amazon | configurable |
| FacebookBot | Meta | configurable |
| Meta-ExternalAgent | Meta | configurable |
| YouBot | You.com | configurable |
| Applebot | Apple | configurable |
| cohere-ai | Cohere | configurable |
| CCBot | Common Crawl | configurable |
| Google-Extended | Google | configurable |
| Diffbot | Diffbot | configurable |

---

## AI Price Optimizer

The `OptimizerAgent` analyzes 30 days of access logs and recommends optimal pricing per bot using AI.

```ts
import { OptimizerAgent } from "@cipta/agent"

const optimizer = new OptimizerAgent({
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
})

const result = await optimizer.analyzeAndOptimize("0xYOUR_WALLET", 0.001)
// {
//   recommendations: [
//     { bot: "GPTBot", currentPrice: 0.001, recommendedPrice: 0.003, reason: "Pay rate 95%" }
//   ],
//   summary: "...",
//   projectedMonthlyIncrease: 12.50
// }
```

---

## How x402 Works

x402 is an open payment protocol built on HTTP 402 ("Payment Required"):

1. Server returns `402` with payment requirements (price, network, payTo address)
2. Client signs a USDC `transferWithAuthorization` (EIP-3009) — gasless for the payer
3. Client retries with `X-PAYMENT` header containing the signed authorization
4. Facilitator at [x402.org](https://x402.org) verifies + settles on-chain
5. Creator receives USDC directly to their wallet

No intermediary holds funds. No custodial risk. Direct wallet-to-wallet.

---

## Dashboard

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) and connect your wallet to see:

- **Total earnings** (all-time + today)
- **30-day earnings chart**
- **Top bots** by revenue
- **Recent activity** log with real-time updates
- **Embed code** for quick integration
- **AI optimizer** — get price recommendations

---

## License

MIT — built with ❤️ for Base Batches 003
