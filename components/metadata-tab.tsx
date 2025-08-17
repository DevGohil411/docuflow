"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDocumentStore } from "@/stores/document-store"
import { Edit2, Save, X, Plus } from "lucide-react"

interface MetadataTabProps {
  documentId: string
}

export function MetadataTab({ documentId }: MetadataTabProps) {
  const { selectedDocument, updateDocument } = useDocumentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedMetadata, setEditedMetadata] = useState(selectedDocument?.metadata || {})
  const [newTag, setNewTag] = useState("")

  if (!selectedDocument) return null

  const handleSave = () => {
    updateDocument(documentId, { metadata: editedMetadata })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedMetadata(selectedDocument.metadata)
    setIsEditing(false)
  }

  const addTag = () => {
    if (newTag.trim() && !selectedDocument.tags.includes(newTag.trim())) {
      updateDocument(documentId, {
        tags: [...selectedDocument.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateDocument(documentId, {
      tags: selectedDocument.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Document Information</CardTitle>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <p className="text-sm font-medium">{selectedDocument.name}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Type</Label>
            <p className="text-sm">{selectedDocument.type.toUpperCase()}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Size</Label>
            <p className="text-sm">{(selectedDocument.size / 1024).toFixed(1)} KB</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Badge variant="outline" className="capitalize">
              {selectedDocument.status}
            </Badge>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Uploaded</Label>
            <p className="text-sm">{selectedDocument.uploadedAt.toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Custom Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(editedMetadata).map(([key, value]) => (
            <div key={key}>
              <Label className="text-xs text-muted-foreground capitalize">{key}</Label>
              {isEditing ? (
                <Input
                  value={String(value)}
                  onChange={(e) => setEditedMetadata((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm">{String(value)}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedDocument.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                <span>{tag}</span>
                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTag()}
            />
            <Button size="sm" onClick={addTag} disabled={!newTag.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
