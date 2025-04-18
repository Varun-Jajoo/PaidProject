"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const pathname = usePathname()

  // Get the page title based on the current path
  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard"
      case "/trade":
        return "Trade"
      case "/history":
        return "Trade History"
      case "/news":
        return "Market News"
      case "/admin":
        return "Admin"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-2 md:ml-2 md:gap-4">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ModeToggle />
        <Button variant="outline" size="icon">
          <User className="h-4 w-4" />
          <span className="sr-only">Account</span>
        </Button>
      </div>
    </header>
  )
}
