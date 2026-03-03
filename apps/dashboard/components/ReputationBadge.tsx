"use client"

interface Props {
  score: number
  agentId?: string
  className?: string
}

/**
 * Displays an ERC-8004 reputation score badge with color coding:
 * - Green (≥90): Trusted agent, 40% discount
 * - Blue (≥75): Good agent, 20% discount
 * - Gray (<75): Unknown/low reputation
 */
export default function ReputationBadge({ score, agentId, className = "" }: Props) {
  const tier =
    score >= 90 ? { label: "Trusted", color: "text-green-400 bg-green-400/10 border-green-400/30", discount: "40% off" }
    : score >= 75 ? { label: "Good", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", discount: "20% off" }
    : { label: "Unknown", color: "text-gray-400 bg-gray-400/10 border-gray-400/30", discount: "" }

  return (
    <div className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 ${tier.color} ${className}`}>
      <span className="text-xs">⬡</span>
      <span className="text-xs font-medium">ERC-8004</span>
      <span className="text-xs font-bold">{score}</span>
      <span className="text-xs opacity-75">{tier.label}</span>
      {tier.discount && (
        <span className="text-xs bg-white/10 rounded-full px-1.5 py-0.5">{tier.discount}</span>
      )}
      {agentId && (
        <span className="text-xs opacity-50 font-mono">#{agentId}</span>
      )}
    </div>
  )
}
