import { CommoditySpotlight } from "@/components/commodity-spotlight"
import { TrendingCommodities } from "@/components/trending-commodities"
import { MarketSummary } from "@/components/market-summary"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="container space-y-6 py-6 md:py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commodity Exchange Dashboard</h1>
        <p className="text-muted-foreground">Monitor real-time commodity prices and market trends</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Real-time commodity price movements</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CommoditySpotlight />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Summary</CardTitle>
            <CardDescription>Today's key statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketSummary />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioSummary />

        <Card>
          <CardHeader>
            <CardTitle>Trending Commodities</CardTitle>
            <CardDescription>Most active commodities by volume</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendingCommodities />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
