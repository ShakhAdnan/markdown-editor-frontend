import React from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateDocument: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateDocument }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No documents yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Get started by creating your first markdown document. You can write, edit, and collaborate in real-time.
      </p>
      <Button onClick={onCreateDocument} className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Document
      </Button>
    </div>
  );
};
