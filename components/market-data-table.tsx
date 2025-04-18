"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useTradingContext } from "@/context/trading-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TradeForm } from "@/components/trade-form";
import { getMarketData, type MarketDataItem } from "@/app/actions/market-data";

interface MarketDataTableProps {
  category: "metals" | "energy" | "agriculture" | "others";
}

// Utility to apply ±0.3% random fluctuation
function applyFluctuation(price: number): number {
  const fluctuation = price * 0.003;
  const randomFactor = (Math.random() * 2 - 1) * fluctuation;
  return parseFloat((price + randomFactor).toFixed(2));
}

export function MarketDataTable({ category }: MarketDataTableProps) {
  const [marketData, setMarketData] = useState<MarketDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MarketDataItem;
    direction: "ascending" | "descending";
  }>({ key: "name", direction: "ascending" });

  // Add state for previous prices to track changes
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMarketData();
        const categoryData = data[category] || [];

        // Store current prices for comparison
        const currentPrices: Record<string, number> = {};
        categoryData.forEach((item) => {
          currentPrices[item.symbol] = item.price;
        });

        // Apply fluctuations and update changes
        const updatedData = categoryData.map((item) => {
          const newPrice = applyFluctuation(item.price);
          const prevPrice = previousPrices[item.symbol] || item.price;
          const priceChange = ((newPrice - prevPrice) / prevPrice) * 100;

          return {
            ...item,
            price: newPrice,
            change: priceChange,
            high: Math.max(item.high, newPrice),
            low: Math.min(item.low, newPrice),
          };
        });

        setPreviousPrices(currentPrices);
        setMarketData(updatedData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setMarketData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data more frequently to show price changes
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Update every 5 seconds to make changes more visible

    return () => clearInterval(intervalId);
  }, [category]);

  const filteredData = marketData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSort = (column: keyof MarketDataItem) => {
    const direction =
      sortConfig.key === column && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key: column, direction });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const { executeTrade } = useTradingContext();

  // Add animation classes for price changes
  const getPriceChangeClass = (symbol: string, currentPrice: number) => {
    const prevPrice = previousPrices[symbol] || currentPrice;
    if (currentPrice > prevPrice) {
      return "bg-green-500/10 transition-colors duration-500";
    }
    if (currentPrice < prevPrice) {
      return "bg-red-500/10 transition-colors duration-500";
    }
    return "";
  };

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
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("change")}
              >
                <div className="flex items-center justify-end">
                  Change %
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">High</TableHead>
              <TableHead className="text-right">Low</TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("volume")}
              >
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
                  <TableCell
                    className={`text-right ${getPriceChangeClass(
                      item.symbol,
                      item.price
                    )}`}
                  >
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      item.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <div className="flex items-center justify-end">
                      {item.change >= 0 ? (
                        <ArrowUp className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3" />
                      )}
                      {item.change >= 0 ? "+" : ""}
                      {Math.abs(item.change).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.high)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.low)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.volume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {" "}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSymbol(item.symbol); // Prices are already in INR
                      }}
                    >
                      Trade
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>{" "}
      <Dialog
        open={!!selectedSymbol}
        onOpenChange={(open) => {
          if (!open) setSelectedSymbol(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trade {selectedSymbol}</DialogTitle>
          </DialogHeader>
          <TradeForm
            initialCommodity={selectedSymbol?.toLowerCase()}
            initialPrice={
              marketData.find((item) => item.symbol === selectedSymbol)?.price
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
