"use client"

import { useState } from "react"
import { useDocumentStore } from "@/stores/document-store"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Eye, Download, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import type { Document } from "@/lib/types"

export function DocumentsTable() {
  const { documents, deleteDocument } = useDocumentStore()
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleDelete = (documentId: string, documentName: string) => {
    if (confirm(`Are you sure you want to delete "${documentName}"? This action cannot be undone.`)) {
      deleteDocument(documentId)
    }
  }

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedRows.length} document(s)? This action cannot be undone.`)) {
      selectedRows.forEach((id) => deleteDocument(id))
      setSelectedRows([])
    }
  }

  const columns: ColumnDef<Document>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/app/documents/${row.original.id}`} className="font-medium text-[#2563eb] hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variant = status === "ready" ? "default" : status === "processing" ? "secondary" : "destructive"
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        const size = row.getValue("size") as number
        return <span>{(size / 1024).toFixed(1)} KB</span>
      },
    },
    {
      accessorKey: "uploadedAt",
      header: "Uploaded",
      cell: ({ row }) => {
        const date = row.getValue("uploadedAt") as Date
        return <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[]
        return (
          <div className="flex gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/app/documents/${document.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => handleDelete(document.id, document.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">{selectedRows.length} document(s) selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={documents}
        onRowSelectionChange={(selection) => {
          const selectedIds = Object.keys(selection).filter((key) => selection[key])
          setSelectedRows(selectedIds)
        }}
      />
    </div>
  )
}
