export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "reviewer" | "viewer"
  avatar?: string
  createdAt: Date
  lastLoginAt?: Date
}

export interface Document {
  id: string
  name: string
  type: "pdf" | "image" | "office"
  size: number
  status: "processing" | "ready" | "error"
  uploadedBy: string
  uploadedAt: Date
  ocrText?: string
  metadata: Record<string, any>
  tags: string[]
  folderId?: string
  versions: DocumentVersion[]
  annotations: Annotation[]
}

export interface DocumentVersion {
  id: string
  documentId: string
  version: number
  createdAt: Date
  createdBy: string
  changes: string
  fileUrl: string
}

export interface Annotation {
  id: string
  documentId: string
  type: "highlight" | "comment" | "stamp" | "redaction"
  position: { x: number; y: number; width: number; height: number }
  page: number
  content?: string
  createdBy: string
  createdAt: Date
}

export interface Workflow {
  id: string
  name: string
  description: string
  version: number
  status: "draft" | "active" | "archived"
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowNode {
  id: string
  type:
    | "start"
    | "human-task"
    | "auto-extract"
    | "conditional"
    | "parallel"
    | "e-sign"
    | "notify"
    | "webhook"
    | "archive"
  position: { x: number; y: number }
  data: Record<string, any>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  condition?: string
}

export interface Task {
  id: string
  workflowId: string
  documentId: string
  assigneeId: string
  type: "approve" | "review" | "sign" | "extract"
  status: "pending" | "in-progress" | "completed" | "rejected"
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  comments: TaskComment[]
}

export interface TaskComment {
  id: string
  taskId: string
  content: string
  createdBy: string
  createdAt: Date
}

export interface AuditLog {
  id: string
  entityType: "document" | "workflow" | "user" | "task"
  entityId: string
  action: string
  actor: string
  timestamp: Date
  details: Record<string, any>
  ipAddress?: string
}

export interface Integration {
  id: string
  name: string
  type: "google-drive" | "onedrive" | "gmail" | "slack" | "webhook" | "zapier"
  status: "connected" | "disconnected" | "error"
  config: Record<string, any>
  lastSyncAt?: Date
}

export interface Analytics {
  processingTime: {
    median: number
    p95: number
    trend: number[]
  }
  documentsByType: Array<{ type: string; count: number }>
  workflowBottlenecks: Array<{ step: string; avgTime: number }>
  storageUsage: {
    used: number
    total: number
    trend: number[]
  }
}
