"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import type { WorkflowNode, WorkflowConnection } from "./workflow-builder"
import { WorkflowNodeComponent } from "./workflow-node"

interface WorkflowCanvasProps {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  onNodesChange: (changes: any) => void
  onConnectionsChange: (changes: any) => void
  onConnect: (connection: any) => void
  onNodeSelect: (node: WorkflowNode | null) => void
  onNodeDelete: (nodeId: string) => void
}

interface ConnectionState {
  isConnecting: boolean
  startNode?: string
  startIsOutput?: boolean
}

export function WorkflowCanvas({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  onConnect,
  onNodeSelect,
  onNodeDelete,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>({ isConnecting: false })
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [snapTargetNodeId, setSnapTargetNodeId] = useState<string | null>(null)

  const handleConnectionStart = useCallback((nodeId: string, isOutput: boolean) => {
    setConnectionState({
      isConnecting: true,
      startNode: nodeId,
      startIsOutput: isOutput,
    })
    console.log(`[v0] Connection started from node ${nodeId} (${isOutput ? "output" : "input"})`)
  }, [])

  const handleConnectionEnd = useCallback(
    (nodeId: string, isOutput: boolean) => {
      if (connectionState.isConnecting && connectionState.startNode && connectionState.startNode !== nodeId) {
        const sourceNode = connectionState.startIsOutput ? connectionState.startNode : nodeId
        const targetNode = connectionState.startIsOutput ? nodeId : connectionState.startNode

        const existingConnection = connections.find((conn) => conn.source === sourceNode && conn.target === targetNode)

        if (!existingConnection) {
          const newConnection = {
            id: `connection-${Date.now()}`,
            source: sourceNode,
            target: targetNode,
          }

          onConnect(newConnection)
          console.log(`[v0] Connection created:`, newConnection)
        } else {
          alert("Connection already exists between these nodes!")
        }
      }

      setConnectionState({ isConnecting: false })
      setSnapTargetNodeId(null)
      setMousePos(null)
    },
    [connectionState, connections, onConnect],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      const nodeType = e.dataTransfer.getData("application/reactflow") as WorkflowNode["type"]
      if (!nodeType || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: getNodeLabel(nodeType),
          description: getNodeDescription(nodeType),
        },
      }

      onNodesChange([{ type: "add", item: newNode, byUser: true }])
      console.log(`[v0] Added new ${nodeType} node at`, position)
    },
    [onNodesChange],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleNodeDrag = useCallback(
    (nodeId: string, newPosition: { x: number; y: number }) => {
      onNodesChange([{ type: "position", nodeId, position: newPosition, byUser: true }])
    },
    [onNodesChange],
  )

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseMove={(e) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        setMousePos(pos)

        // Update snap target when connecting
        if (connectionState.isConnecting && connectionState.startNode) {
          const startIsOutput = !!connectionState.startIsOutput
          const threshold = 18 // px

          let closestId: string | null = null
          let closestDist = Infinity

          nodes.forEach((n) => {
            if (n.id === connectionState.startNode) return
            // Candidate port depends on direction
            const port = startIsOutput
              ? { x: n.position.x, y: n.position.y + 40 } // input port center
              : { x: n.position.x + 192, y: n.position.y + 40 } // output port center

            const dx = port.x - pos.x
            const dy = port.y - pos.y
            const d = Math.hypot(dx, dy)
            if (d < closestDist) {
              closestDist = d
              closestId = n.id
            }
          })

          if (closestId && closestDist <= threshold) {
            setSnapTargetNodeId(closestId)
          } else {
            setSnapTargetNodeId(null)
          }
        }
      }}
      onClick={() => {
        onNodeSelect(null)
        setConnectionState({ isConnecting: false })
        setSnapTargetNodeId(null)
        setMousePos(null)
      }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Connections */}
      <svg className="absolute inset-0 pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
          </marker>
        </defs>
        {connections.map((connection) => {
          const sourceNode = nodes.find((n) => n.id === connection.source)
          const targetNode = nodes.find((n) => n.id === connection.target)

          if (!sourceNode || !targetNode) return null

          const x1 = sourceNode.position.x + 192 // Node width
          const y1 = sourceNode.position.y + 40 // Node height / 2
          const x2 = targetNode.position.x
          const y2 = targetNode.position.y + 40

          return (
            <line
              key={connection.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#2563eb"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              style={{ pointerEvents: "auto", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation()
                onConnectionsChange?.([{ type: "delete", connectionId: connection.id }])
              }}
            />
          )
        })}

        {/* Ghost connection while connecting */}
        {connectionState.isConnecting && connectionState.startNode && mousePos && (() => {
          const startNode = nodes.find((n) => n.id === connectionState.startNode)
          if (!startNode) return null
          const startIsOutput = !!connectionState.startIsOutput
          const sx = startIsOutput ? startNode.position.x + 192 : startNode.position.x
          const sy = startNode.position.y + 40

          let ex = mousePos.x
          let ey = mousePos.y
          if (snapTargetNodeId) {
            const targetNode = nodes.find((n) => n.id === snapTargetNodeId)
            if (targetNode) {
              ex = startIsOutput ? targetNode.position.x : targetNode.position.x + 192
              ey = targetNode.position.y + 40
            }
          }

          return (
            <line
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              stroke="#60a5fa"
              strokeWidth="2"
              strokeDasharray="4 4"
              markerEnd="url(#arrowhead)"
            />
          )
        })()}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <WorkflowNodeComponent
          key={node.id}
          node={node}
          onSelect={() => onNodeSelect(node)}
          onDelete={() => onNodeDelete(node.id)}
          onDrag={handleNodeDrag}
          onConnectionStart={handleConnectionStart}
          onConnectionEnd={handleConnectionEnd}
          isConnecting={connectionState.isConnecting}
          connectionStartNode={connectionState.startNode}
          startIsOutput={connectionState.startIsOutput}
          snapTargetNodeId={snapTargetNodeId || undefined}
        />
      ))}

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
            <p className="text-sm">Drag nodes from the palette to get started</p>
            <p className="text-xs mt-2 opacity-75">Click output point → input point to connect nodes</p>
          </div>
        </div>
      )}

      {/* Connection Instructions */}
      {connectionState.isConnecting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50">
          Click on another node's input point to create a connection
        </div>
      )}
    </div>
  )
}

function getNodeLabel(type: WorkflowNode["type"]): string {
  switch (type) {
    case "trigger":
      return "Document Upload"
    case "action":
      return "Extract Text"
    case "condition":
      return "Check Document Type"
    case "output":
      return "Save to Database"
    default:
      return "Unknown Node"
  }
}

function getNodeDescription(type: WorkflowNode["type"]): string {
  switch (type) {
    case "trigger":
      return "Triggers when a new document is uploaded"
    case "action":
      return "Performs OCR to extract text from document"
    case "condition":
      return "Checks document type and routes accordingly"
    case "output":
      return "Saves extracted data to database"
    default:
      return "Node description"
  }
}
