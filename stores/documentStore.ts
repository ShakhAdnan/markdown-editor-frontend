import { create } from "zustand";
import type { Document } from "@/types/document";

interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  setDocuments: (documents: Document[]) => void;
  setCurrentDocument: (document: Document | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,

  setDocuments: (documents) => set({ documents }),

  setCurrentDocument: (document) => set({ currentDocument: document }),

  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents],
    })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc._id === id ? { ...doc, ...updates } : doc
      ),
      currentDocument:
        state.currentDocument?._id === id
          ? { ...state.currentDocument, ...updates }
          : state.currentDocument,
    })),
    

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc._id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
