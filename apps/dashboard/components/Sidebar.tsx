"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  Target,
  CreditCard,
  Settings,
  Shield,
  Zap,
} from "lucide-react"

const NAV = [
  { href: "/dashboard",          icon: LayoutDashboard, label: "OVERVIEW",  accent: "#4F6EF7" },
  { href: "/dashboard/bots",     icon: Bot,             label: "BOTS",      accent: "#F59E0B" },
  { href: "/dashboard/honeypot", icon: Target,          label: "HONEYPOT",  accent: "#EF4444" },
  { href: "/dashboard/payments", icon: CreditCard,      label: "PAYMENTS",  accent: "#10D9A0" },
  { href: "/dashboard/settings", icon: Settings,        label: "SETTINGS",  accent: "#A78BFA" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-[200px] flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #4F6EF7 0%, #10D9A0 100%)",
          }}
        >
          <Shield size={14} className="text-white" />
        </div>
        <span
          className="text-sm font-[800] tracking-[0.12em] text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-ui)", letterSpacing: "0.12em" }}
        >
          CIPTA
        </span>
      </div>

      {/* Live status ticker */}
      <div className="mx-4 mb-5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
        style={{ background: "rgba(16,217,160,0.06)", border: "1px solid rgba(16,217,160,0.15)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full dot-green live-pulse flex-shrink-0" />
        <span className="text-[10px] font-[600] tracking-[0.1em]"
          style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}
        >
          LIVE · BASE
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label, accent }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 relative"
              style={{
                background: isActive ? `${accent}10` : "transparent",
                borderLeft: isActive ? `2px solid ${accent}` : "2px solid transparent",
                paddingLeft: "10px",
              }}
            >
              <Icon
                size={14}
                style={{ color: isActive ? accent : "var(--text-secondary)" }}
                className="transition-colors duration-150 group-hover:opacity-80"
              />
              <span
                className="text-[11px] font-[600] tracking-[0.09em] transition-colors duration-150"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom block */}
      <div className="px-4 py-5 space-y-3">
        <div
          className="flex items-center gap-2 p-2.5 rounded-lg"
          style={{ background: "rgba(79,110,247,0.06)", border: "1px solid rgba(79,110,247,0.1)" }}
        >
          <Zap size={12} style={{ color: "var(--blue)" }} />
          <div>
            <div className="text-[9px] tracking-[0.12em] font-[600]"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}
            >
              POWERED BY
            </div>
            <div className="text-[10px] font-[600]"
              style={{ color: "var(--blue)", fontFamily: "var(--font-data)" }}
            >
              x402 · ERC-8004
            </div>
          </div>
        </div>
        <div className="text-[9px] tracking-[0.06em]"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-data)" }}
        >
          v0.1.0 · Base Sepolia
        </div>
      </div>
    </aside>
  )
}
