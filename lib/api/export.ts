import axiosInstance from "@/lib/axios";
export const exportApi = {
  pdf: async (title: string, content: string): Promise<Blob> => {
    const res = await axiosInstance.post("/export/pdf", { title, content }, { responseType: "blob" });
    return res.data as Blob;
  },
};