import type { Metadata } from "next"
import { ApprovalsPage } from "@/components/approvals-page"

export const metadata: Metadata = {
  title: "Approvals - DocuFlow",
  description: "Manage document approvals and review requests",
}

export default function Approvals() {
  return <ApprovalsPage />
}
