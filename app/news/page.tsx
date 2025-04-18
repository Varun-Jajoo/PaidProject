import { DashboardHeader } from "@/components/dashboard-header"
import { NewsFeed } from "@/components/news-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Market News</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsFeed />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
