"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock OHLC data
const generateMockData = () => {
  const data = []
  const now = new Date()
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)

    const basePrice = 50000 + Math.random() * 10000
    const open = basePrice
    const high = open + Math.random() * 1000
    const low = open - Math.random() * 1000
    const close = low + Math.random() * (high - low)

    data.push({
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000) + 500,
    })
  }
  return data
}

export function CandlestickChart() {
  const [data, setData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState("1d")
  const [symbol, setSymbol] = useState("BTC/USD")

  useEffect(() => {
    // In a real app, this would be an API call like:
    // fetch(`/api/prices?symbol=${symbol}&timeframe=${timeframe}`)
    const fetchData = async () => {
      try {
        // Simulate API call
        const mockData = generateMockData()
        setData(mockData)
      } catch (error) {
        console.error("Error fetching OHLC data:", error)
      }
    }

    fetchData()

    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, 30000) // Refresh every 30 seconds

    return () => clearInterval(intervalId)
  }, [symbol, timeframe])

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="p-0">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center space-x-2">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                <SelectItem value="SOL/USD">SOL/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="1d" className="w-auto" value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="4h">4H</TabsTrigger>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-[350px] w-full px-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.getDate().toString()
                }}
              />
              <YAxis
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatPrice}
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value: number) => formatPrice(value)} labelFormatter={(label) => `Date: ${label}`} />
              <Area type="monotone" dataKey="close" stroke="#10B981" fillOpacity={1} fill="url(#colorClose)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
