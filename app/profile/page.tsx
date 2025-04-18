import { DashboardHeader } from "@/components/dashboard-header"
import { UserProfile } from "@/components/user-profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProfile />
            </CardContent>
          </Card>
          <div className="col-span-2 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Available Balance</p>
                    <p className="text-2xl font-bold">₹250,000</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Margin Used</p>
                    <p className="text-2xl font-bold">₹75,000</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Open Positions</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">P&L</p>
                    <p className="text-2xl font-bold text-green-500">+₹15,250</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">
                          {i % 2 === 0 ? "Buy" : "Sell"} {i % 2 === 0 ? "Gold" : "Silver"} Futures
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={i % 2 === 0 ? "text-green-500" : "text-red-500"}>
                        {i % 2 === 0 ? "+" : "-"}₹{(Math.random() * 10000).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
