/**
 * ERC-8004 Trustless AI Agent Standard
 * IdentityRegistry + ReputationRegistry on Base & Base Sepolia
 *
 * Docs: https://eips.ethereum.org/EIPS/eip-8004
 */
import { createPublicClient, createWalletClient, http, parseAbi } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { base, baseSepolia } from "viem/chains"
import type { ERC8004Summary } from "./types"

// ─── Contract Addresses ──────────────────────────────────────────────
const ADDRESSES = {
  "base-sepolia": {
    IdentityRegistry: "0x8004A818BFB912233c491871b3d84c89A494BD9e" as `0x${string}`,
    ReputationRegistry: "0x8004B663056A597Dffe9eCcC1965A193B7388713" as `0x${string}`,
  },
  base: {
    IdentityRegistry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as `0x${string}`,
    ReputationRegistry: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63" as `0x${string}`,
  },
}

// ─── Minimal ABIs ────────────────────────────────────────────────────
const REPUTATION_ABI = parseAbi([
  "function getReputationSummary(uint256 agentId) view returns (uint256 score, uint256 feedbackCount, uint256 lastUpdated)",
  "function submitFeedback(uint256 agentId, int8 score, string calldata comment) external",
])

const IDENTITY_ABI = parseAbi([
  "function getAgentIdByAddress(address agentAddress) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
])

// ─── TTL Cache (5 minutes) ───────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000
const reputationCache = new Map<string, { data: ERC8004Summary; expiresAt: number }>()

// ─── Public client factory ───────────────────────────────────────────
function getPublicClient(network: "base" | "base-sepolia") {
  return createPublicClient({
    chain: network === "base" ? base : baseSepolia,
    transport: http(),
  })
}

/**
 * Lookup ERC-8004 reputation score for a given agent address.
 * Returns null if the agent is not registered.
 */
export async function getAgentReputation(
  agentAddress: string,
  network: "base" | "base-sepolia" = "base-sepolia"
): Promise<ERC8004Summary | null> {
  const cacheKey = `${network}:${agentAddress.toLowerCase()}`
  const cached = reputationCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  try {
    const client = getPublicClient(network)
    const addrs = ADDRESSES[network]

    // Step 1: Get agent ID from identity registry
    const agentId = await client.readContract({
      address: addrs.IdentityRegistry,
      abi: IDENTITY_ABI,
      functionName: "getAgentIdByAddress",
      args: [agentAddress as `0x${string}`],
    })

    if (!agentId || agentId === 0n) return null

    // Step 2: Get reputation summary
    const [score, feedbackCount, lastUpdated] = await client.readContract({
      address: addrs.ReputationRegistry,
      abi: REPUTATION_ABI,
      functionName: "getReputationSummary",
      args: [agentId],
    })

    const summary: ERC8004Summary = {
      agentId: agentId.toString(),
      score: Number(score),
      feedbackCount: Number(feedbackCount),
      lastUpdated: Number(lastUpdated),
    }

    reputationCache.set(cacheKey, { data: summary, expiresAt: Date.now() + CACHE_TTL_MS })
    return summary
  } catch {
    // Agent not registered or contract call failed → treat as unknown agent
    return null
  }
}

/**
 * Calculate price discount based on ERC-8004 reputation score.
 * - score >= 90 → 40% discount
 * - score >= 75 → 20% discount
 * - score < 75  → no discount
 */
export function getReputationDiscount(score: number): number {
  if (score >= 90) return 0.4
  if (score >= 75) return 0.2
  return 0
}

/**
 * Submit on-chain feedback for an agent after payment.
 * Requires `signerKey` to be set in config.
 *
 * @param agentId - ERC-8004 token ID
 * @param positive - true for positive (after payment), false for negative (after honeypot)
 * @param comment - human-readable reason
 */
export async function giveAgentFeedback(
  agentId: string,
  positive: boolean,
  comment: string,
  signerKey: `0x${string}`,
  network: "base" | "base-sepolia" = "base-sepolia"
): Promise<void> {
  try {
    const account = privateKeyToAccount(signerKey)
    const addrs = ADDRESSES[network]

    const walletClient = createWalletClient({
      account,
      chain: network === "base" ? base : baseSepolia,
      transport: http(),
    })

    const publicClient = getPublicClient(network)

    const score: number = positive ? 10 : -10

    const hash = await walletClient.writeContract({
      address: addrs.ReputationRegistry,
      abi: REPUTATION_ABI,
      functionName: "submitFeedback",
      args: [BigInt(agentId), score, comment],
    })

    // Invalidate cache so next request fetches fresh score
    const ownerAddress = await publicClient.readContract({
      address: addrs.IdentityRegistry,
      abi: IDENTITY_ABI,
      functionName: "ownerOf",
      args: [BigInt(agentId)],
    })
    const cacheKey = `${network}:${ownerAddress.toLowerCase()}`
    reputationCache.delete(cacheKey)

    console.log(`[Cipta ERC-8004] Feedback submitted: agentId=${agentId} score=${score} tx=${hash}`)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[Cipta ERC-8004] Failed to submit feedback:", message)
  }
}
