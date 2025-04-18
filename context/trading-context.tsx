"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type Portfolio = {
  cash: number;
  positions: {
    commodity: string;
    quantity: number;
    averagePrice: number;
  }[];
};

export type Trade = {
  id: string;
  commodity: string;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  total: number;
  timestamp: Date;
};

type TradingContextType = {
  portfolio: Portfolio;
  trades: Trade[];
  watchlist: string[];
  executeTrade: (
    commodity: string,
    type: "buy" | "sell",
    quantity: number,
    price: number
  ) => Promise<boolean>;
  addToWatchlist: (commodity: string) => void;
  removeFromWatchlist: (commodity: string) => void;
};

const defaultPortfolio: Portfolio = {
  cash: 100000, // Starting with $100,000
  positions: [],
};

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(defaultPortfolio);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([
    "gold",
    "silver",
    "crude_oil",
  ]);

  // Load saved data from localStorage on client side
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("portfolio");
    const savedTrades = localStorage.getItem("trades");
    const savedWatchlist = localStorage.getItem("watchlist");

    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    localStorage.setItem("trades", JSON.stringify(trades));
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [portfolio, trades, watchlist]);

  const executeTrade = async (
    commodity: string,
    type: "buy" | "sell",
    quantity: number,
    price: number
  ): Promise<boolean> => {
    const total = price * quantity;

    console.log("Executing trade:", {
      commodity,
      type,
      quantity,
      price,
      total,
    });

    // Check if we have enough cash for buying
    if (type === "buy" && total > portfolio.cash) {
      console.error("Not enough cash to execute the trade.", {
        cash: portfolio.cash,
        total,
      });
      return false; // Not enough cash
    }

    // Check if we have enough quantity for selling
    if (type === "sell") {
      const position = portfolio.positions.find(
        (p) => p.commodity === commodity
      );
      if (!position || position.quantity < quantity) {
        console.error("Not enough quantity to sell.", { position, quantity });
        return false; // Not enough quantity to sell
      }
    }

    // Create new trade
    const newTrade: Trade = {
      id: Date.now().toString(),
      commodity,
      type,
      price,
      quantity,
      total,
      timestamp: new Date(),
    };

    // Update trades
    setTrades((prev) => [newTrade, ...prev]);

    // Update portfolio
    setPortfolio((prev) => {
      const newPortfolio = { ...prev };

      // Update cash
      if (type === "buy") {
        newPortfolio.cash -= total;
      } else {
        newPortfolio.cash += total;
      }

      // Update positions
      const existingPosition = newPortfolio.positions.find(
        (p) => p.commodity === commodity
      );
      if (existingPosition) {
        if (type === "buy") {
          // Calculate new average price
          const totalValue =
            existingPosition.quantity * existingPosition.averagePrice + total;
          const newQuantity = existingPosition.quantity + quantity;
          existingPosition.averagePrice = totalValue / newQuantity;
          existingPosition.quantity = newQuantity;
        } else {
          // Selling
          existingPosition.quantity -= quantity;
          // Remove position if quantity is 0
          if (existingPosition.quantity === 0) {
            newPortfolio.positions = newPortfolio.positions.filter(
              (p) => p.commodity !== commodity
            );
          }
        }
      } else if (type === "buy") {
        // New position
        newPortfolio.positions.push({
          commodity,
          quantity,
          averagePrice: price,
        });
      }

      return newPortfolio;
    });

    return true;
  };

  const addToWatchlist = (commodity: string) => {
    if (!watchlist.includes(commodity)) {
      setWatchlist((prev) => [...prev, commodity]);
    }
  };

  const removeFromWatchlist = (commodity: string) => {
    setWatchlist((prev) => prev.filter((item) => item !== commodity));
  };

  return (
    <TradingContext.Provider
      value={{
        portfolio,
        trades,
        watchlist,
        executeTrade,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTradingContext() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error("useTradingContext must be used within a TradingProvider");
  }
  return context;
}
