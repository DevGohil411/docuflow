import type { Metadata } from "next"
import { AuditPage } from "@/components/audit-page"

export const metadata: Metadata = {
  title: "Audit Trail - DocuFlow",
  description: "View detailed audit logs and security events",
}

export default function Audit() {
  return <AuditPage />
}
