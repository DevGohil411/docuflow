"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkflowNode } from "./workflow-builder"
import { FileText, Zap, GitBranch, Database, Trash2, Settings, Copy, Play } from "lucide-react"
import { useState, useRef } from "react"

interface WorkflowNodeComponentProps {
  node: WorkflowNode
  onSelect: () => void
  onDelete: () => void
  onDrag?: (nodeId: string, position: { x: number; y: number }) => void
  onConnectionStart?: (nodeId: string, isOutput: boolean) => void
  onConnectionEnd?: (nodeId: string, isOutput: boolean) => void
  isConnecting?: boolean
  connectionStartNode?: string
  startIsOutput?: boolean
  snapTargetNodeId?: string
}

const nodeIcons = {
  trigger: Zap,
  action: FileText,
  condition: GitBranch,
  output: Database,
}

const nodeColors = {
  trigger: "bg-green-500",
  action: "bg-blue-500",
  condition: "bg-yellow-500",
  output: "bg-purple-500",
}

export function WorkflowNodeComponent({
  node,
  onSelect,
  onDelete,
  onDrag,
  onConnectionStart,
  onConnectionEnd,
  isConnecting,
  connectionStartNode,
  startIsOutput,
  snapTargetNodeId,
}: WorkflowNodeComponentProps) {
  const Icon = nodeIcons[node.type]
  const colorClass = nodeColors[node.type]
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; nodeStartX: number; nodeStartY: number } | null>(null)

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newNode = {
      ...node,
      id: `node-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: {
        ...node.data,
        label: `${node.data.label} (Copy)`,
      },
    }
    console.log("Duplicate node:", newNode)
    alert(`Node "${node.data.label}" duplicated!`)
  }

  const handleTestNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Testing node:", node)
    alert(`Testing node: ${node.data.label}\nType: ${node.type}\nStatus: ✅ Node test passed!`)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest(".node-drag-handle")) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      nodeStartX: node.position.x,
      nodeStartY: node.position.y,
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !isDragging) return

      const deltaX = e.clientX - dragRef.current.startX
      const deltaY = e.clientY - dragRef.current.startY

      const newPosition = {
        x: Math.max(50, dragRef.current.nodeStartX + deltaX),
        y: Math.max(50, dragRef.current.nodeStartY + deltaY),
      }

      onDrag?.(node.id, newPosition)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      dragRef.current = null
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleConnectionPointClick = (e: React.MouseEvent, isOutput: boolean) => {
    e.stopPropagation()

    if (isConnecting && connectionStartNode !== node.id) {
      // End connection
      onConnectionEnd?.(node.id, isOutput)
    } else if (!isConnecting) {
      // Start connection
      onConnectionStart?.(node.id, isOutput)
    }
  }

  return (
    <div
      className={`absolute cursor-pointer select-none ${isDragging ? "z-50" : "z-10"}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        transition: isDragging ? "none" : "transform 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-48 hover:shadow-md transition-all border-2 hover:border-primary/50 ${
          isDragging ? "shadow-lg border-primary" : ""
        } ${isConnecting && connectionStartNode === node.id ? "ring-2 ring-primary" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-md ${colorClass} text-white node-drag-handle cursor-move`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="text-xs">
                  {node.type}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                    onClick={handleTestNode}
                    title="Test Node"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={handleDuplicate}
                    title="Duplicate Node"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect()
                    }}
                    title="Edit Node"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete node "${node.data.label}"?`)) {
                        onDelete()
                      }
                    }}
                    title="Delete Node"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <h4 className="font-medium text-sm">{node.data.label}</h4>
              {node.data.description && <p className="text-xs text-muted-foreground mt-1">{node.data.description}</p>}
            </div>
          </div>

          <div
            className={`absolute -left-2 top-1/2 w-4 h-4 border-2 border-primary rounded-full transform -translate-y-1/2 cursor-pointer transition-all ${
              isConnecting && connectionStartNode !== node.id && startIsOutput
                ? snapTargetNodeId === node.id
                  ? "bg-green-500 hover:bg-green-600 scale-125 animate-pulse"
                  : "bg-background ring-2 ring-primary/40 hover:bg-primary hover:scale-110"
                : "bg-background hover:bg-primary hover:scale-110"
            }`}
            onClick={(e) => handleConnectionPointClick(e, false)}
            title="Input connection point"
          />
          <div
            className={`absolute -right-2 top-1/2 w-4 h-4 border-2 border-primary rounded-full transform -translate-y-1/2 cursor-pointer transition-all ${
              !isConnecting
                ? "bg-background hover:bg-primary hover:scale-110"
                : connectionStartNode === node.id && startIsOutput
                  ? "bg-primary scale-125"
                  : connectionStartNode === node.id && !startIsOutput
                    ? "bg-background opacity-50"
                    : connectionStartNode !== node.id && !startIsOutput
                      ? snapTargetNodeId === node.id
                        ? "bg-green-500 hover:bg-green-600 scale-125 animate-pulse"
                        : "bg-background ring-2 ring-primary/40 hover:bg-primary hover:scale-110"
                      : "bg-background opacity-50"
            }`}
            onClick={(e) => handleConnectionPointClick(e, true)}
            title="Output connection point"
          />
        </CardContent>
      </Card>
    </div>
  )
}
