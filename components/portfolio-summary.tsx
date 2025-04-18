"use client";

import { useEffect, useState } from "react";
import { useTradingContext } from "@/context/trading-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMultipleCommodityPrices } from "@/app/actions/commodity-actions";

export function PortfolioSummary() {
  const { portfolio } = useTradingContext();
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(
    {}
  );
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        // Get all commodities in the portfolio
        const commodities = portfolio.positions.map((p) => p.commodity);
        if (commodities.length === 0) {
          setTotalValue(portfolio.cash);
          setLoading(false);
          return;
        }

        const results = await getMultipleCommodityPrices(commodities);

        const prices: Record<string, number> = {};
        let portfolioValue = portfolio.cash;

        // Extract prices and calculate portfolio value
        for (const position of portfolio.positions) {
          const result = results[position.commodity];
          if (result) {
            prices[position.commodity] = result.price;
            portfolioValue += result.price * position.quantity;
          } else {
            // Use average price if API fails
            prices[position.commodity] = position.averagePrice;
            portfolioValue += position.averagePrice * position.quantity;
          }
        }

        setCurrentPrices(prices);
        setTotalValue(portfolioValue);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh every minute
    const intervalId = setInterval(fetchPrices, 60000);
    return () => clearInterval(intervalId);
  }, [portfolio]);

  const calculatePnL = (position: (typeof portfolio.positions)[0]) => {
    const currentPrice =
      currentPrices[position.commodity] || position.averagePrice;
    return (currentPrice - position.averagePrice) * position.quantity;
  };

  const calculatePnLPercentage = (
    position: (typeof portfolio.positions)[0]
  ) => {
    const currentPrice =
      currentPrices[position.commodity] || position.averagePrice;
    return (
      ((currentPrice - position.averagePrice) / position.averagePrice) * 100
    );
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
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription>Your current holdings and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Cash Balance</p>
            <p className="text-2xl font-bold">{formatPrice(portfolio.cash)}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Total Value</p>
            <p className="text-2xl font-bold">{formatPrice(totalValue)}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-4 text-center">Loading portfolio data...</div>
        ) : portfolio.positions.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            You don't have any positions yet. Start trading to build your
            portfolio.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.positions.map((position) => {
                const pnl = calculatePnL(position);
                const pnlPercentage = calculatePnLPercentage(position);
                const currentPrice =
                  currentPrices[position.commodity] || position.averagePrice;

                return (
                  <TableRow key={position.commodity}>
                    <TableCell className="font-medium capitalize">
                      {position.commodity.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-right">
                      {(position.quantity / 2).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(position.averagePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(currentPrice)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        pnl >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatPrice(pnl)} ({pnlPercentage.toFixed(2)}%)
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
