import { Suspense } from "react"
import { MarketWatchTable } from "@/components/market-watch-table"
import { MarketWatchFilters } from "@/components/market-watch-filters"
import { MarketWatchSkeleton } from "@/components/market-watch-skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MarketWatchPage() {
  return (
    <div className="container space-y-6 py-6 md:py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Watch</h1>
        <p className="text-muted-foreground">Real-time commodity prices and trading data</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Commodity Prices</CardTitle>
              <CardDescription>Live market data from global exchanges</CardDescription>
            </div>
            <MarketWatchFilters />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<MarketWatchSkeleton />}>
            <MarketWatchTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
