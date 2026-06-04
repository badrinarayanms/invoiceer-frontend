"use client"


import { usePathname } from "next/navigation"
import "./globals.css"


import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { TopNavigation } from "@/components/top-navigation"
import WakeUpBackend from "@/components/WakeUpBackend"


const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const pathname = usePathname()

  const hideNavbar =
    pathname === "/login" || pathname === "/signup"

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <WakeUpBackend /> 🆕 Add this component */}
        <div className="min-h-screen bg-background">
          {/* <TopNavigation /> */}
           {!hideNavbar && <TopNavigation />}
          <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
