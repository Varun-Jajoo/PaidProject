"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react"

export function AdminPanel() {
  const [lastRun, setLastRun] = useState<string | null>("2023-04-18T10:30:00Z")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const triggerScrape = async () => {
    setIsLoading(true)

    // In a real app, this would be an API call
    // const response = await fetch('/api/news/trigger', { method: 'POST' });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update last run timestamp
    setLastRun(new Date().toISOString())
    setIsLoading(false)

    // Show success toast
    toast({
      title: "News Scrape Triggered",
      description: "The news scraper has been triggered successfully.",
    })
  }

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Never"
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">News Scraper Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Run:</span>
              <Badge variant="outline">{formatTimestamp(lastRun)}</Badge>
            </div>
            <Button onClick={triggerScrape} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Scrape Now"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">System Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">API Status</p>
                <Badge className="mt-1" variant="outline">
                  Online
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MongoDB Status</p>
                <Badge className="mt-1" variant="outline">
                  Connected
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Redis Cache</p>
                <Badge className="mt-1" variant="outline">
                  Online
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SSE Status</p>
                <Badge className="mt-1" variant="outline">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
