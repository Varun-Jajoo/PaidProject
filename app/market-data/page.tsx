import { DashboardHeader } from "@/components/dashboard-header"
import { MarketDataTable } from "@/components/market-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MarketDataPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
    
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="metals">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="metals">Metals</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
          </TabsList>
          <TabsContent value="metals" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Metals Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketDataTable category="metals" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="energy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Energy Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketDataTable category="energy" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="agriculture" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Agriculture Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketDataTable category="agriculture" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="others" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Other Commodities</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketDataTable category="others" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
