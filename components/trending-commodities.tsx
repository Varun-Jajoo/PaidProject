"use client";

import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getMarketData, type MarketDataItem } from "@/app/actions/market-data";

// Top trending commodities to filter from market data
const TRENDING_SYMBOLS = ["GOLD", "SILVER", "CRUDEOIL", "NATURALGAS", "COPPER"];

// Utility to apply ±0.1% random fluctuation
function applyFluctuation(price: number): number {
  const fluctuation = price * 0.001;
  const randomFactor = (Math.random() * 2 - 1) * fluctuation;
  return parseFloat((price + randomFactor).toFixed(2));
}

export function TrendingCommodities() {
  const [commodities, setCommodities] = useState<MarketDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const previousPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMarketData();
        const allCommodities = Object.values(data).flat();

        // Store current prices for comparison
        const currentPrices: Record<string, number> = {};
        allCommodities.forEach((item) => {
          currentPrices[item.symbol] = item.price;
        });

        // Filter and apply fluctuations to trending commodities
        const trendingData = allCommodities
          .filter((item) => TRENDING_SYMBOLS.includes(item.symbol))
          .map((item) => {
            const newPrice = applyFluctuation(item.price);
            const prevPrice =
              previousPricesRef.current[item.symbol] || item.price;
            const priceChange = ((newPrice - prevPrice) / prevPrice) * 100;

            return {
              ...item,
              price: newPrice,
              change: priceChange,
            };
          })
          .sort((a, b) => b.volume - a.volume);

        previousPricesRef.current = currentPrices;
        setCommodities(trendingData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Update every 15 seconds instead of 5 seconds
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, []); // Remove previousPrices dependency

  // Get price change class for animations
  const getPriceChangeClass = (symbol: string, currentPrice: number) => {
    const prevPrice = previousPricesRef.current[symbol] || currentPrice;
    if (currentPrice > prevPrice) {
      return "bg-green-500/10 transition-colors duration-1000";
    }
    if (currentPrice < prevPrice) {
      return "bg-red-500/10 transition-colors duration-1000";
    }
    return "";
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  if (loading) {
    return (
      <div className="py-4 text-center">Loading trending commodities...</div>
    );
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
          <TableRow key={`${commodity.symbol}-${commodity.name}`}>
            <TableCell className="font-medium">{commodity.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {commodity.name.includes("GOLD") ||
                commodity.name.includes("SILVER") ||
                commodity.name.includes("COPPER")
                  ? "metals"
                  : "energy"}
              </Badge>
            </TableCell>
            <TableCell
              className={`text-right ${getPriceChangeClass(
                commodity.symbol,
                commodity.price
              )}`}
            >
              {formatPrice(commodity.price)}
            </TableCell>
            <TableCell
              className={`text-right ${
                commodity.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <div className="flex items-center justify-end">
                {commodity.change >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(commodity.change).toFixed(2)}%
              </div>
            </TableCell>
            <TableCell className="text-right">
              {commodity.volume.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
