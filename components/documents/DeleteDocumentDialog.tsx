"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import type { Document } from "@/types/document";

interface DeleteDocumentDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<void>;
}

export const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!document) return;

    setIsLoading(true);
    try {
      await onDelete(document._id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Document?</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{document?.title}"
            </span>
            ? This will permanently remove the document and all its content.
          </p>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
