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
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, BellOff } from "lucide-react";
import { useMarketData } from "@/hooks/use-market-data";
import { useToast } from "@/components/ui/use-toast";
import { createPriceAlert, deletePriceAlert } from "@/app/actions/price-alerts";

const commodityOptions = [
  { value: "GOLD", label: "Gold", color: "#FFD700" },
  { value: "SILVER", label: "Silver", color: "#C0C0C0" },
  { value: "CRUDEOIL", label: "Crude Oil", color: "#8B4513" },
  { value: "NATURALGAS", label: "Natural Gas", color: "#87CEEB" },
  { value: "COPPER", label: "Copper", color: "#B87333" },
];

// Calculate technical indicators
const calculateIndicators = (data: any[]) => {
  // Calculate 5-day SMA
  const smaData = data.map((item, index) => {
    if (index < 4) return { ...item, sma: null };
    const slice = data.slice(index - 4, index + 1);
    const sum = slice.reduce((acc, val) => acc + val.price, 0);
    return { ...item, sma: sum / 5 };
  });

  // Calculate RSI (14 periods)
  const rsiData = smaData.map((item, index) => {
    if (index < 14) return { ...item, rsi: null };
    const gains = [];
    const losses = [];
    for (let i = index - 13; i <= index; i++) {
      const change = data[i].price - data[i - 1].price;
      if (change >= 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(change));
      }
    }
    const avgGain = gains.reduce((a, b) => a + b) / 14;
    const avgLoss = losses.reduce((a, b) => a + b) / 14;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    return { ...item, rsi };
  });

  return rsiData;
};

export function CommoditySpotlight() {
  const [timeframe, setTimeframe] = useState("1w");
  const [commodity, setCommodity] = useState("GOLD");
  const [showIndicators, setShowIndicators] = useState(true);
  const [hasAlert, setHasAlert] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: marketData, loading } = useMarketData(commodity, 15000); // 15 second updates

  // Generate historical data from current price
  const generateHistoricalData = (basePrice: number, days: number) => {
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      // Use sine wave + random noise for realistic price movement
      const randomFactor = Math.sin(i / 5) * 0.05 + (Math.random() - 0.5) * 0.02;
      const price = basePrice * (1 + randomFactor);
      
      data.push({
        date: date.toISOString().split("T")[0],
        price: price,
      });
    }
    
    return calculateIndicators(data);
  };

  const getDays = () => {
    switch (timeframe) {
      case "1d": return 1;
      case "1w": return 7;
      case "1m": return 30;
      case "3m": return 90;
      default: return 7;
    }
  };

  const chartData = marketData ? generateHistoricalData(marketData.price, getDays()) : [];

  const handleSetAlert = async () => {
    if (!marketData) return;
    
    try {
      if (hasAlert) {
        if (!alertId) {
          throw new Error("Alert ID not found");
        }
        await deletePriceAlert(alertId);
        setHasAlert(false);
        setAlertId(null);
        toast({
          title: "Alert Removed",
          description: `Price alert for ${commodity} has been removed`,
        });
      } else {
        const targetPrice = marketData.price * 1.01; // Alert at 1% above current price
        const alert = {
          userId: "user123", // TODO: Get actual user ID
          symbol: commodity,
          price: targetPrice,
          condition: "above" as const,
          active: true,
          createdAt: new Date()
        };
        const newAlertId = await createPriceAlert(alert);
        setAlertId(newAlertId);
        setHasAlert(true);
        toast({
          title: "Alert Set",
          description: `You will be notified when ${commodity} reaches ${formatPrice(targetPrice)}`,
        });
      }
    } catch (error) {
      console.error("Failed to manage price alert:", error);
      toast({
        title: "Error",
        description: "Failed to manage price alert",
        variant: "destructive",
      });
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

  // Calculate price changes
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const percentChange = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  // Get selected commodity color
  const selectedCommodity = commodityOptions.find((c) => c.value === commodity);
  const commodityColor = selectedCommodity?.color || "#10B981";

  return (
    <Card className="p-0">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center space-x-4">
            <Select value={commodity} onValueChange={setCommodity}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select commodity" />
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
              {!loading && marketData ? (
                <>
                  <span className="text-sm font-medium">
                    {formatPrice(marketData.price)}
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetAlert}
              className="ml-2"
            >
              {hasAlert ? (
                <BellOff className="h-4 w-4 mr-2" />
              ) : (
                <Bell className="h-4 w-4 mr-2" />
              )}
              {hasAlert ? "Remove Alert" : "Set Alert"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIndicators(!showIndicators)}
            >
              {showIndicators ? "Hide Indicators" : "Show Indicators"}
            </Button>
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
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id={`color${commodity}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={commodityColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={commodityColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
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
                  formatter={(value: number, name: string) => [
                    formatPrice(value),
                    name === "price" ? "Price" : name === "sma" ? "SMA (5)" : "RSI (14)"
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={commodityColor}
                  fillOpacity={1}
                  fill={`url(#color${commodity})`}
                />
                {showIndicators && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="sma"
                      stroke="#8884d8"
                      dot={false}
                      strokeWidth={2}
                      name="SMA (5)"
                    />
                    <Line
                      type="monotone"
                      dataKey="rsi"
                      stroke="#82ca9d"
                      dot={false}
                      strokeWidth={2}
                      name="RSI (14)"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}
