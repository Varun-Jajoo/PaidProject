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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Star, StarOff } from "lucide-react";
import { useTradingContext } from "@/context/trading-context";

// Define the type for market data
type MarketData = {
  id: string;
  name: string;
  displayName: string;
  category: string;
  price: number;
  previousPrice: number;
  change: number;
  percentChange: number;
  currency: string;
  timestamp: number;
  volume?: number;
  openInterest?: number;
};

// Direct API key as requested
const API_KEY = "ZdsATtS7ITMl0Jw9nasGRg==XHKt6DQQQi1dMImo";

// List of commodities to fetch
const COMMODITIES = [
  { id: "1", name: "gold", displayName: "Gold", category: "metals" },
  { id: "2", name: "silver", displayName: "Silver", category: "metals" },
  { id: "3", name: "platinum", displayName: "Platinum", category: "metals" },
  { id: "4", name: "palladium", displayName: "Palladium", category: "metals" },
  { id: "5", name: "crude_oil", displayName: "Crude Oil", category: "energy" },
  {
    id: "6",
    name: "natural_gas",
    displayName: "Natural Gas",
    category: "energy",
  },
  { id: "7", name: "brent", displayName: "Brent Crude", category: "energy" },
  { id: "8", name: "copper", displayName: "Copper", category: "metals" },
  { id: "9", name: "aluminum", displayName: "Aluminum", category: "metals" },
  { id: "10", name: "wheat", displayName: "Wheat", category: "agriculture" },
  { id: "11", name: "corn", displayName: "Corn", category: "agriculture" },
  { id: "12", name: "cotton", displayName: "Cotton", category: "agriculture" },
  { id: "13", name: "sugar", displayName: "Sugar", category: "agriculture" },
  { id: "14", name: "coffee", displayName: "Coffee", category: "agriculture" },
];

export function MarketWatchTable() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { watchlist, addToWatchlist, removeFromWatchlist } =
    useTradingContext();

  const fetchCommodityPrices = async () => {
    setLoading(true);
    try {
      const newMarketData: MarketData[] = [];

      // Fetch each commodity price individually
      for (const commodity of COMMODITIES) {
        try {
          const response = await fetch(
            `https://api.api-ninjas.com/v1/commodityprice?name=${commodity.name}`,
            {
              headers: {
                "X-Api-Key": API_KEY,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          const apiData = data[0];

          if (apiData) {
            const previousPrice =
              marketData.find((item) => item.id === commodity.id)?.price ||
              apiData.price;
            const change = apiData.price - previousPrice;
            const percentChange = previousPrice
              ? (change / previousPrice) * 100
              : 0;

            newMarketData.push({
              id: commodity.id,
              name: commodity.name,
              displayName: commodity.displayName,
              category: commodity.category,
              price: apiData.price,
              previousPrice: previousPrice,
              change: change,
              percentChange: percentChange,
              currency: apiData.currency,
              timestamp: apiData.timestamp,
              // Mock volume and open interest for demo purposes
              volume: Math.floor(Math.random() * 10000) + 1000,
              openInterest: Math.floor(Math.random() * 5000) + 500,
            });
          }
        } catch (error) {
          console.error(`Failed to fetch ${commodity.name}:`, error);

          // Use previous data or mock data if API fails
          const previousData = marketData.find(
            (item) => item.id === commodity.id
          );
          if (previousData) {
            newMarketData.push(previousData);
          } else {
            // Create mock data
            newMarketData.push({
              id: commodity.id,
              name: commodity.name,
              displayName: commodity.displayName,
              category: commodity.category,
              price: Math.random() * 1000 + 100,
              previousPrice: 0,
              change: 0,
              percentChange: 0,
              currency: "USD",
              timestamp: Date.now() / 1000,
              volume: Math.floor(Math.random() * 10000) + 1000,
              openInterest: Math.floor(Math.random() * 5000) + 500,
            });
          }
        }
      }

      setMarketData(newMarketData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch commodity prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodityPrices();

    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(fetchCommodityPrices, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") {
      const conversionRate = 82; // Example conversion rate from USD to INR
      price = price * conversionRate;
      currency = "INR";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const toggleWatchlist = (commodity: string) => {
    if (watchlist.includes(commodity)) {
      removeFromWatchlist(commodity);
    } else {
      addToWatchlist(commodity);
    }
  };

  return (
    <div className="overflow-auto">
      <div className="px-4 py-2 text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
      <Table>
        <TableHeader className="bg-muted/50 sticky top-0">
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="whitespace-nowrap">Commodity</TableHead>
            <TableHead className="whitespace-nowrap">Category</TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Price
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Change
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              % Change
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Volume
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Open Interest
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Last Updated
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && marketData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Loading market data...
              </TableCell>
            </TableRow>
          ) : marketData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No market data available
              </TableCell>
            </TableRow>
          ) : (
            marketData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleWatchlist(item.name)}
                  >
                    {watchlist.includes(item.name) ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  {item.displayName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(item.price, item.currency)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    item.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.change >= 0 ? "+" : ""}
                  {formatNumber(item.change)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    item.percentChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <div className="flex items-center justify-end">
                    {item.percentChange >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {formatNumber(Math.abs(item.percentChange))}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {item.volume?.toLocaleString() || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {item.openInterest?.toLocaleString() || "-"}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatTimestamp(item.timestamp)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
