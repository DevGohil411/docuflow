"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, Download, Search, Filter, Eye, Edit, Trash2, Upload, UserPlus } from "lucide-react"

const auditLogs: any[] = []

const actionIcons = {
  document_view: Eye,
  document_edit: Edit,
  document_delete: Trash2,
  document_upload: Upload,
  user_create: UserPlus,
  login_failed: Shield,
}

export function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity
    const matchesAction = selectedAction === "all" || log.action === selectedAction

    return matchesSearch && matchesSeverity && matchesAction
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "destructive"
      case "warning":
        return "default"
      case "info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground">View detailed audit logs and security events</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="document_view">Document View</SelectItem>
                <SelectItem value="document_edit">Document Edit</SelectItem>
                <SelectItem value="document_delete">Document Delete</SelectItem>
                <SelectItem value="user_create">User Create</SelectItem>
                <SelectItem value="login_failed">Login Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="24h">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {auditLogs.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No audit logs yet</h3>
                <p className="text-muted-foreground">Audit logs will appear here as users interact with the system.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const ActionIcon = actionIcons[log.action as keyof typeof actionIcons] || Shield
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <ActionIcon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getSeverityColor(log.severity) as any}>{log.severity}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {log.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{log.user}</span>
                        <span className="text-muted-foreground">performed</span>
                        <Badge variant="outline">{log.action.replace("_", " ")}</Badge>
                        <span className="text-muted-foreground">on</span>
                        <span className="font-medium">{log.resource}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>IP: {log.ip}</span>
                        <span>ID: {log.id}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
