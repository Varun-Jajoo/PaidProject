"use server"

// In-memory storage for price alerts (in a real app, this would be in a database)
let priceAlerts: Record<string, { symbol: string; targetPrice: number; userId: string }[]> = {};

export async function setPriceAlert(symbol: string, targetPrice: number, userId: string) {
  if (!priceAlerts[userId]) {
    priceAlerts[userId] = [];
  }
  
  // Remove any existing alert for this symbol
  priceAlerts[userId] = priceAlerts[userId].filter(alert => alert.symbol !== symbol);
  
  // Add new alert
  priceAlerts[userId].push({
    symbol,
    targetPrice,
    userId
  });
  
  return { success: true };
}

export async function removePriceAlert(symbol: string, userId: string) {
  if (priceAlerts[userId]) {
    priceAlerts[userId] = priceAlerts[userId].filter(alert => alert.symbol !== symbol);
  }
  return { success: true };
}

export async function getUserAlerts(userId: string) {
  return priceAlerts[userId] || [];
}

export async function checkPriceAlerts(currentPrices: Record<string, number>) {
  const triggeredAlerts: { userId: string; symbol: string; targetPrice: number }[] = [];
  
  // Check each user's alerts
  Object.entries(priceAlerts).forEach(([userId, alerts]) => {
    alerts.forEach(alert => {
      const currentPrice = currentPrices[alert.symbol];
      if (currentPrice && currentPrice >= alert.targetPrice) {
        triggeredAlerts.push({
          userId,
          symbol: alert.symbol,
          targetPrice: alert.targetPrice
        });
        // Remove triggered alert
        removePriceAlert(alert.symbol, userId);
      }
    });
  });
  
  return triggeredAlerts;
}
