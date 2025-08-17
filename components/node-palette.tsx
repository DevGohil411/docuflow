"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, GitBranch, Database, Mail, Webhook, FileCheck, UserCheck, Clock, Filter } from "lucide-react"
import type { WorkflowNode } from "./workflow-builder"

interface NodePaletteProps {
  onAddNode: (type: WorkflowNode["type"], position: { x: number; y: number }) => void
}

const nodeTypes = [
  {
    category: "Triggers",
    nodes: [
      {
        type: "trigger" as const,
        label: "Document Upload",
        description: "Triggers when document is uploaded",
        icon: FileText,
        color: "bg-green-500",
      },
      {
        type: "trigger" as const,
        label: "Webhook",
        description: "Triggers from external webhook",
        icon: Webhook,
        color: "bg-green-500",
      },
      {
        type: "trigger" as const,
        label: "Schedule",
        description: "Triggers on schedule",
        icon: Clock,
        color: "bg-green-500",
      },
    ],
  },
  {
    category: "Actions",
    nodes: [
      {
        type: "action" as const,
        label: "OCR Extract",
        description: "Extract text from document",
        icon: FileCheck,
        color: "bg-blue-500",
      },
      {
        type: "action" as const,
        label: "Send Email",
        description: "Send notification email",
        icon: Mail,
        color: "bg-blue-500",
      },
      {
        type: "action" as const,
        label: "Approve",
        description: "Request approval",
        icon: UserCheck,
        color: "bg-blue-500",
      },
    ],
  },
  {
    category: "Conditions",
    nodes: [
      {
        type: "condition" as const,
        label: "Document Type",
        description: "Check document type",
        icon: Filter,
        color: "bg-yellow-500",
      },
      {
        type: "condition" as const,
        label: "Branch",
        description: "Split workflow path",
        icon: GitBranch,
        color: "bg-yellow-500",
      },
    ],
  },
  {
    category: "Outputs",
    nodes: [
      {
        type: "output" as const,
        label: "Save to Database",
        description: "Store extracted data",
        icon: Database,
        color: "bg-purple-500",
      },
      {
        type: "output" as const,
        label: "Generate Report",
        description: "Create summary report",
        icon: FileText,
        color: "bg-purple-500",
      },
    ],
  },
]

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const handleDragStart = (e: React.DragEvent, nodeType: WorkflowNode["type"]) => {
    e.dataTransfer.setData("application/reactflow", nodeType)
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">WORKFLOW NODES</h3>
        <p className="text-xs text-muted-foreground mb-4">Drag nodes to the canvas to build your workflow</p>
      </div>

      {nodeTypes.map((category) => (
        <div key={category.category} className="space-y-2">
          <h4 className="font-medium text-sm">{category.category}</h4>
          <div className="space-y-2">
            {category.nodes.map((node, index) => {
              const Icon = node.icon
              return (
                <Card
                  key={`${category.category}-${index}`}
                  className="cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.type)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ${node.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm">{node.label}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
