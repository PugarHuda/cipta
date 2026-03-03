"use client"
import { useEffect, useState } from "react"

interface HoneypotSummary {
  total_traps: number
  unique_bots: number
  last_trap: string | null
  erc8004_agents_caught: number
}

interface HoneypotLog {
  id: string
  bot_agent: string
  trap_path: string
  erc8004_agent_id: string | null
  timestamp: string
}

interface Props {
  wallet: string
}

export default function HoneypotCard({ wallet }: Props) {
  const [summary, setSummary] = useState<HoneypotSummary | null>(null)
  const [recent, setRecent] = useState<HoneypotLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wallet) return
    fetch(`/api/honeypot?wallet=${wallet}`)
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary)
        setRecent(data.recent || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [wallet])

  if (loading) {
    return (
      <div className="bg-gray-900 border border-yellow-500/20 rounded-xl p-6 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-40 mb-4" />
        <div className="h-8 bg-gray-700 rounded w-20" />
      </div>
    )
  }

  const traps = summary?.total_traps ?? 0

  return (
    <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🍯</span>
        <h3 className="text-lg font-semibold text-white">Honeypot Traps</h3>
        <span className="ml-auto text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
          {traps > 0 ? `${traps} bots caught` : "No traps triggered"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{traps}</div>
          <div className="text-xs text-gray-400 mt-0.5">Total Traps</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {summary?.unique_bots ?? 0}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Unique Bots</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {summary?.erc8004_agents_caught ?? 0}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">ERC-8004 Agents</div>
        </div>
      </div>

      {recent.length > 0 ? (
        <div>
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Recent Activity</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {recent.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs bg-gray-800 rounded-lg px-3 py-2"
              >
                <span className="text-yellow-300 font-mono truncate max-w-[150px]">
                  {log.bot_agent.split("/")[0]}
                </span>
                <span className="text-gray-500 ml-2 truncate">{log.trap_path}</span>
                {log.erc8004_agent_id && (
                  <span className="text-purple-400 ml-2 flex-shrink-0">⬡ ERC-8004</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-3">
          No bots trapped yet. Add <code className="text-yellow-400">/cipta-trap</code> to robots.txt Disallow.
        </p>
      )}

      <div className="mt-4 p-3 bg-gray-800/60 rounded-lg">
        <p className="text-xs text-gray-400 font-mono">
          <span className="text-green-400">robots.txt snippet:</span>
          <br />
          User-agent: *<br />
          Disallow: /cipta-trap/
        </p>
      </div>
    </div>
  )
}
