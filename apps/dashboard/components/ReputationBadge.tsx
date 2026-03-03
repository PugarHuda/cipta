"use client"

interface Props {
  score: number
  agentId?: string
  className?: string
}

const TIER = (score: number) => {
  if (score >= 90) return { label: "TRUSTED",  color: "var(--green)",  bg: "rgba(16,217,160,0.08)",  border: "rgba(16,217,160,0.2)",  discount: "−40%" }
  if (score >= 75) return { label: "VERIFIED", color: "var(--blue)",   bg: "rgba(79,110,247,0.08)",  border: "rgba(79,110,247,0.2)",  discount: "−20%" }
  return               { label: "UNKNOWN",  color: "var(--text-secondary)", bg: "rgba(255,255,255,0.04)", border: "var(--border-subtle)", discount: "" }
}

/**
 * ERC-8004 reputation score badge.
 * Trusted agents (score ≥ 90) get 40% off; Verified (≥ 75) get 20% off.
 */
export default function ReputationBadge({ score, agentId, className = "" }: Props) {
  const tier = TIER(score)

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${className}`}
      style={{ background: tier.bg, border: `1px solid ${tier.border}` }}
    >
      {/* Hex icon */}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M5 0.5L9 2.75V7.25L5 9.5L1 7.25V2.75L5 0.5Z"
          fill={tier.color}
          fillOpacity={0.2}
          stroke={tier.color}
          strokeWidth="0.8"
        />
      </svg>

      <span
        className="text-[9px] font-[700] tracking-[0.1em]"
        style={{ color: tier.color, fontFamily: "var(--font-data)" }}
      >
        ERC-8004
      </span>

      <span
        className="text-[11px] font-[700]"
        style={{ color: tier.color, fontFamily: "var(--font-data)" }}
      >
        {score}
      </span>

      <span
        className="text-[9px] tracking-[0.08em]"
        style={{ color: tier.color, opacity: 0.7, fontFamily: "var(--font-ui)" }}
      >
        {tier.label}
      </span>

      {tier.discount && (
        <span
          className="text-[9px] font-[700] px-1.5 py-0.5 rounded"
          style={{
            background: `${tier.color}18`,
            color: tier.color,
            fontFamily: "var(--font-data)",
          }}
        >
          {tier.discount}
        </span>
      )}

      {agentId && (
        <span
          className="text-[8px] opacity-40"
          style={{ color: tier.color, fontFamily: "var(--font-data)" }}
        >
          #{agentId}
        </span>
      )}
    </div>
  )
}
