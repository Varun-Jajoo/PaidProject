"use client"

import { useEffect, useState } from "react"
import { Bell, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Alert = {
  id: string
  symbol: string
  type: "buy" | "sell" | "info"
  message: string
  timestamp: string
}

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    // fetch('/api/alerts')

    // Mock data for alerts
    const mockAlerts: Alert[] = [
      {
        id: "1",
        symbol: "BTC/USD",
        type: "buy",
        message: "Bullish pattern detected on BTC/USD 4h chart",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: "2",
        symbol: "ETH/USD",
        type: "sell",
        message: "Bearish divergence on ETH/USD daily chart",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "3",
        symbol: "SOL/USD",
        type: "info",
        message: "Volatility increasing on SOL/USD",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ]

    setAlerts(mockAlerts)

    // Set up interval to refresh alerts
    const intervalId = setInterval(() => {
      // In a real app, this would be an API call
      // fetch('/api/alerts')
    }, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "sell":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <p className="text-center text-muted-foreground">No alerts available</p>
      ) : (
        alerts.map((alert) => (
          <Card key={alert.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.symbol}</p>
                    <Badge variant="outline" className="text-xs">
                      {formatTimestamp(alert.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
