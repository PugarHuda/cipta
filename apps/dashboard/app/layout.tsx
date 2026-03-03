import type { Metadata } from "next"
import { Syne, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Cipta — Protect Your Content, Earn from AI",
  description: "Let AI crawlers pay for your content via x402 on Base",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
