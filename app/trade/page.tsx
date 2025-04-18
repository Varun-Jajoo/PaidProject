import { TradeForm } from "@/components/trade-form"
import { TradeHistory } from "@/components/trade-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TradePage() {
  return (
    <div className="container space-y-6 py-6 md:py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trade Commodities</h1>
        <p className="text-muted-foreground">Buy and sell commodities with real-time pricing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeForm />
          </CardContent>
        </Card>

        <TradeHistory />
      </div>
    </div>
  )
}
