"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"

// Direct API key as requested
const API_KEY = "ZdsATtS7ITMl0Jw9nasGRg==XHKt6DQQQi1dMImo"

// Top trending commodities
const TRENDING_COMMODITIES = [
  { id: "1", name: "gold", displayName: "Gold", category: "metals" },
  { id: "2", name: "silver", displayName: "Silver", category: "metals" },
  { id: "3", name: "crude_oil", displayName: "Crude Oil", category: "energy" },
  { id: "4", name: "natural_gas", displayName: "Natural Gas", category: "energy" },
  { id: "5", name: "copper", displayName: "Copper", category: "metals" },
]

export function TrendingCommodities() {
  const [commodities, setCommodities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const trendingData = []

        // Fetch each commodity individually
        for (const commodity of TRENDING_COMMODITIES) {
          try {
            const response = await fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${commodity.name}`, {
              headers: {
                "X-Api-Key": API_KEY,
              },
            })

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            const apiData = data[0]

            if (apiData) {
              trendingData.push({
                ...commodity,
                price: apiData.price,
                change: (Math.random() * 2 - 1) * 5, // Random change for demo
                percentChange: (Math.random() * 2 - 1) * 3, // Random percent change for demo
                volume: Math.floor(Math.random() * 10000) + 1000, // Random volume for demo
                currency: apiData.currency,
              })
            }
          } catch (error) {
            console.error(`Failed to fetch ${commodity.name}:`, error)

            // Use mock data if API fails
            trendingData.push({
              ...commodity,
              price: Math.random() * 1000 + 100,
              change: (Math.random() * 2 - 1) * 5,
              percentChange: (Math.random() * 2 - 1) * 3,
              volume: Math.floor(Math.random() * 10000) + 1000,
              currency: "USD",
            })
          }
        }

        // Sort by volume (highest first)
        trendingData.sort((a, b) => b.volume - a.volume)

        setCommodities(trendingData)
      } catch (error) {
        console.error("Failed to fetch trending commodities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  if (loading) {
    return <div className="py-4 text-center">Loading trending commodities...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commodity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Change</TableHead>
          <TableHead className="text-right">Volume</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commodities.map((commodity) => (
          <TableRow key={commodity.id}>
            <TableCell className="font-medium">{commodity.displayName}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {commodity.category}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{formatPrice(commodity.price, commodity.currency)}</TableCell>
            <TableCell className={`text-right ${commodity.percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              <div className="flex items-center justify-end">
                {commodity.percentChange >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(commodity.percentChange).toFixed(2)}%
              </div>
            </TableCell>
            <TableCell className="text-right">{commodity.volume.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
