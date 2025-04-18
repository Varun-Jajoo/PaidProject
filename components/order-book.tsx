"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Order = {
  id: string
  price: number
  amount: number
  side: "buy" | "sell"
  total: number
}

export function OrderBook() {
  const [buyOrders, setBuyOrders] = useState<Order[]>([])
  const [sellOrders, setSellOrders] = useState<Order[]>([])
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    // In a real app, this would connect to your WebSocket endpoint
    // const ws = new WebSocket('wss://your-host/orderbook');

    // For demo purposes, we'll simulate WebSocket behavior
    console.log("Connecting to WebSocket...")
    setConnected(true)

    // Generate initial mock data
    const initialBuyOrders = Array.from({ length: 8 }, (_, i) => ({
      id: `buy-${i}`,
      price: 50000 - i * 50,
      amount: Math.random() * 2 + 0.1,
      side: "buy" as const,
      total: (50000 - i * 50) * (Math.random() * 2 + 0.1),
    }))

    const initialSellOrders = Array.from({ length: 8 }, (_, i) => ({
      id: `sell-${i}`,
      price: 50050 + i * 50,
      amount: Math.random() * 2 + 0.1,
      side: "sell" as const,
      total: (50050 + i * 50) * (Math.random() * 2 + 0.1),
    }))

    setBuyOrders(initialBuyOrders)
    setSellOrders(initialSellOrders)

    // Simulate WebSocket updates
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        // Update buy orders
        setBuyOrders((prev) => {
          const newOrders = [...prev]
          const randomIndex = Math.floor(Math.random() * newOrders.length)
          newOrders[randomIndex] = {
            ...newOrders[randomIndex],
            amount: Math.random() * 2 + 0.1,
          }
          newOrders[randomIndex].total = newOrders[randomIndex].price * newOrders[randomIndex].amount
          return newOrders
        })
      } else {
        // Update sell orders
        setSellOrders((prev) => {
          const newOrders = [...prev]
          const randomIndex = Math.floor(Math.random() * newOrders.length)
          newOrders[randomIndex] = {
            ...newOrders[randomIndex],
            amount: Math.random() * 2 + 0.1,
          }
          newOrders[randomIndex].total = newOrders[randomIndex].price * newOrders[randomIndex].amount
          return newOrders
        })
      }
    }, 2000)

    // Cleanup function
    return () => {
      clearInterval(interval)
      if (socket) {
        socket.close()
      }
      setConnected(false)
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(4)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Order Book</h3>
        <Badge variant={connected ? "outline" : "destructive"}>{connected ? "Connected" : "Disconnected"}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="mb-2 text-sm font-medium text-red-500">Sell Orders</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Price</TableHead>
                  <TableHead className="w-1/3 text-right">Amount</TableHead>
                  <TableHead className="w-1/3 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-red-500">{formatPrice(order.price)}</TableCell>
                    <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                    <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-green-500">Buy Orders</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Price</TableHead>
                  <TableHead className="w-1/3 text-right">Amount</TableHead>
                  <TableHead className="w-1/3 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buyOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-green-500">{formatPrice(order.price)}</TableCell>
                    <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                    <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
