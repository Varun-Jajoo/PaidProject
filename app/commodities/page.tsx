import { DashboardHeader } from "@/components/dashboard-header"
import { CommoditiesTable } from "@/components/commodities-table"
import { CommoditySpotlight } from "@/components/commodity-spotlight"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommoditiesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
     
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Commodity Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <CommoditySpotlight />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Market Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium">Gold</p>
                  <p className="text-2xl font-bold text-green-500">+1.2%</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium">Silver</p>
                  <p className="text-2xl font-bold text-red-500">-0.8%</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium">Crude Oil</p>
                  <p className="text-2xl font-bold text-green-500">+2.3%</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium">Natural Gas</p>
                  <p className="text-2xl font-bold text-red-500">-1.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>All Commodities</CardTitle>
            </CardHeader>
            <CardContent>
              <CommoditiesTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
