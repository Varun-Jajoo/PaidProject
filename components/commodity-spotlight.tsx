"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Direct API key as requested
const API_KEY = "ZdsATtS7ITMl0Jw9nasGRg==XHKt6DQQQi1dMImo";

// Commodity options with display names and colors
const commodityOptions = [
  { value: "gold", label: "Gold", color: "#FFD700" },
  { value: "silver", label: "Silver", color: "#C0C0C0" },
  { value: "crude_oil", label: "Crude Oil", color: "#8B4513" },
  { value: "natural_gas", label: "Natural Gas", color: "#87CEEB" },
  { value: "copper", label: "Copper", color: "#B87333" },
];

// Generate mock historical data
const generateHistoricalData = (basePrice: number, days: number) => {
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    // Add some randomness to create a realistic price chart
    const randomFactor = Math.sin(i / 5) * 0.05 + (Math.random() - 0.5) * 0.02;
    const price = basePrice * (1 + randomFactor);

    data.push({
      date: date.toISOString().split("T")[0],
      price: price,
    });
  }

  return data;
};

export function CommoditySpotlight() {
  const [timeframe, setTimeframe] = useState("1w");
  const [commodity, setCommodity] = useState("gold");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get days based on timeframe
  const getDays = () => {
    switch (timeframe) {
      case "1d":
        return 1;
      case "1w":
        return 7;
      case "1m":
        return 30;
      case "3m":
        return 90;
      default:
        return 7;
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/commodityprice?name=${commodity}`,
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
        const result = data[0];

        if (result) {
          setCurrentPrice(result.price);
          // Generate historical data based on current price
          setData(generateHistoricalData(result.price, getDays()));
        } else {
          // If API fails, use mock data
          const mockPrice = 900 + Math.random() * 500;
          setCurrentPrice(mockPrice);
          setData(generateHistoricalData(mockPrice, getDays()));
        }
      } catch (error) {
        console.error("Failed to fetch commodity price:", error);
        // Use mock data on error
        const mockPrice = 1000 + Math.random() * 500;
        setCurrentPrice(mockPrice);
        setData(generateHistoricalData(mockPrice, getDays()));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [commodity, timeframe]);

  const handleCommodityChange = (value: string) => {
    setCommodity(value);
  };

  const formatPrice = (value: number) => {
    const conversionRate = 80; // Example conversion rate from USD to INR
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value * conversionRate);
  };

  // Calculate price change
  const firstPrice = data.length > 0 ? data[0].price : 0;
  const lastPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const priceChange = lastPrice - firstPrice;
  const percentChange = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  // Get selected commodity color
  const selectedCommodity = commodityOptions.find((c) => c.value === commodity);
  const commodityColor = selectedCommodity?.color || "#10B981";

  return (
    <Card className="p-0">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center space-x-2">
            <Select value={commodity} onValueChange={handleCommodityChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Commodity" />
              </SelectTrigger>
              <SelectContent>
                {commodityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-col">
              {currentPrice !== null ? (
                <>
                  <span className="text-sm font-medium">
                    {formatPrice(currentPrice)}
                  </span>
                  <span
                    className={`text-xs ${
                      percentChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {percentChange >= 0 ? "+" : ""}
                    {percentChange.toFixed(2)}%
                  </span>
                </>
              ) : (
                <span className="text-sm">Loading...</span>
              )}
            </div>
          </div>
          <Tabs
            defaultValue="1w"
            className="w-auto"
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <TabsList>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-[300px] w-full px-2">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading chart data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id={`color${commodity}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={commodityColor}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={commodityColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#333"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.getDate().toString();
                  }}
                />
                <YAxis
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={formatPrice}
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatPrice(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={commodityColor}
                  fillOpacity={1}
                  fill={`url(#color${commodity})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}
