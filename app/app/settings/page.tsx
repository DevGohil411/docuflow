import type { Metadata } from "next"
import { SettingsDashboard } from "@/components/settings-dashboard"

export const metadata: Metadata = {
  title: "Settings - DocuFlow",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return <SettingsDashboard />
}
