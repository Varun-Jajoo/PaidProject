"use client";

import { useState } from "react";
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
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";

// Mock data for commodities
const commoditiesData = [
  {
    id: "1",
    name: "Gold",
    symbol: "GOLD",
    category: "Metals",
    price: 62450,
    change: 1.2,
    volume: 12450,
    openInterest: 8750,
    expiry: "28 Jun 2025",
  },
  {
    id: "2",
    name: "Silver",
    symbol: "SILVER",
    category: "Metals",
    price: 78250,
    change: -0.8,
    volume: 9870,
    openInterest: 6540,
    expiry: "28 Jun 2025",
  },
  {
    id: "3",
    name: "Crude Oil",
    symbol: "CRUDEOIL",
    category: "Energy",
    price: 6780,
    change: 2.3,
    volume: 24560,
    openInterest: 12340,
    expiry: "19 May 2025",
  },
  {
    id: "4",
    name: "Natural Gas",
    symbol: "NATURALGAS",
    category: "Energy",
    price: 245.6,
    change: -1.5,
    volume: 18760,
    openInterest: 9870,
    expiry: "26 May 2025",
  },
  {
    id: "5",
    name: "Copper",
    symbol: "COPPER",
    category: "Metals",
    price: 845.7,
    change: 0.5,
    volume: 7650,
    openInterest: 4320,
    expiry: "30 Jun 2025",
  },
  {
    id: "6",
    name: "Cotton",
    symbol: "COTTON",
    category: "Agriculture",
    price: 34560,
    change: -0.3,
    volume: 5430,
    openInterest: 3210,
    expiry: "30 May 2025",
  },
  {
    id: "7",
    name: "Aluminium",
    symbol: "ALUMINIUM",
    category: "Metals",
    price: 245.8,
    change: 1.8,
    volume: 6540,
    openInterest: 4320,
    expiry: "30 Jun 2025",
  },
  {
    id: "8",
    name: "Lead",
    symbol: "LEAD",
    category: "Metals",
    price: 187.4,
    change: 0.2,
    volume: 4320,
    openInterest: 2340,
    expiry: "30 Jun 2025",
  },
  {
    id: "9",
    name: "Zinc",
    symbol: "ZINC",
    category: "Metals",
    price: 312.6,
    change: -0.7,
    volume: 5430,
    openInterest: 3210,
    expiry: "30 Jun 2025",
  },
  {
    id: "10",
    name: "Nickel",
    symbol: "NICKEL",
    category: "Metals",
    price: 1654.3,
    change: 2.1,
    volume: 3210,
    openInterest: 1870,
    expiry: "30 Jun 2025",
  },
];

export function CommoditiesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Filter commodities based on search term
  const filteredCommodities = commoditiesData.filter(
    (commodity) =>
      commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commodity.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commodity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort commodities
  const sortedCommodities = [...filteredCommodities].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];

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

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
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
              <TableHead>Category</TableHead>
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
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Open Interest</TableHead>
              <TableHead className="text-right">Expiry</TableHead>
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
                  <TableCell>{commodity.category}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(commodity.price)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      commodity.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {commodity.change >= 0 ? "+" : ""}
                    {commodity.change.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {commodity.volume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {commodity.openInterest.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {commodity.expiry}
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
