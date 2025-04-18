"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getOrderBook } from "@/app/actions/trade-actions"
import { Trade } from "@/app/models/trade"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderBookProps {
  commodityId: string;
}

export function OrderBook({ commodityId }: OrderBookProps) {
  const [buyOrders, setBuyOrders] = useState<Trade[]>([])
  const [sellOrders, setSellOrders] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isSubscribed = true;

    const fetchOrderBook = async () => {
      try {
        setError(null)
        const { buyOrders: newBuyOrders, sellOrders: newSellOrders } = await getOrderBook(commodityId)
        
        if (isSubscribed) {
          setBuyOrders(newBuyOrders)
          setSellOrders(newSellOrders)
        }
      } catch (err) {
        console.error('Failed to fetch order book:', err)
        if (isSubscribed) {
          setError('Failed to load order book')
        }
      } finally {
        if (isSubscribed) {
          setLoading(false)
        }
      }
    }

    fetchOrderBook()
    const interval = setInterval(fetchOrderBook, 5000)

    return () => {
      isSubscribed = false
      clearInterval(interval)
    }
  }, [commodityId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(4)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Order Book</h3>
        <Badge variant="outline">Live</Badge>
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
                  <TableRow key={order._id?.toString()}>
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
                  <TableRow key={order._id?.toString()}>
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
