"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DocumentStats } from "@/components/editor/DocumentStats";
import { documentsApi } from "@/lib/api/documents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Download,
  Clock,
  CheckCircle2,
  Copy,
  FileText,
  File,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Document } from "@/types/document";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchDocument(params.id as string);
    }
  }, [params.id]);

  // Auto-save every 3 seconds if there are changes
  useEffect(() => {
    if (!hasUnsavedChanges || !document) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000);

    return () => clearTimeout(timer);
  }, [content, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchDocument = async (id: string) => {
    setIsLoading(true);
    try {
      const doc = await documentsApi.getById(id);
      setDocument(doc);
      setContent(doc.content);
    } catch (error) {
      console.error("Failed to fetch document:", error);
      toast.error("Failed to load document");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!document || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await documentsApi.update(document._id, { content });
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      toast.success("Saved", { duration: 1000 });
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleExportMarkdown = () => {
    if (!document) return;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Markdown");
  };

  const handleExportText = () => {
    if (!document) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Text");
  };

  const handleExportHTML = () => {
    if (!document) return;
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      max-width: 800px; 
      margin: 40px auto; 
      padding: 0 20px; 
      line-height: 1.6; 
    }
    pre { 
      background: #f5f5f5; 
      padding: 10px; 
      border-radius: 4px; 
      overflow-x: auto; 
    }
    code { 
      background: #f5f5f5; 
      padding: 2px 4px; 
      border-radius: 2px; 
    }
  </style>
</head>
<body>
  <pre>${content}</pre>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as HTML");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-2/3 mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      {/* Editor Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold">{document?.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Status */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isSaving ? (
                <>
                  <Clock className="h-3 w-3 animate-spin" />
                  Saving...
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Clock className="h-3 w-3" />
                  Unsaved changes
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  Saved {lastSaved.toLocaleTimeString()}
                </>
              ) : null}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMarkdown}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download as Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportText}>
                  <File className="mr-2 h-4 w-4" />
                  Download as Text (.txt)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportHTML}>
                  <File className="mr-2 h-4 w-4" />
                  Download as HTML
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Area with Stats Sidebar */}
      <main className="flex-1 overflow-hidden">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: showPreview ? "1fr 1fr 300px" : "1fr 300px",
          }}
        >
          {/* Editor Pane */}
          <div className="flex flex-col border-r">
            <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
              <Badge variant="secondary">Markdown</Badge>
            </div>
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your markdown..."
              className="flex-1 resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
            />
          </div>

          {/* Preview Pane */}
          {showPreview && (
            <div className="flex flex-col border-r">
              <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
                <Badge variant="secondary">Preview</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <article className="prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {content || "*No content to preview*"}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          )}

          {/* Stats Sidebar */}
          <div className="flex flex-col bg-muted/30">
            <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
              <Badge variant="secondary">Stats</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {document && (
                <DocumentStats
                  content={content}
                  createdAt={document.createdAt}
                  updatedAt={document.updatedAt}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
