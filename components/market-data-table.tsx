"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpDown } from "lucide-react"

// Mock data for different commodity categories
const marketData = {
  metals: [
    { id: "1", name: "Gold", symbol: "GOLD", price: 62450, change: 1.2, high: 62780, low: 62100, volume: 12450 },
    { id: "2", name: "Silver", symbol: "SILVER", price: 78250, change: -0.8, high: 78900, low: 77800, volume: 9870 },
    { id: "3", name: "Copper", symbol: "COPPER", price: 845.7, change: 0.5, high: 850.2, low: 840.1, volume: 7650 },
    {
      id: "4",
      name: "Aluminium",
      symbol: "ALUMINIUM",
      price: 245.8,
      change: 1.8,
      high: 248.3,
      low: 243.2,
      volume: 6540,
    },
    { id: "5", name: "Lead", symbol: "LEAD", price: 187.4, change: 0.2, high: 188.5, low: 186.2, volume: 4320 },
    { id: "6", name: "Zinc", symbol: "ZINC", price: 312.6, change: -0.7, high: 315.8, low: 310.2, volume: 5430 },
    { id: "7", name: "Nickel", symbol: "NICKEL", price: 1654.3, change: 2.1, high: 1670.5, low: 1640.2, volume: 3210 },
  ],
  energy: [
    { id: "1", name: "Crude Oil", symbol: "CRUDEOIL", price: 6780, change: 2.3, high: 6850, low: 6720, volume: 24560 },
    {
      id: "2",
      name: "Natural Gas",
      symbol: "NATURALGAS",
      price: 245.6,
      change: -1.5,
      high: 250.2,
      low: 243.8,
      volume: 18760,
    },
    {
      id: "3",
      name: "Brent Crude",
      symbol: "BRENTCRUDEOIL",
      price: 7120,
      change: 1.8,
      high: 7180,
      low: 7050,
      volume: 15670,
    },
    {
      id: "4",
      name: "Heating Oil",
      symbol: "HEATINGOIL",
      price: 2345,
      change: 0.7,
      high: 2360,
      low: 2330,
      volume: 8760,
    },
  ],
  agriculture: [
    { id: "1", name: "Cotton", symbol: "COTTON", price: 34560, change: -0.3, high: 34780, low: 34320, volume: 5430 },
    { id: "2", name: "Soybean", symbol: "SOYBEAN", price: 4560, change: 1.2, high: 4620, low: 4510, volume: 7650 },
    { id: "3", name: "Wheat", symbol: "WHEAT", price: 2340, change: -0.8, high: 2380, low: 2320, volume: 6540 },
    { id: "4", name: "Corn", symbol: "CORN", price: 1870, change: 0.5, high: 1890, low: 1860, volume: 8760 },
    { id: "5", name: "Sugar", symbol: "SUGAR", price: 4320, change: 1.5, high: 4380, low: 4290, volume: 9870 },
  ],
  others: [
    { id: "1", name: "Rubber", symbol: "RUBBER", price: 18760, change: 0.8, high: 18900, low: 18650, volume: 4320 },
    {
      id: "2",
      name: "Mentha Oil",
      symbol: "MENTHAOIL",
      price: 1230,
      change: -1.2,
      high: 1250,
      low: 1220,
      volume: 3210,
    },
    { id: "3", name: "CPO", symbol: "CPO", price: 876, change: 2.1, high: 890, low: 870, volume: 5430 },
  ],
}

type MarketDataItem = {
  id: string
  name: string
  symbol: string
  price: number
  change: number
  high: number
  low: number
  volume: number
}

interface MarketDataTableProps {
  category: "metals" | "energy" | "agriculture" | "others"
}

export function MarketDataTable({ category }: MarketDataTableProps) {
  const [data, setData] = useState<MarketDataItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof MarketDataItem | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    // In a real app, this would be an API call
    // fetch(`/api/market-data/${category}`)
    setData(marketData[category])
  }, [category])

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0

    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const handleSort = (column: keyof MarketDataItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or symbol..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("price")}>
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("change")}>
                <div className="flex items-center justify-end">
                  Change %
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">High</TableHead>
              <TableHead className="text-right">Low</TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("volume")}>
                <div className="flex items-center justify-end">
                  Volume
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                  <TableCell className={`text-right ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(item.high)}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.low)}</TableCell>
                  <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Trade
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
