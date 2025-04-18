import { ObjectId } from "mongodb";

export interface Trade {
  _id?: ObjectId;
  commodityId: string;
  commodityName: string;
  price: number;
  amount: number;
  total: number;
  side: "buy" | "sell";
  timestamp: Date;
  userId: string; // For future authentication
  status: "pending" | "completed" | "cancelled";
}

export type NewTrade = Omit<Trade, "_id">;
