"use client"

import { useState } from "react"
import { Home, Package, Plus, Receipt, FileText, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Create Invoice",
    url: "/invoices/create",
    icon: Plus,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: Receipt,
  },
]

export function TopNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Invoicer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link key={item.title} href={item.url}>
              <Button variant={pathname === item.url ? "default" : "ghost"} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">Invoicer</span>
                </div>
                <nav className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link key={item.title} href={item.url} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant={pathname === item.url ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
