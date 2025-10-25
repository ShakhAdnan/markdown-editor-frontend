import { z } from "zod";

// Document creation schema
export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
});

// Document update schema
export const updateDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters")
    .optional(),
  content: z.string().optional(),
});

// Document rename schema
export const renameDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
});

// Type inference
export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentFormValues = z.infer<typeof updateDocumentSchema>;
export type RenameDocumentFormValues = z.infer<typeof renameDocumentSchema>;
