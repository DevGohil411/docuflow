// Mock services for DocuFlow - simulates real backend functionality

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: "processing" | "completed" | "failed"
  tags: string[]
  author: string
  content?: string
  ocrConfidence?: number
}

export interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "paused"
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: string
  lastRun?: string
  successRate: number
}

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

// Mock data storage using localStorage
class MockStorage {
  private getKey(type: string): string {
    return `docuflow_${type}`
  }

  get<T>(type: string): T[] {
    try {
      const data = localStorage.getItem(this.getKey(type))
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  set<T>(type: string, data: T[]): void {
    try {
      localStorage.setItem(this.getKey(type), JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  add<T extends { id: string }>(type: string, item: T): T {
    const items = this.get<T>(type)
    items.push(item)
    this.set(type, items)
    return item
  }

  update<T extends { id: string }>(type: string, id: string, updates: Partial<T>): T | null {
    const items = this.get<T>(type)
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return null

    items[index] = { ...items[index], ...updates }
    this.set(type, items)
    return items[index]
  }

  delete(type: string, id: string): boolean {
    const items = this.get(type)
    const filtered = items.filter((item) => item.id !== id)
    if (filtered.length === items.length) return false

    this.set(type, filtered)
    return true
  }
}

const storage = new MockStorage()

// Document service
export const documentService = {
  async getAll(): Promise<Document[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return storage.get<Document>("documents")
  },

  async getById(id: string): Promise<Document | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const documents = storage.get<Document>("documents")
    return documents.find((doc) => doc.id === id) || null
  },

  async upload(file: File): Promise<Document> {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate upload time

    const document: Document = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "processing",
      tags: [],
      author: "Current User",
    }

    storage.add("documents", document)

    // Simulate processing
    setTimeout(() => {
      this.update(document.id, {
        status: "completed",
        content: "Mock extracted text content...",
        ocrConfidence: Math.random() * 20 + 80, // 80-100%
      })
    }, 3000)

    return document
  },

  async update(id: string, updates: Partial<Document>): Promise<Document | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return storage.update<Document>("documents", id, updates)
  },

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return storage.delete("documents", id)
  },

  async search(query: string): Promise<Document[]> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const documents = storage.get<Document>("documents")
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.content?.toLowerCase().includes(query.toLowerCase()),
    )
  },
}

// Workflow service
export const workflowService = {
  async getAll(): Promise<Workflow[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return storage.get<Workflow>("workflows")
  },

  async getById(id: string): Promise<Workflow | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const workflows = storage.get<Workflow>("workflows")
    return workflows.find((workflow) => workflow.id === id) || null
  },

  async create(workflow: Omit<Workflow, "id" | "createdAt">): Promise<Workflow> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newWorkflow: Workflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    return storage.add("workflows", newWorkflow)
  },

  async update(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return storage.update<Workflow>("workflows", id, updates)
  },

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return storage.delete("workflows", id)
  },

  async execute(id: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate execution time

    // Update last run time
    this.update(id, { lastRun: new Date().toISOString() })

    // Simulate success/failure
    const success = Math.random() > 0.1 // 90% success rate
    return {
      success,
      message: success ? "Workflow executed successfully" : "Workflow execution failed",
    }
  },
}

// Initialize with some mock data if empty
export const initializeMockData = () => {
  if (typeof window === "undefined") return // Skip on server

  const documents = storage.get<Document>("documents")
  if (documents.length === 0) {
    const mockDocuments: Document[] = [
      {
        id: "doc_1",
        name: "Q4 Financial Report.pdf",
        type: "application/pdf",
        size: 2048576,
        uploadedAt: "2024-02-15T10:00:00Z",
        status: "completed",
        tags: ["financial", "quarterly", "report"],
        author: "Finance Team",
        content: "Q4 financial report showing strong performance...",
        ocrConfidence: 95.2,
      },
      {
        id: "doc_2",
        name: "Employee Handbook.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1024000,
        uploadedAt: "2024-02-14T14:30:00Z",
        status: "completed",
        tags: ["hr", "handbook", "policies"],
        author: "HR Department",
        content: "Employee handbook with updated policies...",
        ocrConfidence: 98.7,
      },
    ]
    storage.set("documents", mockDocuments)
  }

  const workflows = storage.get<Workflow>("workflows")
  if (workflows.length === 0) {
    const mockWorkflows: Workflow[] = [
      {
        id: "workflow_1",
        name: "Invoice Processing",
        description: "Automatically process and extract data from invoices",
        status: "active",
        nodes: [],
        connections: [],
        createdAt: "2024-02-10T09:00:00Z",
        lastRun: "2024-02-15T12:00:00Z",
        successRate: 98.5,
      },
    ]
    storage.set("workflows", mockWorkflows)
  }
}
