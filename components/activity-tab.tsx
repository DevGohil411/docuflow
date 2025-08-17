"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface ActivityTabProps {
  documentId: string
}

const mockActivity = [
  {
    id: "1",
    action: "Document viewed",
    user: { name: "John Doe", initials: "JD" },
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    details: "Opened document for review",
  },
  {
    id: "2",
    action: "Comment added",
    user: { name: "Sarah Johnson", initials: "SJ" },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    details: "Added comment on page 2",
  },
  {
    id: "3",
    action: "Metadata updated",
    user: { name: "Michael Chen", initials: "MC" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    details: "Updated invoice number and amount",
  },
  {
    id: "4",
    action: "Document uploaded",
    user: { name: "Emily Rodriguez", initials: "ER" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    details: "Initial document upload",
  },
]

export function ActivityTab({ documentId }: ActivityTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Activity Log</h3>
        <p className="text-sm text-muted-foreground mb-4">Complete audit trail of all document activities</p>
      </div>

      <div className="space-y-3">
        {mockActivity.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activity.details}</p>
                  <div className="text-xs text-muted-foreground">
                    {activity.user.name} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
