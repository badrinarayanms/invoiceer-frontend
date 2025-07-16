import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TopNavigation } from "@/components/top-navigation"
import WakeUpBackend from "@/components/WakeUpBackend"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Invoicer - Invoice Management Dashboard",
  description: "Modern invoice management system",
  generator: "Invoicer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WakeUpBackend /> {/* 🆕 Add this component */}
        <div className="min-h-screen bg-background">
          <TopNavigation />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
