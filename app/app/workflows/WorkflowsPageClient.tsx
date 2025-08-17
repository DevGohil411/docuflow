"use client"

import { useEffect, useState } from "react"
import { Plus, Play, Pause, Settings, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"

type SavedWorkflow = {
  id: string
  name: string
  nodes: any[]
  connections: any[]
  settings?: { description?: string; [key: string]: any }
  status?: "active" | "draft"
  createdAt?: string
  updatedAt?: string
  ownerId?: string
}

const templates = [
  {
    id: "template-1",
    name: "Basic OCR Workflow",
    description: "Extract text from documents and save to database",
    nodes: 3,
    category: "OCR",
  },
  {
    id: "template-2",
    name: "Approval Workflow",
    description: "Route documents through approval process",
    nodes: 6,
    category: "Approval",
  },
  {
    id: "template-3",
    name: "Data Extraction",
    description: "Extract specific data fields from forms",
    nodes: 4,
    category: "Extraction",
  },
]

function readSavedWorkflows(): SavedWorkflow[] {
  try {
    const arr = JSON.parse(localStorage.getItem("docuflow-workflows") || "[]")
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    return []
  }
}

function writeSavedWorkflows(items: SavedWorkflow[]) {
  localStorage.setItem("docuflow-workflows", JSON.stringify(items))
}

export default function WorkflowsPageClient() {
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([])
  const { data: user, isLoading: userLoading } = useCurrentUser()

  useEffect(() => {
    if (userLoading) return
    const list = readSavedWorkflows()
    let mutated = false
    const claimed = list.map((w) => {
      const needsId = !w.id
      const needsStatus = !w.status
      const needsOwner = !w.ownerId && user?.id
      mutated = mutated || needsId || needsStatus || !!needsOwner
      return {
        ...w,
        id: w.id || `wf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        status: (w.status as SavedWorkflow["status"]) || "draft",
        ownerId: w.ownerId || user?.id,
      }
    })
    if (mutated) writeSavedWorkflows(claimed)
    const filtered = user?.id ? claimed.filter((w) => w.ownerId === user.id) : claimed
    setWorkflows(filtered)
  }, [userLoading, user?.id])

  const handleWorkflowAction = (action: string, workflowId: string) => {
    const list = readSavedWorkflows()
    const idx = list.findIndex((w) => w.id === workflowId)
    if (idx < 0) return

    const wf = list[idx]
    switch (action) {
      case "copy": {
        const copy: SavedWorkflow = {
          ...wf,
          id: `wf-${Date.now()}`,
          name: `${wf.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: wf.status || "draft",
          ownerId: user?.id || wf.ownerId,
        }
        list.push(copy)
        break
      }
      case "toggle": {
        const next = (wf.status || "draft") === "active" ? "draft" : "active"
        list[idx] = { ...wf, status: next, updatedAt: new Date().toISOString(), ownerId: wf.ownerId || user?.id }
        break
      }
      case "delete": {
        if (!confirm(`Delete workflow "${wf.name}"?`)) return
        list.splice(idx, 1)
        break
      }
    }
    writeSavedWorkflows(list)
    const filtered = user?.id ? list.filter((w) => w.ownerId === user.id) : list
    setWorkflows(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Automate your document processing with custom workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Link href="/app/workflows/builder">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Workflows</h2>
        {workflows.length === 0 ? (
          <div className="rounded-md border p-8 text-center text-muted-foreground">
            <p className="mb-4">No workflows yet.</p>
            <Link href="/app/workflows/builder">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create your first workflow
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <Card key={wf.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={(wf.status || "draft") === "active" ? "default" : "secondary"}>
                      {wf.status || "draft"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{wf.name}</CardTitle>
                  {wf.settings?.description && <CardDescription>{wf.settings.description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Updated</p>
                      <p className="font-medium">{wf.updatedAt ? new Date(wf.updatedAt).toLocaleString() : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nodes</p>
                      <p className="font-medium">{Array.isArray(wf.nodes) ? wf.nodes.length : 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ID: {wf.id}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleWorkflowAction("copy", wf.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleWorkflowAction("toggle", wf.id)}>
                        {(wf.status || "draft") === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleWorkflowAction("delete", wf.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Link href={`/app/workflows/builder?workflow=${wf.id}`}>
                    <Button className="w-full bg-transparent" variant="outline">
                      Edit Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Workflow Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit">
                  {template.category}
                </Badge>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">{template.nodes} nodes</div>
                <Link href={`/app/workflows/builder?template=${template.id}`}>
                  <Button className="w-full">Use Template</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

