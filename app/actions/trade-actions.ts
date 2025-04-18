"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NewTrade, Trade } from "../models/trade";

// Helper function to serialize MongoDB documents
function serializeTrade(trade: any): Trade {
  return {
    ...trade,
    _id: trade._id.toString(),
    timestamp: new Date(trade.timestamp),
  };
}

export async function createTrade(trade: NewTrade): Promise<string> {
  const { db } = await connectToDatabase();

  // Add timestamp if not provided
  if (!trade.timestamp) {
    trade.timestamp = new Date();
  }

  const result = await db.collection("trades").insertOne(trade);
  return result.insertedId.toString();
}

export async function getTrades(): Promise<Trade[]> {
  const { db } = await connectToDatabase();
  const trades = await db
    .collection("trades")
    .find({})
    .sort({ timestamp: -1 })
    .toArray();

  return trades.map(serializeTrade);
}

export async function getOrderBook(commodityId: string): Promise<{
  buyOrders: Trade[];
  sellOrders: Trade[];
}> {
  const { db } = await connectToDatabase();

  const [buyOrders, sellOrders] = await Promise.all([
    db
      .collection("trades")
      .find({
        commodityId,
        side: "buy",
        status: "pending",
      })
      .sort({ price: -1 })
      .toArray(),
    db
      .collection("trades")
      .find({
        commodityId,
        side: "sell",
        status: "pending",
      })
      .sort({ price: 1 })
      .toArray(),
  ]);

  return {
    buyOrders: buyOrders.map(serializeTrade),
    sellOrders: sellOrders.map(serializeTrade),
  };
}

export async function updateTradeStatus(
  tradeId: string,
  status: Trade["status"]
): Promise<boolean> {
  const { db } = await connectToDatabase();

  const result = await db
    .collection("trades")
    .updateOne({ _id: new ObjectId(tradeId) }, { $set: { status } });

  return result.modifiedCount > 0;
}
