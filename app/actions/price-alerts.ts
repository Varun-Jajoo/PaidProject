"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type PriceAlert = {
  _id?: ObjectId;
  userId: string;
  symbol: string;
  price: number;
  condition: "above" | "below";
  active: boolean;
  createdAt: Date;
};

export type NewPriceAlert = Omit<PriceAlert, "_id">;

export async function createPriceAlert(alert: NewPriceAlert): Promise<string> {
  const { db } = await connectToDatabase();
  const result = await db.collection("price_alerts").insertOne(alert);
  return result.insertedId.toString();
}

export async function getUserAlerts(userId: string): Promise<PriceAlert[]> {
  const { db } = await connectToDatabase();
  const alerts = await db
    .collection("price_alerts")
    .find({ userId, active: true })
    .sort({ createdAt: -1 })
    .toArray();

  return alerts.map((alert) => ({
    _id: alert._id,
    userId: alert.userId,
    symbol: alert.symbol,
    price: alert.price,
    condition: alert.condition,
    active: alert.active,
    createdAt: new Date(alert.createdAt),
  }));
}

export async function deletePriceAlert(alertId: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const result = await db
    .collection("price_alerts")
    .deleteOne({ _id: new ObjectId(alertId) });
  return result.deletedCount > 0;
}

export async function checkPriceAlerts(
  userId: string,
  marketData: Record<string, { price: number }>
): Promise<PriceAlert[]> {
  const { db } = await connectToDatabase();
  const alerts = await getUserAlerts(userId);
  const triggeredAlerts: PriceAlert[] = [];

  for (const alert of alerts) {
    const currentPrice = marketData[alert.symbol]?.price;
    if (!currentPrice) continue;

    if (
      (alert.condition === "above" && currentPrice >= alert.price) ||
      (alert.condition === "below" && currentPrice <= alert.price)
    ) {
      triggeredAlerts.push(alert);
      // Deactivate the triggered alert
      await db
        .collection("price_alerts")
        .updateOne(
          { _id: new ObjectId(alert._id) },
          { $set: { active: false } }
        );
    }
  }

  return triggeredAlerts;
}
