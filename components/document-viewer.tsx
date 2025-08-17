"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize } from "lucide-react"
import { useDocumentStore } from "@/stores/document-store"

interface DocumentViewerProps {
  documentId: string
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
  const { documents, selectedDocument, setSelectedDocument } = useDocumentStore()
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(5) // Mock total pages
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const document = documents.find((doc) => doc.id === documentId)
    if (document) {
      setSelectedDocument(document)
    }
  }, [documentId, documents, setSelectedDocument])

  useEffect(() => {
    // Mock PDF rendering - in real implementation, use pdf.js here
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw mock document content
        ctx.fillStyle = "#000000"
        ctx.font = "16px Arial"
        ctx.fillText("Mock PDF Document", 50, 50)
        ctx.fillText(`Page ${currentPage} of ${totalPages}`, 50, 80)
        ctx.fillText("This is a mock PDF viewer.", 50, 110)
        ctx.fillText("In a real implementation, pdf.js would render the actual PDF content here.", 50, 140)

        // Draw some mock content based on document type
        if (selectedDocument?.name.includes("Invoice")) {
          ctx.fillText("INVOICE", 50, 200)
          ctx.fillText("Invoice #: INV-2024-001", 50, 230)
          ctx.fillText("Date: January 15, 2024", 50, 260)
          ctx.fillText("Amount: $1,250.00", 50, 290)
        }
      }
    }
  }, [currentPage, selectedDocument, zoom])

  if (!selectedDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold truncate">{selectedDocument.name}</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[60px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="mx-auto max-w-4xl">
          <canvas
            ref={canvasRef}
            width={800}
            height={1000}
            className="w-full h-auto"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
          />
        </Card>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-center p-4 border-t border-border bg-muted/50">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
