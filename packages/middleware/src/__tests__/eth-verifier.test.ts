/**
 * Tests untuk ETH payment verifier
 */

jest.mock("viem", () => ({
  createPublicClient: jest.fn(() => ({
    getTransactionReceipt: jest.fn(),
    getTransaction: jest.fn(),
  })),
  http: jest.fn(),
  // Minimal parseEther: converts decimal ETH string to wei bigint
  parseEther: (value: string) => {
    const [integer = "0", decimal = ""] = value.split(".")
    const decimals = decimal.padEnd(18, "0").slice(0, 18)
    return BigInt(integer) * BigInt("1000000000000000000") + BigInt(decimals)
  },
}))

jest.mock("viem/chains", () => ({
  base: { id: 8453 },
  baseSepolia: { id: 84532 },
}))

import { priceUsdToWei } from "../eth-verifier"

describe("priceUsdToWei()", () => {
  test("$0.001 → wei yang benar (estimasi $3500/ETH)", () => {
    const wei = priceUsdToWei(0.001)
    // $0.001 / $3500 * 1e18 ≈ 285714285714 wei
    expect(typeof wei).toBe("bigint")
    expect(wei).toBeGreaterThan(BigInt(0))
  })

  test("$1.00 → lebih besar dari $0.001", () => {
    const wei1 = priceUsdToWei(0.001)
    const wei2 = priceUsdToWei(1.0)
    expect(wei2).toBeGreaterThan(wei1)
  })

  test("$0 → 0 wei", () => {
    const wei = priceUsdToWei(0)
    expect(wei).toBe(BigInt(0))
  })

  test("$3500 → kurang-lebih 1 ETH (1e18 wei)", () => {
    const oneEth = BigInt("1000000000000000000") // 1e18
    const wei = priceUsdToWei(3500)
    // Harus dalam range 0.95–1.05 ETH
    const ratio = Number(wei) / Number(oneEth)
    expect(ratio).toBeGreaterThan(0.95)
    expect(ratio).toBeLessThan(1.05)
  })
})
