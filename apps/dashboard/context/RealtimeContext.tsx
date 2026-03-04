"use client"

import { createContext, useContext, useEffect, useState } from "react"
import supabase from "../lib/supabase"

// Single realtime subscription — semua komponen listen ke sini
// Bukan 3 channel terpisah yang masing-masing buka koneksi sendiri
const RealtimeContext = createContext(0)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel("cipta_global")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "access_logs" }, () => {
        setTick((t) => t + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return <RealtimeContext.Provider value={tick}>{children}</RealtimeContext.Provider>
}

// Hook yang dipakai komponen — cukup useRefreshTick() tanpa manage subscription sendiri
export const useRefreshTick = () => useContext(RealtimeContext)
