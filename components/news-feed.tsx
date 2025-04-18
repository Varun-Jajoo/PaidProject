"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

type NewsItem = {
  id: string
  title: string
  summary: string
  source: string
  url: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    // fetch('/api/news')

    // Mock data for news
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Bitcoin Surges Past $50,000 as Institutional Adoption Grows",
        summary:
          "Bitcoin has surged past the $50,000 mark as more institutional investors add the cryptocurrency to their portfolios.",
        source: "CryptoNews",
        url: "#",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sentiment: "positive",
      },
      {
        id: "2",
        title: "Ethereum Upgrade Delayed, Developers Cite Security Concerns",
        summary:
          "The much-anticipated Ethereum upgrade has been delayed as developers work to address security vulnerabilities.",
        source: "BlockchainInsider",
        url: "#",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        sentiment: "negative",
      },
      {
        id: "3",
        title: "Regulatory Framework for Cryptocurrencies Under Discussion",
        summary:
          "Lawmakers are discussing a new regulatory framework for cryptocurrencies, aiming to provide clarity for investors and businesses.",
        source: "FinanceDaily",
        url: "#",
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        sentiment: "neutral",
      },
    ]

    setNews(mockNews)
    setLoading(false)

    // Set up interval to refresh news
    const intervalId = setInterval(() => {
      // In a real app, this would be an API call
      // fetch('/api/news')
    }, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
  }, [])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading news...</p>
  }

  return (
    <div className="space-y-4">
      {news.length === 0 ? (
        <p className="text-center text-muted-foreground">No news available</p>
      ) : (
        news.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getSentimentIcon(item.sentiment)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {item.source}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                    <a
                      href={item.url}
                      className="text-xs text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
