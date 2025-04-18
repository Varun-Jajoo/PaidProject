"use client";

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

export function TradeHistory() {
  const { trades } = useTradingContext();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatPrice = (price: number) => {
    const conversionRate = 82; // Example conversion rate from USD to INR
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price * conversionRate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>Your recent trading activity</CardDescription>
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
