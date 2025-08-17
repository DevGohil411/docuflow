"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Play, ArrowLeft, Settings, Download, Upload, Trash2 } from "lucide-react"
import Link from "next/link"
import { WorkflowCanvas } from "./workflow-canvas"
import { NodePalette } from "./node-palette"
import { WorkflowProperties } from "./workflow-properties"
import { useSearchParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useCurrentUser } from "@/hooks/use-current-user"

export interface WorkflowNode {
  id: string
  type: "trigger" | "action" | "condition" | "output"
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config?: Record<string, any>
  }
}

export interface WorkflowConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

const workflowTemplates = {
  "template-1": {
    name: "Basic OCR Workflow",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        position: { x: 100, y: 100 },
        data: { label: "Document Upload", description: "Triggers when document is uploaded" },
      },
      {
        id: "node-2",
        type: "action" as const,
        position: { x: 300, y: 100 },
        data: { label: "OCR Extract", description: "Extract text from document" },
      },
      {
        id: "node-3",
        type: "output" as const,
        position: { x: 500, y: 100 },
        data: { label: "Save to Database", description: "Store extracted data" },
      },
    ],
    connections: [
      { id: "conn-1", source: "node-1", target: "node-2" },
      { id: "conn-2", source: "node-2", target: "node-3" },
    ],
  },
  "template-2": {
    name: "Approval Workflow",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        position: { x: 100, y: 100 },
        data: { label: "Document Upload", description: "Triggers when document is uploaded" },
      },
      {
        id: "node-2",
        type: "action" as const,
        position: { x: 300, y: 100 },
        data: { label: "OCR Extract", description: "Extract text from document" },
      },
      {
        id: "node-3",
        type: "condition" as const,
        position: { x: 500, y: 100 },
        data: { label: "Check Amount", description: "Check if amount > $1000" },
      },
      {
        id: "node-4",
        type: "action" as const,
        position: { x: 700, y: 50 },
        data: { label: "Request Approval", description: "Send for manager approval" },
      },
      {
        id: "node-5",
        type: "action" as const,
        position: { x: 700, y: 150 },
        data: { label: "Auto Approve", description: "Automatically approve" },
      },
      {
        id: "node-6",
        type: "output" as const,
        position: { x: 900, y: 100 },
        data: { label: "Save to Database", description: "Store processed data" },
      },
    ],
    connections: [
      { id: "conn-1", source: "node-1", target: "node-2" },
      { id: "conn-2", source: "node-2", target: "node-3" },
      { id: "conn-3", source: "node-3", target: "node-4" },
      { id: "conn-4", source: "node-3", target: "node-5" },
      { id: "conn-5", source: "node-4", target: "node-6" },
      { id: "conn-6", source: "node-5", target: "node-6" },
    ],
  },
  "template-3": {
    name: "Data Extraction",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        position: { x: 100, y: 100 },
        data: { label: "Document Upload", description: "Triggers when document is uploaded" },
      },
      {
        id: "node-2",
        type: "action" as const,
        position: { x: 300, y: 100 },
        data: { label: "OCR Extract", description: "Extract text from document" },
      },
      {
        id: "node-3",
        type: "action" as const,
        position: { x: 500, y: 100 },
        data: { label: "Extract Fields", description: "Extract specific data fields" },
      },
      {
        id: "node-4",
        type: "output" as const,
        position: { x: 700, y: 100 },
        data: { label: "Generate Report", description: "Create summary report" },
      },
    ],
    connections: [
      { id: "conn-1", source: "node-1", target: "node-2" },
      { id: "conn-2", source: "node-2", target: "node-3" },
      { id: "conn-3", source: "node-3", target: "node-4" },
    ],
  },
}

