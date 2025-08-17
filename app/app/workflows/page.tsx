import type { Metadata } from "next"
import WorkflowsPageClient from "./WorkflowsPageClient"

export const metadata: Metadata = {
  title: "Workflows - DocuFlow",
  description: "Automate your document processing with custom workflows",
}

export default function WorkflowsPage() {
  return <WorkflowsPageClient />
}
