"use client";

import { useEffect, useState } from "react";
import { Bell, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserAlerts, checkPriceAlerts } from "@/app/actions/price-alerts";

type Alert = {
  id: string;
  symbol: string;
  type: "buy" | "sell" | "info" | "price";
  message: string;
  timestamp: string;
};

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        // Mock market data - in production this would come from your API
        const mockMarketData = {
          GOLD: { price: 2000 + Math.random() * 100 },
          SILVER: { price: 25 + Math.random() * 5 },
          CRUDE_OIL: { price: 80 + Math.random() * 10 },
        };

        const triggeredAlerts = await checkPriceAlerts(
          "demo-user",
          mockMarketData
        );

        if (triggeredAlerts.length > 0) {
          const newAlerts = triggeredAlerts.map((alert) => ({
            id: alert._id?.toString() || Date.now().toString(),
            symbol: alert.symbol,
            type: "price" as const,
            message: `Price alert: ${alert.symbol} ${alert.condition} ₹${alert.price}`,
            timestamp: new Date().toISOString(),
          }));

          setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to check alerts:", error);
      }
    };

    // Initial check
    checkAlerts();

    // Set up periodic checks
    const intervalId = setInterval(checkAlerts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "buy":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "sell":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "price":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <p className="text-center text-muted-foreground">No alerts available</p>
      ) : (
        alerts.map((alert) => (
          <Card key={alert.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.symbol}</p>
                    <Badge variant="outline" className="text-xs">
                      {formatTimestamp(alert.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
