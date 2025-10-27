"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PermanentDeleteDialog } from "@/components/documents/PermanentDeleteDialog";
import { documentsApi } from "@/lib/api/documents";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { Document } from "@/types/document";

export default function TrashPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const docs = await documentsApi.getTrash();
      setDocuments(docs);
    } catch (error) {
      toast.error("Failed to load trash");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await documentsApi.restore(id);
      setDocuments(documents.filter((doc) => doc._id !== id));
      toast.success("Document restored");
    } catch (error) {
      toast.error("Failed to restore document");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await documentsApi.permanentDelete(id);
      setDocuments(documents.filter((doc) => doc._id !== id));
      toast.success("Document permanently deleted");
    } catch (error) {
      toast.error("Failed to delete document");
      throw error;
    }
  };

  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-tr from-primary/10 via-blue-50 to-white">
      <DashboardHeader />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trash2 className="h-8 w-8" />
              Trash
            </h1>
            <p className="text-muted-foreground mt-1">
              {documents.length} deleted {documents.length === 1 ? "document" : "documents"}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="py-20 text-center">
              <Trash2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Trash is empty</p>
            </div>
          ) : (
            <div className="divide-y rounded-lg border bg-white">
              {documents.map((document) => (
                <div
                  key={document._id}
                  className="flex items-center justify-between p-4 hover:bg-muted transition"
                >
                  <div>
                    <div className="text-lg font-medium">{document.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Deleted {new Date(document.deletedAt || "").toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(document._id)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(document)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Delete Forever
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Permanent Delete Dialog */}
      <PermanentDeleteDialog
        document={selectedDocument}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handlePermanentDelete}
      />
    </div>
  );
}
