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
import { Search, ArrowUpDown } from "lucide-react";
import { useTradingContext } from "@/context/trading-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TradeForm } from "@/components/trade-form";

type MarketDataItem = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
};

interface MarketDataTableProps {
  category: "metals" | "energy" | "agriculture" | "others";
}

// Utility to apply ±0.3% random fluctuation
function applyFluctuation(price: number): number {
  const fluctuation = price * 0.003;
  const randomFactor = (Math.random() * 2 - 1) * fluctuation;
  return parseFloat((price + randomFactor).toFixed(2));
}

// Base market data with Indian MCX spot/futures prices
const baseMarketData: Record<string, MarketDataItem[]> = {
  metals: [
    {
      id: "1",
      name: "Gold (10g)",
      symbol: "GOLD",
      price: 94760,
      change: 0,
      high: 96000,
      low: 93500,
      volume: 5000,
    },
    {
      id: "2",
      name: "Silver (10g)",
      symbol: "SILVER",
      price: 952,
      change: 0,
      high: 970,
      low: 940,
      volume: 7500,
    },
    {
      id: "3",
      name: "Copper (kg)",
      symbol: "COPPER",
      price: 906.4,
      change: 0,
      high: 920,
      low: 890,
      volume: 3000,
    },
    {
      id: "4",
      name: "Aluminium (kg)",
      symbol: "ALUMINIUM",
      price: 232.85,
      change: 0,
      high: 240,
      low: 225,
      volume: 4000,
    },
    {
      id: "5",
      name: "Lead (kg)",
      symbol: "LEAD",
      price: 191.85,
      change: 0,
      high: 200,
      low: 185,
      volume: 3500,
    },
    {
      id: "6",
      name: "Zinc (kg)",
      symbol: "ZINC",
      price: 273.95,
      change: 0,
      high: 285,
      low: 260,
      volume: 3600,
    },
    {
      id: "7",
      name: "Nickel (kg)",
      symbol: "NICKEL",
      price: 1654.3,
      change: 0,
      high: 1680,
      low: 1630,
      volume: 1500,
    },
  ],
  energy: [
    {
      id: "1",
      name: "Crude Oil (barrel)",
      symbol: "CRUDEOIL",
      price: 5811,
      change: 0,
      high: 6122,
      low: 5555,
      volume: 24000,
    },
    {
      id: "2",
      name: "Natural Gas (MMBtu)",
      symbol: "NATURALGAS",
      price: 356.1,
      change: 0,
      high: 388,
      low: 322,
      volume: 18000,
    },
    {
      id: "3",
      name: "Brent Crude (barrel)",
      symbol: "BRENT",
      price: 6122,
      change: 0,
      high: 6375,
      low: 5800,
      volume: 15000,
    },
    {
      id: "4",
      name: "Heating Oil (barrel)",
      symbol: "HEATINGOIL",
      price: 2345,
      change: 0,
      high: 2400,
      low: 2300,
      volume: 9000,
    },
  ],
  agriculture: [
    {
      id: "1",
      name: "Cotton (bale)",
      symbol: "COTTON",
      price: 1795,
      change: 0,
      high: 1850,
      low: 1750,
      volume: 7000,
    },
    {
      id: "2",
      name: "Soybean (kg)",
      symbol: "SOYBEAN",
      price: 6060,
      change: 0,
      high: 6200,
      low: 5900,
      volume: 6500,
    },
    {
      id: "3",
      name: "Wheat (kg)",
      symbol: "WHEAT",
      price: 2390,
      change: 0,
      high: 2450,
      low: 2350,
      volume: 6000,
    },
    {
      id: "4",
      name: "Corn (kg)",
      symbol: "CORN",
      price: 1970,
      change: 0,
      high: 2050,
      low: 1900,
      volume: 8200,
    },
    {
      id: "5",
      name: "Sugar (kg)",
      symbol: "SUGAR",
      price: 3410,
      change: 0,
      high: 3550,
      low: 3300,
      volume: 9500,
    },
  ],
  others: [
    {
      id: "1",
      name: "Rubber (kg)",
      symbol: "RUBBER",
      price: 18760,
      change: 0,
      high: 19000,
      low: 18500,
      volume: 3200,
    },
    {
      id: "2",
      name: "Mentha Oil (kg)",
      symbol: "MENTHAOIL",
      price: 958.9,
      change: 0,
      high: 980,
      low: 930,
      volume: 2800,
    },
    {
      id: "3",
      name: "CPO (kg)",
      symbol: "CPO",
      price: 876,
      change: 0,
      high: 900,
      low: 850,
      volume: 5400,
    },
  ],
};

export function MarketDataTable({ category }: MarketDataTableProps) {
  const [data, setData] = useState<MarketDataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof MarketDataItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketDataItem | null>(null);

  useEffect(() => {
    // Apply fluctuation to base data on each category change
    const updated = baseMarketData[category].map((item) => ({
      ...item,
      price: applyFluctuation(item.price),
      high: applyFluctuation(item.high),
      low: applyFluctuation(item.low),
      change: parseFloat((Math.random() * 0.6 - 0.3).toFixed(2)),
    }));
    setData(updated);
  }, [category]);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSort = (column: keyof MarketDataItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const { executeTrade } = useTradingContext();

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
                  <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                  <TableCell className={`text-right ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(item.high)}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.low)}</TableCell>
                  <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDialogOpen(true);
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
      </div>      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedItem(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Trade {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          <TradeForm initialCommodity={selectedItem?.symbol.toLowerCase()} initialPrice={selectedItem?.price} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
