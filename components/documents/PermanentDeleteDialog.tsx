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
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, Flame } from "lucide-react";
import type { Document } from "@/types/document";

interface PermanentDeleteDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<void>;
}

export const PermanentDeleteDialog: React.FC<PermanentDeleteDialogProps> = ({
  document,
  open,
  onOpenChange,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = async () => {
    if (!document || !confirmed) return;

    setIsLoading(true);
    try {
      await onDelete(document._id);
      onOpenChange(false);
      setConfirmed(false);
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setConfirmed(false);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Flame className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl">Permanent Delete?</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Box */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-destructive">
                  This will permanently delete:
                </p>
                <p className="text-sm font-semibold text-foreground">
                  "{document?.title}"
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• All content will be lost forever</li>
                  <li>• Cannot be recovered or restored</li>
                  <li>• This action is irreversible</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-center space-x-2 rounded-lg border p-4">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I understand this action cannot be undone
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
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
            disabled={!confirmed || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Deleting...
              </>
            ) : (
              <>
                <Flame className="h-4 w-4" />
                Delete Forever
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
