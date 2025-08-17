import type { Document, User, Workflow, Analytics } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@company.com",
    name: "John Doe",
    role: "admin",
    avatar: "/professional-headshot.png",
    createdAt: new Date("2024-01-15"),
    lastLoginAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    email: "jane.smith@company.com",
    name: "Jane Smith",
    role: "manager",
    avatar: "/professional-headshot.png",
    createdAt: new Date("2024-01-10"),
    lastLoginAt: new Date("2024-01-19"),
  },
]

export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Invoice_2024_001.pdf",
    type: "pdf",
    size: 245760,
    status: "ready",
    uploadedBy: "1",
    uploadedAt: new Date("2024-01-18"),
    ocrText: "Invoice #2024-001 Amount: $1,250.00 Due Date: 2024-02-15",
    metadata: { invoiceNumber: "2024-001", amount: 1250, vendor: "Acme Corp" },
    tags: ["invoice", "finance", "urgent"],
    versions: [],
    annotations: [],
  },
  {
    id: "2",
    name: "Contract_ServiceAgreement.docx",
    type: "office",
    size: 156800,
    status: "processing",
    uploadedBy: "2",
    uploadedAt: new Date("2024-01-17"),
    metadata: { contractType: "Service Agreement", parties: ["Company A", "Company B"] },
    tags: ["contract", "legal"],
    versions: [],
    annotations: [],
  },
  {
    id: "3",
    name: "Receipt_Office_Supplies.jpg",
    type: "image",
    size: 89600,
    status: "ready",
    uploadedBy: "1",
    uploadedAt: new Date("2024-01-16"),
    ocrText: "Office Depot Receipt Total: $89.99 Date: 2024-01-16",
    metadata: { total: 89.99, vendor: "Office Depot", category: "supplies" },
    tags: ["receipt", "expenses"],
    versions: [],
    annotations: [],
  },
]

export const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Invoice Processing",
    description: "Automatically extract data from invoices and route for approval",
    version: 1,
    status: "active",
    nodes: [],
    edges: [],
    createdBy: "1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
]

// Mock API functions
export const uploadDocument = async (file: File): Promise<Document> => {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const document: Document = {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "office",
    size: file.size,
    status: "processing",
    uploadedBy: "1",
    uploadedAt: new Date(),
    metadata: {},
    tags: [],
    versions: [],
    annotations: [],
  }

  return document
}

export const processDocument = async (documentId: string): Promise<Document> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const document = mockDocuments.find((d) => d.id === documentId)
  if (!document) throw new Error("Document not found")

  return {
    ...document,
    status: "ready",
    ocrText: "Sample extracted text from document processing",
  }
}

export const getAnalytics = async (): Promise<Analytics> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    processingTime: {
      median: 45,
      p95: 120,
      trend: [30, 35, 40, 45, 42, 38, 45],
    },
    documentsByType: [
      { type: "PDF", count: 156 },
      { type: "Image", count: 89 },
      { type: "Office", count: 67 },
    ],
    workflowBottlenecks: [
      { step: "OCR Processing", avgTime: 25 },
      { step: "Data Extraction", avgTime: 15 },
      { step: "Approval", avgTime: 180 },
    ],
    storageUsage: {
      used: 2.4,
      total: 10,
      trend: [1.8, 2.0, 2.1, 2.2, 2.3, 2.4],
    },
  }
}
