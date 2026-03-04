# Cipta — Monetize Your Content for AI Agents

> **Built for Base Batches 003 · Student Track**

AI crawlers like GPTBot, ClaudeBot, and PerplexityBot scrape millions of articles, blogs, and creative works every day — for free. **Cipta** makes them pay. One line of code. USDC or ETH to your wallet. Automatically.

```ts
app.use(cipta({ wallet: "0xYOUR_WALLET", priceUSD: 0.001 }))
```

🔗 **Live Demo:** https://cipta-demo-production.up.railway.app
📊 **Dashboard:** https://cipta.vercel.app
📦 **npm:** `npm install @cipta/middleware`

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
- **15+ AI crawlers detected** — GPTBot, ClaudeBot, PerplexityBot, Bytespider, and more
- **x402 USDC payments** — gasless EIP-3009 micropayments on Base
- **ETH payments** — native ETH support with `X-ETH-TX-HASH` header verification
- **ERC-8004 reputation discounts** — trusted agents (score ≥ 90) get 40% off
- **Honeypot trap** — `/cipta-trap/*` catches disobedient scrapers, logs + gives negative reputation
- **Whitelist** — Googlebot gets in free (SEO stays intact)
- **Real-time dashboard** — earnings, bot leaderboard, payment history, honeypot logs
- **AI price optimizer** — LLM analyzes access logs and recommends optimal pricing
- **Testnet ready** — Base Sepolia by default, one config change for mainnet

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Payment protocol | [x402](https://x402.org) (HTTP 402 + USDC on Base) |
| ETH verification | [viem](https://viem.sh) — `getTransactionReceipt` |
| Blockchain | [Base](https://base.org) / Base Sepolia |
| Agent identity | [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) IdentityRegistry + ReputationRegistry |
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
│   │       ├── erc8004.ts        # ERC-8004 reputation client
│   │       ├── eth-verifier.ts   # ETH payment verifier (viem)
│   │       ├── honeypot.ts       # Honeypot trap router
│   │       ├── tracker.ts        # Supabase earnings logger
│   │       └── types.ts          # TypeScript interfaces
│   │
│   └── agent/             # @cipta/agent — AI agents
│       └── src/
│           ├── payer-agent.ts    # Auto-pays 402 responses in USDC
│           └── optimizer-agent.ts # AI-powered price recommendations
│
├── apps/
│   ├── demo/              # Express demo server (Railway)
│   └── dashboard/         # Next.js creator dashboard (Vercel)
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
NETWORK=base-sepolia
# SIGNER_KEY=0xYOUR_PRIVATE_KEY   # for ERC-8004 on-chain feedback
```

### 3. Setup Database

```bash
# Link and push schema
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or run `supabase/migrations/` manually in the Supabase SQL Editor.

### 4. Run

```bash
# From repo root (Turborepo — runs both in parallel)
npm run dev

# Or individually:
# Terminal 1 — Demo server (port 3001)
cd apps/demo && npm run dev

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
import { cipta, ciptaHoneypot, generateRobotsTxt } from "@cipta/middleware"

const app = express()

// Honeypot — catch disobedient scrapers
app.use(ciptaHoneypot({ wallet: "0xYOUR_WALLET" }))

// robots.txt — tells compliant bots to avoid the trap
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(generateRobotsTxt("/cipta-trap/"))
})

// Payment middleware
app.use(cipta({
  wallet: "0xYOUR_WALLET_ADDRESS",  // receives USDC + ETH
  priceUSD: 0.001,                          // $0.001 default per request
  network: "base-sepolia",                  // or "base" for mainnet
  erc8004: true,                            // reputation-based discounts
  ethPayment: true,                         // accept native ETH too
  whitelist: ["Googlebot"],                 // these bots pass for free
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
}))
```

---

## ERC-8004 Reputation Discounts

When `erc8004: true`, agents with verified on-chain reputation get automatic discounts:

| Score | Tier | Discount |
|-------|------|----------|
| ≥ 90 | TRUSTED | −40% |
| ≥ 75 | VERIFIED | −20% |
| < 75 | UNKNOWN | 0% |

After each paid access, the middleware calls `giveFeedback(positive)` on-chain to build agent reputation.
Honeypot traps trigger `giveFeedback(negative)`.

---

## Honeypot Trap

`robots.txt` lists `/cipta-trap/*` as Disallow. Compliant agents skip it.
Disobedient scrapers that visit the trap get:
1. Logged in `honeypot_logs` table
2. Negative ERC-8004 reputation feedback
3. Future requests cost full price (no discount)

---

## Detected AI Crawlers

| Bot | Company |
|-----|---------|
| GPTBot | OpenAI |
| ChatGPT-User | OpenAI |
| ClaudeBot | Anthropic |
| Claude-Web | Anthropic |
| PerplexityBot | Perplexity |
| Bytespider | ByteDance/TikTok |
| Amazonbot | Amazon |
| FacebookBot | Meta |
| YouBot | You.com |
| Applebot | Apple |
| cohere-ai | Cohere |
| CCBot | Common Crawl |
| Google-Extended | Google |
| Diffbot | Diffbot |

---

## Dashboard

Connect your wallet at [https://cipta.vercel.app/dashboard](https://cipta.vercel.app/dashboard) to see:

- **Overview** — earnings KPIs, 30-day chart, bot leaderboard, honeypot status, embed code
- **Bots** — all detected agents, sortable by earnings / requests / paid
- **Honeypot** — capture log with ERC-8004 agent IDs
- **Payments** — transaction history (x402 USDC, ETH, whitelist), filterable, Basescan links
- **Settings** — wallet info, integration code (Node.js / WordPress / Static HTML / Vercel Edge)

---

## Deployment

### Dashboard → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# From apps/dashboard
cd apps/dashboard
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_KEY
vercel env add OPENROUTER_API_KEY
```

### Demo Server → Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# From apps/demo
cd apps/demo
railway login
railway init
railway up

# Set environment variables:
railway variables set CREATOR_WALLET_ADDRESS=0xYOUR_WALLET
railway variables set SUPABASE_URL=https://xxx.supabase.co
railway variables set SUPABASE_KEY=your_anon_key
railway variables set NETWORK=base-sepolia
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

## License

MIT — built with ❤️ for Base Batches 003
