import type { Metadata } from "next"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export const metadata: Metadata = {
  title: "Analytics - DocuFlow",
  description: "View detailed analytics and insights for your document processing",
}

export default function AnalyticsPage() {
  return <AnalyticsDashboard />
}
