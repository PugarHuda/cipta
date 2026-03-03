/**
 * ETH Payment Verifier
 * Verifies that an ETH transaction on Base (or Base Sepolia) pays the creator wallet.
 */
import { createPublicClient, http, parseEther, formatEther } from "viem"
import { base, baseSepolia } from "viem/chains"
import type { ETHPaymentResult } from "./types"

// Rough USD/ETH price used to convert priceUSD → ETH
// In production, replace with Chainlink price feed or dynamic oracle
const ETH_USD_ESTIMATE = 3500

/**
 * Estimate ETH amount required for a given USD price.
 */
export function priceUsdToWei(priceUSD: number): bigint {
  const ethAmount = priceUSD / ETH_USD_ESTIMATE
  return parseEther(ethAmount.toFixed(18))
}

/**
 * Verify that a tx hash:
 * 1. Exists on-chain and is confirmed
 * 2. Sends ETH to the creator wallet
 * 3. Sends at least `requiredWei` amount
 */
export async function verifyETHPayment(
  txHash: `0x${string}`,
  creatorWallet: `0x${string}`,
  requiredWei: bigint,
  network: "base" | "base-sepolia" = "base-sepolia"
): Promise<ETHPaymentResult> {
  try {
    const client = createPublicClient({
      chain: network === "base" ? base : baseSepolia,
      transport: http(),
    })

    const receipt = await client.getTransactionReceipt({ hash: txHash })

    // Transaction not found or failed
    if (!receipt || receipt.status === "reverted") {
      return { success: false, error: "Transaction not found or reverted" }
    }

    // Get the actual tx to check value
    const tx = await client.getTransaction({ hash: txHash })

    // Verify recipient is creator wallet
    const toAddr = (tx.to || "").toLowerCase()
    if (toAddr !== creatorWallet.toLowerCase()) {
      return {
        success: false,
        error: `Payment sent to ${toAddr}, expected ${creatorWallet.toLowerCase()}`,
      }
    }

    // Verify amount is sufficient
    if (tx.value < requiredWei) {
      return {
        success: false,
        error: `Payment too low: sent ${formatEther(tx.value)} ETH, need ${formatEther(requiredWei)} ETH`,
      }
    }

    return {
      success: true,
      txHash,
      amountWei: tx.value,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}
