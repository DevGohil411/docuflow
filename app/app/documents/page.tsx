import { DocumentsTable } from "@/components/documents-table"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentFilters } from "@/components/document-filters"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <DocumentUpload />
      </div>

      <DocumentFilters />
      <DocumentsTable />
    </div>
  )
}
