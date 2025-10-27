import axiosInstance from "../axios";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";

export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    console.log("🔄 Calling GET /documents"); // ← ADD
    try {
      const response = await axiosInstance.get("/documents");
      console.log("✅ Response:", response.data); // ← ADD
      console.log("📦 Documents count:", response.data.data?.length); // ← ADD
      return response.data.data;
    } catch (error) {
      console.error("❌ API Error:", error); // ← ADD
      throw error;
    }
  },

  getById: async (id: string): Promise<Document> => {
    const response = await axiosInstance.get(`/documents/${id}`);
    return response.data.data;
  },

  create: async (data: CreateDocumentInput): Promise<Document> => {
    const response = await axiosInstance.post("/documents", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateDocumentInput): Promise<Document> => {
    const response = await axiosInstance.put(`/documents/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/documents/${id}`);
  },

  search: async (query: string): Promise<Document[]> => {
    const response = await axiosInstance.get(`/documents/search?q=${query}`);
    return response.data.data;
  },
  getTrash: async (): Promise<Document[]> => {
    const response = await axiosInstance.get("/documents/trash");
    return response.data.data;
  },

  restore: async (id: string): Promise<Document> => {
    const response = await axiosInstance.patch(`/documents/${id}/restore`);
    return response.data.data;
  },

  permanentDelete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/documents/${id}/permanent`);
  },

  // ← ADD THIS
  toggleFavorite: async (id: string): Promise<Document> => {
    const response = await axiosInstance.patch(`/documents/${id}/favorite`);
    return response.data.data;
  },
};
