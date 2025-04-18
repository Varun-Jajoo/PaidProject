"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

export function MarketWatchFilters() {
  const [category, setCategory] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // In a real app, this would trigger a refresh of the data
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="h-8 w-[150px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Commodities</SelectItem>
          <SelectItem value="metals">Metals</SelectItem>
          <SelectItem value="energy">Energy</SelectItem>
          <SelectItem value="agriculture">Agriculture</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  )
}
