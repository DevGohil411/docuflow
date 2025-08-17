import type { Metadata } from "next"
import { WorkflowBuilder } from "@/components/workflow-builder"

export const metadata: Metadata = {
  title: "Workflow Builder - DocuFlow",
  description: "Create and edit document processing workflows",
}

export default function WorkflowBuilderPage() {
  return <WorkflowBuilder />
}
