import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AiChatSidebar } from "@/components/ai-chat-sidebar"
import { TradingProvider } from "@/context/trading-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Commodity Exchange",
  description: "Real-time commodity trading platform with market data and analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TradingProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <DashboardSidebar />
                <div className="flex flex-1 flex-col">
                  <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                      <MainNav />
                      <MobileNav />
                    </div>
                  </header>
                  <div className="flex-1">{children}</div>
                </div>
              </div>
              <AiChatSidebar />
              <Toaster />
            </SidebarProvider>
          </TradingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
