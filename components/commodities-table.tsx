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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { getMarketData, type MarketDataItem } from "@/app/actions/market-data";

function applyFluctuation(price: number): number {
  const fluctuation = price * 0.003;
  const randomFactor = (Math.random() * 2 - 1) * fluctuation;
  return parseFloat((price + randomFactor).toFixed(2));
}

export function CommoditiesTable() {
  const [commodities, setCommodities] = useState<MarketDataItem[]>([]);
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof MarketDataItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const itemsPerPage = 5;

  // Effect to fetch and update market data
  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        const data = await getMarketData();
        const categoryData =
          selectedCategory === "all"
            ? Object.values(data).flat()
            : data[selectedCategory.toLowerCase()] || [];

        // Store current prices without immediate update
        const currentPrices: Record<string, number> = {};
        const updatedData = categoryData.map((item) => ({
          ...item,
          originalPrice: item.price, // Store original price
        }));

        setCommodities(updatedData);

        // Apply price updates with delay
        setTimeout(() => {
          const newData = updatedData.map((item) => {
            const newPrice = applyFluctuation(item.originalPrice);
            const prevPrice = previousPrices[item.symbol] || item.price;
            const priceChange = ((newPrice - prevPrice) / prevPrice) * 100;
            currentPrices[item.symbol] = newPrice;

            return {
              ...item,
              price: newPrice,
              change: priceChange,
            };
          });

          setPreviousPrices(currentPrices);
          setCommodities(newData);
          setIsUpdating(false);
        }, 2000); // 2 second delay for smooth transition
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setIsUpdating(false);
      }
    };

    fetchAndUpdateData();
    const intervalId = setInterval(() => {
      setIsUpdating(true);
      fetchAndUpdateData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedCategory]);

  // Get price change class for animations
  const getPriceChangeClass = (symbol: string, currentPrice: number) => {
    const prevPrice = previousPrices[symbol] || currentPrice;
    if (isUpdating) return "";
    if (currentPrice > prevPrice) {
      return "bg-green-500/10 transition-colors duration-2000";
    }
    if (currentPrice < prevPrice) {
      return "bg-red-500/10 transition-colors duration-2000";
    }
    return "";
  };

  // Filter commodities based on search term
  const filteredCommodities = commodities.filter(
    (commodity) =>
      commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commodity.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort commodities
  const sortedCommodities = [...filteredCommodities].sort((a, b) => {
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

  // Paginate commodities
  const paginatedCommodities = sortedCommodities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);

  const handleSort = (column: keyof MarketDataItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="metals">Metals</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commodities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCommodities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No commodities found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCommodities.map((commodity) => (
                <TableRow key={commodity.id}>
                  <TableCell className="font-medium">
                    {commodity.name}
                  </TableCell>
                  <TableCell>{commodity.symbol}</TableCell>
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
                      {commodity.change >= 0 ? "+" : ""}
                      {Math.abs(commodity.change).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(commodity.high)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(commodity.low)}
                  </TableCell>
                  <TableCell className="text-right">
                    {commodity.volume.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
