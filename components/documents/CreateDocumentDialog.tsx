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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Calendar, Book } from "lucide-react";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string, content?: string) => Promise<void>;
}

// Document Templates
const TEMPLATES = [
  {
    id: "blank",
    label: "Blank",
    icon: FileText,
    content: "# Untitled Document\n\nStart writing...",
    description: "Start with a blank canvas",
  },
  {
    id: "meeting",
    label: "Meeting Notes",
    icon: Calendar,
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 

## Agenda

## Discussion

## Action Items
- [ ] 
`,
    description: "Template for meeting notes",
  },
  {
    id: "readme",
    label: "README",
    icon: Book,
    content: `# Project Name

## Description
A brief description of your project

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
Instructions on how to use your project

## Contributing
Guidelines for contributing to the project

## License
MIT
`,
    description: "Standard README template",
  },
];

export const CreateDocumentDialog: React.FC<CreateDocumentDialogProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(title.trim(), selectedTemplate.content);
      setTitle("");
      setSelectedTemplate(TEMPLATES[0]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Choose a template and give your document a name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Template Selection */}
            <div className="space-y-3">
              <Label>Choose Template</Label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                        ${
                          selectedTemplate.id === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }
                      `}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          selectedTemplate.id === template.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          selectedTemplate.id === template.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {template.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedTemplate.description}
              </p>
            </div>

            {/* Document Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Document"
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
                  Creating...
                </>
              ) : (
                "Create Document"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
