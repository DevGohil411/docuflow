import type { Document } from "@/lib/types"

export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Invoice_2024_001.pdf",
    type: "pdf",
    size: 245760,
    status: "ready",
    uploadedBy: "user1",
    uploadedAt: new Date("2024-01-15"),
    ocrText:
      "INVOICE\nInvoice #: INV-2024-001\nDate: January 15, 2024\nAmount: $1,250.00\nVendor: Acme Corp\nDescription: Professional services rendered",
    metadata: {
      invoiceNumber: "INV-2024-001",
      amount: 1250.0,
      vendor: "Acme Corp",
      dueDate: "2024-02-15",
    },
    tags: ["invoice", "finance", "urgent"],
    versions: [],
    annotations: [],
  },
  {
    id: "2",
    name: "Contract_NDA_2024.pdf",
    type: "pdf",
    size: 512000,
    status: "ready",
    uploadedBy: "user2",
    uploadedAt: new Date("2024-01-10"),
    ocrText: "NON-DISCLOSURE AGREEMENT\nThis agreement is entered into between...",
    metadata: {
      contractType: "NDA",
      parties: ["Company A", "Company B"],
      effectiveDate: "2024-01-10",
      expirationDate: "2025-01-10",
    },
    tags: ["contract", "legal", "confidential"],
    versions: [],
    annotations: [],
  },
]

export async function uploadDocument(file: File): Promise<Document> {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const newDoc: Document = {
    id: Date.now().toString(),
    name: file.name,
    type: file.type.includes("pdf") ? "pdf" : "image",
    size: file.size,
    status: "processing",
    uploadedBy: "current-user",
    uploadedAt: new Date(),
    metadata: {},
    tags: [],
    versions: [],
    annotations: [],
  }

  // Simulate OCR processing
  setTimeout(() => {
    newDoc.status = "ready"
    newDoc.ocrText = "Sample extracted text from document..."
  }, 3000)

  return newDoc
}

export async function getDocuments(): Promise<Document[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDocuments
}

export async function getDocument(id: string): Promise<Document | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockDocuments.find((doc) => doc.id === id) || null
}
