"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type { Document } from "@/types/document";

interface RenameDocumentDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (id: string, title: string) => Promise<void>;
}

export const RenameDocumentDialog: React.FC<RenameDocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
  onRename,
}) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !document) return;

    setIsLoading(true);
    try {
      await onRename(document._id, title.trim());
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to rename document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Document</DialogTitle>
          <DialogDescription>
            Enter a new name for this document.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-title">Document Title</Label>
              <Input
                id="rename-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
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
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
