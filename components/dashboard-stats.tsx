"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Documents",
    value: "0",
    change: "0%",
    changeType: "neutral" as const,
    icon: FileText,
  },
  {
    title: "Pending Tasks",
    value: "0",
    change: "0%",
    changeType: "neutral" as const,
    icon: Clock,
  },
  {
    title: "Completed Today",
    value: "0",
    change: "0%",
    changeType: "neutral" as const,
    icon: CheckCircle,
  },
  {
    title: "Requires Attention",
    value: "0",
    change: "0",
    changeType: "neutral" as const,
    icon: AlertTriangle,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">No activity yet</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
