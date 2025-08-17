"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { HighlighterIcon as Highlight, MessageSquare, Stamp, Square } from "lucide-react"

interface AnnotationsTabProps {
  documentId: string
}

const mockAnnotations = [
  {
    id: "1",
    type: "highlight" as const,
    content: "Important clause regarding payment terms",
    page: 1,
    createdBy: "John Doe",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    type: "comment" as const,
    content: "This section needs legal review before approval",
    page: 2,
    createdBy: "Sarah Johnson",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
]

export function AnnotationsTab({ documentId }: AnnotationsTabProps) {
  const [newComment, setNewComment] = useState("")
  const [selectedTool, setSelectedTool] = useState<"highlight" | "comment" | "stamp" | "redaction" | null>(null)

  const annotationIcons = {
    highlight: Highlight,
    comment: MessageSquare,
    stamp: Stamp,
    redaction: Square,
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Annotation Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {(["highlight", "comment", "stamp", "redaction"] as const).map((tool) => {
            const Icon = annotationIcons[tool]
            return (
              <Button
                key={tool}
                variant={selectedTool === tool ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool(selectedTool === tool ? null : tool)}
                className="justify-start"
              >
                <Icon className="mr-2 h-4 w-4" />
                {tool.charAt(0).toUpperCase() + tool.slice(1)}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Add Comment</h3>
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button size="sm" className="w-full" disabled={!newComment.trim()}>
            Add Comment
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Annotations ({mockAnnotations.length})</h3>
        <div className="space-y-3">
          {mockAnnotations.map((annotation) => {
            const Icon = annotationIcons[annotation.type]
            return (
              <Card key={annotation.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <Badge variant="outline" className="capitalize">
                        {annotation.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Page {annotation.page}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm mb-2">{annotation.content}</p>
                  <div className="text-xs text-muted-foreground">
                    {annotation.createdBy} • {annotation.createdAt.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
