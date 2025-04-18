"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

export function MarketSummary() {
  const [summary, setSummary] = useState({
    totalVolume: 0,
    advancers: 0,
    decliners: 0,
    unchanged: 0,
    topGainer: { name: "", change: 0 },
    topLoser: { name: "", change: 0 },
  })

  useEffect(() => {
    // In a real app, this would fetch from an API
    // Simulate market summary data
    setSummary({
      totalVolume: 1245678,
      advancers: 28,
      decliners: 15,
      unchanged: 7,
      topGainer: { name: "Gold", change: 2.4 },
      topLoser: { name: "Natural Gas", change: -3.1 },
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">Total Volume</p>
          <p className="text-2xl font-bold">{summary.totalVolume.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">Advancers/Decliners</p>
          <p className="text-2xl font-bold">
            <span className="text-green-500">{summary.advancers}</span>
            <span className="mx-1">/</span>
            <span className="text-red-500">{summary.decliners}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-3">
          <div>
            <p className="text-sm font-medium">Top Gainer</p>
            <p className="font-bold">{summary.topGainer.name}</p>
          </div>
          <div className="flex items-center text-green-500">
            <ArrowUp className="mr-1 h-4 w-4" />
            <span className="font-bold">{summary.topGainer.change}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-red-500/10 p-3">
          <div>
            <p className="text-sm font-medium">Top Loser</p>
            <p className="font-bold">{summary.topLoser.name}</p>
          </div>
          <div className="flex items-center text-red-500">
            <ArrowDown className="mr-1 h-4 w-4" />
            <span className="font-bold">{Math.abs(summary.topLoser.change)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
