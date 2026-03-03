import { createWalletClient, createPublicClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia, base } from "viem/chains"
import { x402Client } from "@x402/core/client"
import { ExactEvmScheme } from "@x402/evm"
import { wrapFetchWithPayment } from "@x402/fetch"
import type { ClientEvmSigner } from "@x402/evm"

/**
 * PayerAgent — AI agent yang otomatis bayar x402 saat browsing konten.
 * Pakai ini untuk demo: tunjukkan agent dapat konten, kreator dapat USDC.
 */
export class PayerAgent {
  private fetchWithPayment: ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) | null = null
  private walletAddress: `0x${string}` | null = null

  async init(config: {
    privateKey: `0x${string}`
    network?: "base" | "base-sepolia"
  }) {
    const network = config.network ?? "base-sepolia"
    const chain = network === "base" ? base : baseSepolia

    const account = privateKeyToAccount(config.privateKey)
    this.walletAddress = account.address

    const publicClient = createPublicClient({ chain, transport: http() })
    const walletClient = createWalletClient({ account, chain, transport: http() })

    // Buat signer yang compatible dengan x402 ClientEvmSigner interface
    const signer: ClientEvmSigner = {
      address: account.address,
      signTypedData: (message) => walletClient.signTypedData({
        account,
        domain: message.domain as Parameters<typeof walletClient.signTypedData>[0]["domain"],
        types: message.types as Parameters<typeof walletClient.signTypedData>[0]["types"],
        primaryType: message.primaryType,
        message: message.message,
      }),
      readContract: (args) => publicClient.readContract(args as Parameters<typeof publicClient.readContract>[0]),
    }

    // Register EVM scheme — eip155:84532 = base-sepolia, eip155:8453 = base
    const networkId = `eip155:${chain.id}` as `eip155:${number}`
    const client = new x402Client().register(networkId, new ExactEvmScheme(signer))

    this.fetchWithPayment = wrapFetchWithPayment(fetch, client)

    console.log(`[PayerAgent] Ready. Wallet: ${this.walletAddress}`)
    console.log(`[PayerAgent] Network: ${network} (${networkId})`)

    return this
  }

  /**
   * Akses konten dengan bayar otomatis kalau ada 402
   */
  async fetch(url: string, userAgent = "CiptaPayerAgent/1.0"): Promise<Response> {
    if (!this.fetchWithPayment) throw new Error("PayerAgent belum di-init. Panggil .init() dulu.")

    console.log(`[PayerAgent] Fetching: ${url}`)

    const response = await this.fetchWithPayment(url, {
      headers: { "User-Agent": userAgent },
    })

    if (response.headers.get("X-PAYMENT-RESPONSE")) {
      const receipt = response.headers.get("X-PAYMENT-RESPONSE")
      console.log(`[PayerAgent] ✅ Paid! Receipt: ${receipt?.slice(0, 40)}...`)
    }

    console.log(`[PayerAgent] Status: ${response.status}`)
    return response
  }

  getWalletAddress(): string {
    if (!this.walletAddress) throw new Error("Not initialized")
    return this.walletAddress
  }
}
