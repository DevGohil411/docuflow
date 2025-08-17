import { create } from "zustand"
import type { Document } from "@/lib/types"
import { mockDocuments } from "@/lib/mocks"

interface DocumentStore {
  documents: Document[]
  selectedDocument: Document | null
  isLoading: boolean
  setDocuments: (documents: Document[]) => void
  setSelectedDocument: (document: Document | null) => void
  setLoading: (loading: boolean) => void
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: mockDocuments,
  selectedDocument: null,
  isLoading: false,
  setDocuments: (documents) => set({ documents }),
  setSelectedDocument: (document) => set({ selectedDocument: document }),
  setLoading: (loading) => set({ isLoading: loading }),
  addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
}))
