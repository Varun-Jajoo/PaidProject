"use client";

import { useState, useEffect } from "react";
import { useTradingContext } from "@/context/trading-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Trade } from "@/context/trading-context";

export function TradeHistory() {
  const { trades, setTrades } = useTradingContext();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8080");
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "initial") {
          // Handle initial trades data
          setTrades(data.trades);
        } else if (data.type === "trade") {
          // Handle new trade update
          setTrades((prevTrades) => [...prevTrades, data.trade]);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [setTrades]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trade History</CardTitle>
            <CardDescription>Your recent trading activity</CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {isConnected ? (
              <span className="text-green-500">●</span>
            ) : (
              <span className="text-red-500">●</span>
            )}
            <span className="ml-2">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No trades yet. Start trading to see your history.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Commodity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{formatDate(trade.timestamp)}</TableCell>
                  <TableCell className="capitalize">
                    {trade.commodity.replace("_", " ")}
                  </TableCell>
                  <TableCell
                    className={
                      trade.type === "buy" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {trade.type.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(trade.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.quantity.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(trade.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
