"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface VersionsTabProps {
  documentId: string
}

const mockVersions = [
  {
    id: "v3",
    version: 3,
    createdAt: new Date(),
    createdBy: "John Doe",
    changes: "Updated contract terms and conditions",
    isCurrent: true,
  },
  {
    id: "v2",
    version: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    createdBy: "Sarah Johnson",
    changes: "Added signature fields and legal review comments",
    isCurrent: false,
  },
  {
    id: "v1",
    version: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    createdBy: "Michael Chen",
    changes: "Initial document upload",
    isCurrent: false,
  },
]

export function VersionsTab({ documentId }: VersionsTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Version History</h3>
        <p className="text-sm text-muted-foreground mb-4">Track all changes and versions of this document</p>
      </div>

      <div className="space-y-3">
        {mockVersions.map((version) => (
          <Card key={version.id} className={version.isCurrent ? "border-[#2563eb]" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-sm">Version {version.version}</CardTitle>
                  {version.isCurrent && (
                    <Badge variant="default" className="bg-[#2563eb]">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm mb-2">{version.changes}</p>
              <div className="text-xs text-muted-foreground">
                {version.createdBy} • {formatDistanceToNow(version.createdAt, { addSuffix: true })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
