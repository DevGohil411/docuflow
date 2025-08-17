import type { Metadata } from "next"
import { IntegrationsPage } from "@/components/integrations-page"

export const metadata: Metadata = {
  title: "Integrations - DocuFlow",
  description: "Connect DocuFlow with your favorite tools and services",
}

export default function Integrations() {
  return <IntegrationsPage />
}
