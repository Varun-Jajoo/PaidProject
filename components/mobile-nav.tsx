"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Market Watch",
      href: "/market-watch",
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
      name: "Profile",
      href: "/profile",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">Commodity Exchange</span>
          </Link>
        </div>
        <nav className="mt-6 flex flex-col gap-4 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`px-5 py-2 text-base font-medium ${
                pathname === route.href ? "bg-muted" : "hover:bg-muted"
              } rounded-md transition-colors`}
              onClick={() => setOpen(false)}
            >
              {route.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
