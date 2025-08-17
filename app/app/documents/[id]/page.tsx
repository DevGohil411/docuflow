import { DocumentViewer } from "@/components/document-viewer"
import { DocumentSidebar } from "@/components/document-sidebar"

interface DocumentPageProps {
  params: {
    id: string
  }
}

export default function DocumentPage({ params }: DocumentPageProps) {
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <DocumentViewer documentId={params.id} />
      </div>
      <div className="w-80 border-l border-border">
        <DocumentSidebar documentId={params.id} />
      </div>
    </div>
  )
}
