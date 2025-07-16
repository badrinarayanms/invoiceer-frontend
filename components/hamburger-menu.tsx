"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Menu, X } from "lucide-react"

export function HamburgerMenu() {
  const { open, toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle sidebar"
    >
      {open ? (
        <X className="h-5 w-5 transition-transform duration-200" />
      ) : (
        <Menu className="h-5 w-5 transition-transform duration-200" />
      )}
    </Button>
  )
}
