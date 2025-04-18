import { DashboardHeader } from "@/components/dashboard-header"
import { AdminPanel } from "@/components/admin-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
