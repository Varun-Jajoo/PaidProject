export type AlertType = PriceAlert | TechnicalAlert

export type PriceAlert = {
  id: string
  type: "price"
  symbol: string
  price: number
  condition: "above" | "below"
  targetPrice: number
  active: boolean
  triggered: boolean
  createdAt: string
}

export type TechnicalAlert = {
  id: string
  type: "technical"
  symbol: string
  indicator: "rsi" | "macd" | "ma" | "volume"
  condition: string
  value: number
  active: boolean
  triggered: boolean
  createdAt: string
}
