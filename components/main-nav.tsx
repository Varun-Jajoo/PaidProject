"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Market Watch",
      href: "/market-data",
    },
    {
      name: "Commodities",
      href: "/commodities",
    },
    {
      name: "Trade",
      href: "/trade",
    },
    {
      name: "News",
      href: "/news",
    },
    {
      name: "Admin",
      href: "/admin",
    },
    {
      name: "History",
      href: "/history",
    }
  ]

  return (
    <div className="mr-4 w-full flex justify-between items-center space-x-4 border-b border-border bg-background px-4 py-2 dark:border-border/50">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <BarChart3 className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Commodity Exchange</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === route.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <ModeToggle />
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}
