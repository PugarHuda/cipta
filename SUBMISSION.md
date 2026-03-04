# Cipta — Hackathon Submission

**Track:** Base Batches 003 · Student Track
**Team:** Pugar Huda Mantoro

---

## TL;DR

AI crawlers scrape millions of blogs and creative works every day — for free.
**Cipta** makes them pay. One line of code. USDC or ETH. Directly to your wallet.

```ts
app.use(cipta({ wallet: "0xYOUR_WALLET", priceUSD: 0.001 }))
```

---

## Live Links

| | URL |
|--|--|
| Dashboard | https://cipta.vercel.app |
| Demo Server | https://cipta-demo.railway.app |
| npm | https://www.npmjs.com/package/@cipta/middleware |
| GitHub | https://github.com/PugarHuda/cipta |

---

## What Was Built

### 1. `@cipta/middleware` — Express Middleware
Drop-in protection for any Node.js server. Detects 15+ AI crawlers by User-Agent and requires micropayment before serving content.

**Payment options:**
- **x402/USDC** — HTTP 402 + EIP-3009 gasless transfer via x402.org facilitator
- **ETH** — Native ETH with on-chain tx verification via viem

### 2. ERC-8004 Reputation System
Agents with verified on-chain identity get automatic discounts:
- Score ≥ 90 → TRUSTED → **−40% off**
- Score ≥ 75 → VERIFIED → **−20% off**

After each paid access: `giveFeedback(positive)` on-chain.
After honeypot: `giveFeedback(negative)` → future requests cost full price.

### 3. Honeypot Trap
`robots.txt` lists `/cipta-trap/*` as Disallow.
Disobedient scrapers that ignore robots.txt get logged + negative reputation.

### 4. Creator Dashboard (Next.js 15)
- **Overview** — earnings KPIs, 30-day chart, live bot activity feed
- **Bots** — leaderboard by revenue, ERC-8004 reputation badges
- **Honeypot** — capture log with agent IDs
- **Payments** — full transaction history (x402/ETH/free), filterable, Basescan links
- **Settings** — wallet info + integration code for 4 platforms

### 5. PayerAgent & OptimizerAgent
- `PayerAgent` — AI agent that auto-pays 402 responses using x402 protocol
- `OptimizerAgent` — LLM (via OpenRouter) analyzes 30-day logs, recommends optimal pricing

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Payment | [x402](https://x402.org) — HTTP 402 + USDC EIP-3009 |
| ETH verification | [viem](https://viem.sh) |
| Agent identity | [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) |
| Blockchain | Base / Base Sepolia |
| Wallet | [OnchainKit](https://onchainkit.xyz) + Smart Wallet |
| Database | [Supabase](https://supabase.com) — Postgres + Realtime |
| Dashboard | Next.js 15 + React 19 + Recharts + Tailwind |
| AI optimizer | OpenRouter (`arcee-ai/trinity-large-preview`) |
| Monorepo | Turborepo |

---

## How to Test

### Option A — Live Demo (Easiest)
1. Visit https://cipta.vercel.app
2. Connect wallet (Base Sepolia)
3. Copy integration code from Settings tab
4. Visit https://cipta-demo.railway.app/robots.txt — see honeypot trap

### Option B — Local Setup

```bash
git clone https://github.com/PugarHuda/cipta.git
cd cipta
npm install

# Setup env
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/demo/.env.example apps/demo/.env
# Fill in your Supabase + OnchainKit credentials

# Run Supabase migrations
supabase link --project-ref YOUR_REF
supabase db push

# Start both apps
npm run dev
```

Then:
- Dashboard: http://localhost:3000
- Demo server: http://localhost:3001
- Test bot detection: `curl -A "GPTBot/1.0" http://localhost:3001/content/artikel-1`
- Test honeypot: `curl http://localhost:3001/cipta-trap/test`
- Run demo agent: `cd packages/agent && npm run demo`

### Option C — curl Test (No Setup)
```bash
# 1. Bot kena 402 Payment Required
curl -A "GPTBot/1.0" https://cipta-demo.railway.app/content/artikel-defi-2026

# 2. robots.txt — semua AI bots listed sebagai Disallow
curl https://cipta-demo.railway.app/robots.txt

# 3. Honeypot — scraper kena trap, return fake content
curl https://cipta-demo.railway.app/cipta-trap/test

# 4. Browser biasa — pass through gratis
curl https://cipta-demo.railway.app/content/artikel-defi-2026

# 5. Health check
curl https://cipta-demo.railway.app/health
```

**Creator wallet:** `0x0fc7b2C6Ed68f4553F4b2c7B52d4269a673B666f`
Semua pembayaran USDC/ETH masuk ke wallet ini di Base Sepolia.

---

## Test Results

```
Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total

✓ Bot detection (GPTBot, ClaudeBot, PerplexityBot, Bytespider...)
✓ Whitelist (Googlebot passes free)
✓ Payment gate (browser passes, bot gets 402)
✓ ETH price conversion (priceUsdToWei)
✓ Honeypot trap (all UAs caught, returns fake content)
✓ robots.txt generation (all AI bots listed)
```

---

## Base-Specific Features

| Feature | How it uses Base |
|---------|-----------------|
| USDC payments | EIP-3009 gasless transfers on Base |
| ETH payments | Native ETH on Base Sepolia / Base mainnet |
| ERC-8004 | IdentityRegistry + ReputationRegistry on Base |
| Wallet connect | OnchainKit + Coinbase Smart Wallet |
| tx links | All payments link to Basescan |

---

## Known Limitations

- ERC-8004 contract calls require SIGNER_KEY env var for on-chain feedback (optional feature)
- x402 facilitator (x402.org) must be available for USDC payment verification
- ETH price hardcoded at ~$3500/ETH estimate for wei conversion

---

## What's Next

- Publish `@cipta/middleware` to npm
- WordPress plugin (PHP wrapper)
- Per-route pricing (charge more for high-value endpoints)
- Revenue sharing (split earnings between multiple wallets)
