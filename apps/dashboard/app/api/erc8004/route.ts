import { NextRequest, NextResponse } from "next/server"

const ADDRESSES = {
  "base-sepolia": {
    IdentityRegistry: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
    ReputationRegistry: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
  },
  base: {
    IdentityRegistry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    ReputationRegistry: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63",
  },
}

export async function GET(req: NextRequest) {
  const agentAddress = req.nextUrl.searchParams.get("address")
  const network = (req.nextUrl.searchParams.get("network") || "base-sepolia") as "base" | "base-sepolia"

  if (!agentAddress) return NextResponse.json({ error: "address required" }, { status: 400 })

  // Return contract addresses for the frontend to query directly
  // (frontend can use wagmi/viem to call view functions)
  return NextResponse.json({
    agentAddress,
    network,
    contracts: ADDRESSES[network],
    note: "Use viem/wagmi to call getAgentIdByAddress + getReputationSummary",
  })
}
