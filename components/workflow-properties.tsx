"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Save, RotateCcw } from "lucide-react"
import type { WorkflowNode } from "./workflow-builder"

interface WorkflowPropertiesProps {
  node: WorkflowNode
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void
  onClose: () => void
}

export function WorkflowProperties({ node, onUpdateNode, onClose }: WorkflowPropertiesProps) {
  const [label, setLabel] = useState(node.data.label)
  const [description, setDescription] = useState(node.data.description || "")
  const [nodeConfig, setNodeConfig] = useState(node.data.config || {})

  const handleSave = () => {
    if (!label.trim()) {
      alert("Node label cannot be empty")
      return
    }

    onUpdateNode(node.id, {
      data: {
        ...node.data,
        label: label.trim(),
        description: description.trim(),
        config: nodeConfig,
      },
    })

    alert(`Node "${label}" updated successfully!`)
  }

  const handleReset = () => {
    if (confirm("Reset all changes to original values?")) {
      setLabel(node.data.label)
      setDescription(node.data.description || "")
      setNodeConfig(node.data.config || {})
    }
  }

  const updateConfig = (key: string, value: any) => {
    setNodeConfig((prev) => ({ ...prev, [key]: value }))
  }

  const renderNodeSpecificProperties = () => {
    switch (node.type) {
      case "trigger":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={nodeConfig.triggerType || "upload"}
                onValueChange={(value) => updateConfig("triggerType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">Document Upload</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="email">Email Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-types">Allowed File Types</Label>
              <Input
                id="file-types"
                placeholder="pdf, docx, txt"
                value={nodeConfig.fileTypes || "pdf, docx"}
                onChange={(e) => updateConfig("fileTypes", e.target.value)}
              />
            </div>
            {nodeConfig.triggerType === "schedule" && (
              <div>
                <Label htmlFor="schedule">Schedule (Cron)</Label>
                <Input
                  id="schedule"
                  placeholder="0 9 * * 1-5"
                  value={nodeConfig.schedule || ""}
                  onChange={(e) => updateConfig("schedule", e.target.value)}
                />
              </div>
            )}
          </div>
        )

      case "action":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <Select
                value={nodeConfig.actionType || "ocr"}
                onValueChange={(value) => updateConfig("actionType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ocr">OCR Extract</SelectItem>
                  <SelectItem value="email">Send Email</SelectItem>
                  <SelectItem value="approve">Request Approval</SelectItem>
                  <SelectItem value="transform">Transform Data</SelectItem>
                  <SelectItem value="api">API Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-retry"
                checked={nodeConfig.autoRetry || false}
                onCheckedChange={(checked) => updateConfig("autoRetry", checked)}
              />
              <Label htmlFor="auto-retry">Auto Retry on Failure</Label>
            </div>
            {nodeConfig.autoRetry && (
              <div>
                <Label htmlFor="retry-count">Max Retries</Label>
                <Input
                  id="retry-count"
                  type="number"
                  min="1"
                  max="5"
                  value={nodeConfig.maxRetries || 3}
                  onChange={(e) => updateConfig("maxRetries", Number.parseInt(e.target.value))}
                />
              </div>
            )}
            {nodeConfig.actionType === "email" && (
              <div>
                <Label htmlFor="email-template">Email Template</Label>
                <Textarea
                  id="email-template"
                  placeholder="Enter email template..."
                  value={nodeConfig.emailTemplate || ""}
                  onChange={(e) => updateConfig("emailTemplate", e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        )

      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition-field">Field to Check</Label>
              <Select
                value={nodeConfig.field || "document_type"}
                onValueChange={(value) => updateConfig("field", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document_type">Document Type</SelectItem>
                  <SelectItem value="file_size">File Size</SelectItem>
                  <SelectItem value="confidence">OCR Confidence</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition-operator">Operator</Label>
              <Select
                value={nodeConfig.operator || "equals"}
                onValueChange={(value) => updateConfig("operator", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition-value">Value</Label>
              <Input
                id="condition-value"
                placeholder="Enter value..."
                value={nodeConfig.value || ""}
                onChange={(e) => updateConfig("value", e.target.value)}
              />
            </div>
          </div>
        )

      case "output":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="output-type">Output Type</Label>
              <Select
                value={nodeConfig.outputType || "database"}
                onValueChange={(value) => updateConfig("outputType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Save to Database</SelectItem>
                  <SelectItem value="file">Export to File</SelectItem>
                  <SelectItem value="api">Send to API</SelectItem>
                  <SelectItem value="email">Email Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="output-format">Format</Label>
              <Select value={nodeConfig.format || "json"} onValueChange={(value) => updateConfig("format", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {nodeConfig.outputType === "api" && (
              <div>
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  placeholder="https://api.example.com/webhook"
                  value={nodeConfig.apiEndpoint || ""}
                  onChange={(e) => updateConfig("apiEndpoint", e.target.value)}
                />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Node Properties</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Properties */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-label">Label *</Label>
              <Input
                id="node-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Node label..."
              />
            </div>
            <div>
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Node description..."
                rows={3}
              />
            </div>
          </div>

          {/* Node-specific Properties */}
          {renderNodeSpecificProperties()}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