export function WorkflowBuilder() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const workflowIdParam = searchParams.get("workflow")
  const router = useRouter()
  const { data: user } = useCurrentUser()

  const [workflowName, setWorkflowName] = useState("Untitled Workflow")
  const [workflowId, setWorkflowId] = useState<string | null>(null)
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [workflowSettings, setWorkflowSettings] = useState({
    description: "",
    autoSave: true,
    notifications: true,
    retryOnFailure: false,
    maxRetries: 3,
    // Builder options
    allowSelfEdges: false,
    allowCycles: false,
    maxNodes: 50,
  })
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState(false)

  useEffect(() => {
    // Load by workflow id if provided
    if (workflowIdParam) {
      try {
        const saved = JSON.parse(localStorage.getItem("docuflow-workflows") || "[]")
        const exist = Array.isArray(saved) ? saved.find((w: any) => w.id === workflowIdParam) : null
        if (exist) {
          if (exist.ownerId && user?.id && exist.ownerId !== user.id) {
            alert("You don't have access to this workflow.")
            router.replace("/app/workflows")
            return
          }
          setWorkflowId(exist.id)
          setWorkflowName(exist.name || "Untitled Workflow")
          setNodes(exist.nodes || [])
          setConnections(exist.connections || [])
          setWorkflowSettings((prev) => ({ ...prev, ...(exist.settings || {}) }))
          return
        }
      } catch {}
    }

    // Else load template if provided
    if (templateId && workflowTemplates[templateId as keyof typeof workflowTemplates]) {
      const template = workflowTemplates[templateId as keyof typeof workflowTemplates]
      setWorkflowName(template.name)
      setNodes(template.nodes)
      setConnections(template.connections)
    }
  }, [templateId, workflowIdParam, user?.id, router])

  const onNodesChange = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        if (change.type === "add") {
          setNodes((prev) => {
            const nextCount = prev.length + 1
            if (nextCount > (workflowSettings.maxNodes ?? 50)) {
              alert(`Max nodes limit (${workflowSettings.maxNodes}) reached. Cannot add more nodes.`)
              return prev
            }
            const next = [...prev, change.item]
            return next
          })
        } else if (change.type === "position") {
          if (change.byUser) {
            // manual drag disables auto-layout until re-applied
            setAutoLayoutEnabled(false)
          }
          setNodes((prev) =>
            prev.map((node) => (node.id === change.nodeId ? { ...node, position: change.position } : node)),
          )
        }
      })
    },
    [workflowSettings.maxNodes],
  )

  const onConnectionsChange = useCallback((changes: any) => {
    // Support edge deletion from canvas
    changes.forEach((change: any) => {
      if (change.type === "delete" && change.connectionId) {
        setConnections((prev) => prev.filter((c) => c.id !== change.connectionId))
      }
      if (change.type === "clear_all") {
        setConnections([])
      }
    })
  }, [])

  const onConnect = useCallback(
    (connection: any) => {
      const source = connection.source
      const target = connection.target

      // Validate existence
      const sourceExists = nodes.some((n) => n.id === source)
      const targetExists = nodes.some((n) => n.id === target)
      if (!sourceExists || !targetExists) {
        alert("Invalid connection: source or target node does not exist.")
        return
      }
      // Validate self-edge
      if (source === target && !workflowSettings.allowSelfEdges) {
        alert("Invalid connection: self-connections are not allowed.")
        return
      }
      // Validate duplicate
      if (connections.some((c) => c.source === source && c.target === target)) {
        alert("Connection already exists between these nodes!")
        return
      }
      // Validate cycle if not allowed
      if (!workflowSettings.allowCycles) {
        const wouldCycle = checkCycleWithEdge(nodes, connections, { source, target })
        if (wouldCycle) {
          alert("Invalid connection: cycles are not allowed.")
          return
        }
      }

      const newConnection: WorkflowConnection = {
        id: `connection-${Date.now()}`,
        source,
        target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      }
      setConnections((prev) => [...prev, newConnection])
    },
    [nodes, connections, workflowSettings.allowSelfEdges, workflowSettings.allowCycles],
  )

  const addNode = useCallback((nodeType: WorkflowNode["type"], position: { x: number; y: number }) => {
    setNodes((prev) => {
      if (prev.length + 1 > (workflowSettings.maxNodes ?? 50)) {
        alert(`Max nodes limit (${workflowSettings.maxNodes}) reached. Cannot add more nodes.`)
        return prev
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
      return [...prev, newNode]
    })
  }, [workflowSettings.maxNodes])

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)))
  }, [])

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId))
      setConnections((prev) => prev.filter((conn) => conn.source !== nodeId && conn.target !== nodeId))
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null)
      }
    },
    [selectedNode],
  )

  // Auto-Layout application
  useEffect(() => {
    if (!autoLayoutEnabled) return
    const laidOut = applyAutoLayout(nodes, connections)
    // Only set if positions actually changed to avoid loops
    const changed = nodes.some((n) => {
      const ln: WorkflowNode | undefined = laidOut.find((x: WorkflowNode) => x.id === n.id)
      return !ln || ln.position.x !== n.position.x || ln.position.y !== n.position.y
    })
    if (changed) {
      setNodes(laidOut)
    }
  }, [autoLayoutEnabled, connections, nodes])

  const saveWorkflow = useCallback(() => {
    const now = new Date().toISOString()
    const nextId = workflowId || `wf-${Date.now()}`
    const workflow = {
      id: nextId,
      name: workflowName,
      nodes,
      connections,
      settings: workflowSettings,
      status: "draft" as const,
      createdAt: now,
      updatedAt: now,
      ownerId: user?.id,
    }

    try {
      const savedWorkflows = JSON.parse(localStorage.getItem("docuflow-workflows") || "[]")
      const list = Array.isArray(savedWorkflows) ? savedWorkflows : []
      const existingIndex = list.findIndex((w: any) => (workflowId ? w.id === workflowId : w.name === workflowName))

      if (existingIndex >= 0) {
        // Preserve createdAt/status if present
        const prev = list[existingIndex]
        list[existingIndex] = {
          ...prev,
          ...workflow,
          createdAt: prev?.createdAt || workflow.createdAt,
          status: prev?.status || workflow.status,
          updatedAt: now,
          ownerId: prev?.ownerId || user?.id,
        }
      } else {
        list.push(workflow)
      }

      localStorage.setItem("docuflow-workflows", JSON.stringify(list))
      setWorkflowId(nextId)
      alert(`Workflow "${workflowName}" saved successfully!`)
    } catch (error) {
      alert("Error saving workflow. Please try again.")
    }
  }, [workflowId, workflowName, nodes, connections, workflowSettings, user?.id])

  const runWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      alert("Please add some nodes to test the workflow")
      return
    }

    const triggerNodes = nodes.filter((n) => n.type === "trigger")
    if (triggerNodes.length === 0) {
      alert("Workflow needs at least one trigger node to run")
      return
    }

    const outputNodes = nodes.filter((n) => n.type === "output")
    if (outputNodes.length === 0) {
      alert("Workflow needs at least one output node to complete")
      return
    }

    alert(
      `Test run started for "${workflowName}"!\n\nNodes: ${nodes.length}\nConnections: ${connections.length}\n\nCheck the console for detailed execution logs.`,
    )

    console.log("[v0] === Workflow Test Run ===")
    console.log("[v0] Workflow:", workflowName)
    console.log("[v0] Nodes:", nodes)
    console.log("[v0] Connections:", connections)
    console.log("[v0] Settings:", workflowSettings)
  }, [workflowName, nodes, connections, workflowSettings])

  const exportWorkflow = useCallback(() => {
    const workflow = {
      name: workflowName,
      nodes,
      connections,
      settings: workflowSettings,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(workflow, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${workflowName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert("Workflow exported successfully!")
  }, [workflowName, nodes, connections, workflowSettings])

  const importWorkflow = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target?.result as string)
          setWorkflowId(workflow.id || null)
          setWorkflowName(workflow.name || "Imported Workflow")
          setNodes(workflow.nodes || [])
          setConnections(workflow.connections || [])
          setWorkflowSettings(workflow.settings || workflowSettings)
          alert("Workflow imported successfully!")
        } catch (error) {
          alert("Error importing workflow. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [workflowSettings])

  const clearWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      alert("Workflow is already empty")
      return
    }

    if (confirm("Are you sure you want to clear the entire workflow? This action cannot be undone.")) {
      setNodes([])
      setConnections([])
      setSelectedNode(null)
      setWorkflowName("Untitled Workflow")
      setWorkflowId(null)
      alert("Workflow cleared successfully!")
    }
  }, [nodes.length])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          <Link href="/app/workflows">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="max-w-md border-none bg-transparent text-lg font-semibold focus-visible:ring-0"
              placeholder="Workflow name..."
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 pr-2 border-r">
              <Label htmlFor="auto-layout" className="text-xs">Auto Layout</Label>
              <Switch
                id="auto-layout"
                checked={!!autoLayoutEnabled}
                onCheckedChange={(checked) => setAutoLayoutEnabled(checked)}
              />
            </div>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Workflow Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={workflowSettings.description}
                      onChange={(e) => setWorkflowSettings((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this workflow does..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <Switch
                      id="auto-save"
                      checked={workflowSettings.autoSave}
                      onCheckedChange={(checked) => setWorkflowSettings((prev) => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={workflowSettings.notifications}
                      onCheckedChange={(checked) =>
                        setWorkflowSettings((prev) => ({ ...prev, notifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="retry">Retry on Failure</Label>
                    <Switch
                      id="retry"
                      checked={workflowSettings.retryOnFailure}
                      onCheckedChange={(checked) =>
                        setWorkflowSettings((prev) => ({ ...prev, retryOnFailure: checked }))
                      }
                    />
                  </div>
                  {workflowSettings.retryOnFailure && (
                    <div>
                      <Label htmlFor="max-retries">Max Retries</Label>
                      <Input
                        id="max-retries"
                        type="number"
                        min="1"
                        max="10"
                        value={workflowSettings.maxRetries}
                        onChange={(e) =>
                          setWorkflowSettings((prev) => ({
                            ...prev,
                            maxRetries: Number.parseInt(e.target.value) || 3,
                          }))
                        }
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-self-edges">Allow Self Edges</Label>
                    <Switch
                      id="allow-self-edges"
                      checked={workflowSettings.allowSelfEdges}
                      onCheckedChange={(checked) =>
                        setWorkflowSettings((prev) => ({ ...prev, allowSelfEdges: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-cycles">Allow Cycles</Label>
                    <Switch
                      id="allow-cycles"
                      checked={workflowSettings.allowCycles}
                      onCheckedChange={(checked) =>
                        setWorkflowSettings((prev) => ({ ...prev, allowCycles: checked }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-nodes">Max Nodes</Label>
                    <Input
                      id="max-nodes"
                      type="number"
                      min="1"
                      max="500"
                      value={workflowSettings.maxNodes}
                      onChange={(e) =>
                        setWorkflowSettings((prev) => ({ ...prev, maxNodes: Number.parseInt(e.target.value) || 50 }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setShowSettings(false)} className="flex-1">
                      Save Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={importWorkflow}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={exportWorkflow}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearWorkflow}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={runWorkflow}>
              <Play className="h-4 w-4 mr-2" />
              Test Run
            </Button>
            <Button size="sm" onClick={saveWorkflow}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-64 border-r bg-muted/50">
          <NodePalette onAddNode={addNode} />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            nodes={nodes}
            connections={connections}
            onNodesChange={onNodesChange}
            onConnectionsChange={onConnectionsChange}
            onConnect={onConnect}
            onNodeSelect={setSelectedNode}
            onNodeDelete={deleteNode}
          />
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 border-l bg-muted/50">
            <WorkflowProperties node={selectedNode} onUpdateNode={updateNode} onClose={() => setSelectedNode(null)} />
          </div>
        )}
      </div>
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

// Detect if adding edge {source -> target} introduces a cycle
function checkCycleWithEdge(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  edge: { source: string; target: string },
): boolean {
  const { source, target } = edge
  if (source === target) return true

  const adj = new Map<string, string[]>()
  nodes.forEach((n) => adj.set(n.id, []))
  connections.forEach((c) => {
    const list = adj.get(c.source)
    if (list) list.push(c.target)
  })
  // include the potential new edge
  const list = adj.get(source)
  if (list) list.push(target)

  // check if there's a path from target back to source
  const visited = new Set<string>()
  const stack: string[] = [target]
  while (stack.length) {
    const cur = stack.pop() as string
    if (cur === source) return true
    if (visited.has(cur)) continue
    visited.add(cur)
    const neighbors = adj.get(cur) || []
    neighbors.forEach((n) => {
      if (!visited.has(n)) stack.push(n)
    })
  }
  return false
}

// Simple hierarchical auto-layout (left-to-right) using Kahn's algorithm for layering
function applyAutoLayout(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
): WorkflowNode[] {
  if (nodes.length === 0) return nodes

  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]))
  const indegree = new Map<string, number>()
  const adj = new Map<string, string[]>()
  nodes.forEach((n) => {
    indegree.set(n.id, 0)
    adj.set(n.id, [])
  })
  connections.forEach((c) => {
    if (!indegree.has(c.target)) indegree.set(c.target, 0)
    indegree.set(c.target, (indegree.get(c.target) || 0) + 1)
    const list = adj.get(c.source)
    if (list) list.push(c.target)
  })

  // Initialize queue with in-degree 0 nodes; prefer triggers first
  const queue: string[] = []
  const level = new Map<string, number>()
  nodes
    .sort((a, b) => {
      // triggers first, then others by existing x
      const ta = a.type === "trigger" ? 0 : 1
      const tb = b.type === "trigger" ? 0 : 1
      return ta - tb || a.position.x - b.position.x
    })
    .forEach((n) => {
      if ((indegree.get(n.id) || 0) === 0) {
        queue.push(n.id)
        level.set(n.id, 0)
      }
    })

  // If everything has indegree > 0 (cycle), seed arbitrary starts
  if (queue.length === 0) {
    nodes.forEach((n) => {
      if (!level.has(n.id)) {
        queue.push(n.id)
        level.set(n.id, 0)
      }
    })
  }

  while (queue.length) {
    const u = queue.shift() as string
    const lu = level.get(u) || 0
    const neighbors = adj.get(u) || []
    neighbors.forEach((v) => {
      const nextLevel = Math.max(lu + 1, level.get(v) ?? 0)
      level.set(v, nextLevel)
      if (indegree.has(v)) {
        indegree.set(v, (indegree.get(v) || 0) - 1)
        if ((indegree.get(v) || 0) === 0) queue.push(v)
      }
    })
  }

  // Group by level and assign positions
  const layers = new Map<number, WorkflowNode[]>()
  const layerKeys: number[] = []
  nodes.forEach((n) => {
    const lv = level.get(n.id) ?? 0
    if (!layers.has(lv)) {
      layers.set(lv, [])
      layerKeys.push(lv)
    }
    layers.get(lv)!.push(nodeMap.get(n.id) as WorkflowNode)
  })

  layerKeys.sort((a, b) => a - b)

  const X_SPACING = 240
  const Y_SPACING = 120
  const NODE_WIDTH = 192
  const START_X = 100
  const START_Y = 80

  layerKeys.forEach((lv) => {
    const list = layers.get(lv) as WorkflowNode[]
    // Sort to stabilize positions
    list.sort((a, b) => a.position.y - b.position.y)
    const x = START_X + lv * (NODE_WIDTH + X_SPACING)
    list.forEach((node, idx) => {
      const y = START_Y + idx * Y_SPACING
      node.position = { x, y }
    })
  })

  return Array.from(nodeMap.values())
}
