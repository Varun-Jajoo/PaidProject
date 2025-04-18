"use client";

import { useState, useEffect, useCallback } from "react";
import { getMarketData } from "@/app/actions/market-data";

export function useMarketData(symbol: string, interval = 5000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const marketData = await getMarketData();
      const allData = Object.values(marketData).flat();
      const commodityData = allData.find((item) => item.symbol === symbol);

      if (commodityData) {
        setData(commodityData);
      }
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return { data, loading, error, refetch: fetchData };
}
