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
  title: "Cipta — Make AI Agents Pay for Your Content",
  description: "AI crawlers scrape your content for free. Cipta makes them pay via USDC on Base. One line of code.",
  openGraph: {
    title: "Cipta — Make AI Agents Pay for Your Content",
    description: "AI crawlers scrape your content for free. Cipta makes them pay via USDC on Base. One line of code.",
    url: "https://cipta.vercel.app",
    siteName: "Cipta",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cipta — Make AI Agents Pay for Your Content",
    description: "AI crawlers scrape your content for free. Cipta makes them pay via USDC on Base. One line of code.",
    creator: "@PugarHuda",
  },
  keywords: ["x402", "ERC-8004", "AI agents", "Base", "USDC", "content monetization", "micropayments"],
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
