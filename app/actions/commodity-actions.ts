"use server"

import { cache } from "react"

export type CommodityPrice = {
  name: string
  price: number
  currency: string
  timestamp: number
}

// Direct API key as requested
const API_KEY = "ZdsATtS7ITMl0Jw9nasGRg==XHKt6DQQQi1dMImo"

// Cache the fetch for 5 minutes to avoid excessive API calls
export const getCommodityPrice = cache(async (name: string): Promise<CommodityPrice | null> => {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${encodeURIComponent(name)}`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error("API Error:", response.status)
      return null
    }

    const data = await response.json()
    return data[0] || null
  } catch (error) {
    console.error("Request failed:", error)
    return null
  }
})

// Get multiple commodity prices at once
export const getMultipleCommodityPrices = async (names: string[]): Promise<Record<string, CommodityPrice | null>> => {
  const results: Record<string, CommodityPrice | null> = {}

  // Use Promise.all to fetch all commodities in parallel
  await Promise.all(
    names.map(async (name) => {
      results[name] = await getCommodityPrice(name)
    }),
  )

  return results
}
