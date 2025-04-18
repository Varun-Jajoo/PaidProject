"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Newspaper, History, TrendingUp, Settings, Home, Package, Database, User, Eye } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Commodities",
      href: "/commodities",
      icon: Package,
    },
    {
      title: "Market Data",
      href: "/market-data",
      icon: Database,
    },
    {
      title: "Market Watch",
      href: "/market-watch",
      icon: Eye,
    },
    {
      title: "Trade",
      href: "/trade",
      icon: TrendingUp,
    },
    {
      title: "History",
      href: "/history",
      icon: History,
    },
    {
      title: "News",
      href: "/news",
      icon: Newspaper,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Admin",
      href: "/admin",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6" />
          <span>Commodity Exchange</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-4 w-4" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
