"use server";

import { cache } from "react";

export type MarketDataItem = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
};

// Keep baseMarketData as internal data - not exported
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

export const getCommodityPriceFromMarketData = cache(
  async (symbol: string): Promise<number | null> => {
    // Search through all categories
    for (const category of Object.values(baseMarketData)) {
      const commodity = category.find(
        (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
      );
      if (commodity) {
        return commodity.price;
      }
    }
    return null;
  }
);

export const getMarketData = cache(
  async (): Promise<Record<string, MarketDataItem[]>> => {
    return { ...baseMarketData };
  }
);

// Export type only - types are not affected by "use server" directive
// Removed redundant export of MarketDataItem
