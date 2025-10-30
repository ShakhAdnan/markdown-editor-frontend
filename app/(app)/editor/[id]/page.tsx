"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DocumentStats } from "@/components/editor/DocumentStats";
import {
  EditorToolbar,
  type ToolbarAction,
} from "@/components/editor/EditorToolbar";
import { applyMarkdownAction } from "@/lib/editor/markdownActions";
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
  FileType,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import type { Document } from "@/types/document";
import { exportApi } from "@/lib/api/export";

type HistoryEntry = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchDocument(params.id as string);
    }
  }, [params.id]);

  // Init history after load
  useEffect(() => {
    if (!isLoading && document) {
      const el = textareaRef.current;
      const selStart = el?.selectionStart ?? 0;
      const selEnd = el?.selectionEnd ?? 0;
      setHistory([
        {
          value: document.content,
          selectionStart: selStart,
          selectionEnd: selEnd,
        },
      ]);
      setRedoStack([]);
    }
  }, [isLoading, document]);

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

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [content, history, redoStack]);

  const pushHistory = (value: string, selStart: number, selEnd: number) => {
    setHistory((prev) => [
      ...prev,
      { value, selectionStart: selStart, selectionEnd: selEnd },
    ]);
    setRedoStack([]); // clear redo on new edit
  };

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
    const el = e.target;
    pushHistory(content, el.selectionStart, el.selectionEnd);
    setContent(el.value);
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const currentEl = textareaRef.current;
    const last = history[history.length - 1];

    setRedoStack((r) => [
      ...r,
      {
        value: content,
        selectionStart: currentEl?.selectionStart ?? content.length,
        selectionEnd: currentEl?.selectionEnd ?? content.length,
      },
    ]);

    setHistory((h) => h.slice(0, -1));
    setContent(last.value);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = last.selectionStart;
        textareaRef.current.selectionEnd = last.selectionEnd;
      }
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const currentEl = textareaRef.current;
    const next = redoStack[redoStack.length - 1];

    setHistory((h) => [
      ...h,
      {
        value: content,
        selectionStart: currentEl?.selectionStart ?? content.length,
        selectionEnd: currentEl?.selectionEnd ?? content.length,
      },
    ]);

    setRedoStack((r) => r.slice(0, -1));
    setContent(next.value);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = next.selectionStart;
        textareaRef.current.selectionEnd = next.selectionEnd;
      }
    });
  };

  const handleToolbarAction = (action: ToolbarAction) => {
    const el = textareaRef.current;
    if (!el) return;

    if (action === "undo") return handleUndo();
    if (action === "redo") return handleRedo();

    // Save current state for undo
    pushHistory(content, el.selectionStart, el.selectionEnd);

    // Apply action
    const result = applyMarkdownAction(action, el);
    setContent(result.value);
    setHasUnsavedChanges(true);

    // Restore focus and selection
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.selectionStart = result.selectionStart;
      textareaRef.current.selectionEnd = result.selectionEnd;
    });
  };

  const handleExportPDFServer = async () => {
  if (!document) return;
  try {
    const blob = await exportApi.pdf(document.title, content);

    // Detect if the blob is actually JSON error
    if (blob.type && blob.type.includes("application/json")) {
      const text = await blob.text();
      console.error("PDF error response:", text);
      toast.error("Failed to export PDF");
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("PDF downloaded");
  } catch (e) {
    console.error(e);
    toast.error("Failed to export PDF");
  }
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
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 2px 4px; border-radius: 2px; }
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
            <Skeleton className="mb-4 h-8 w-32" />
            <Skeleton className="mb-6 h-12 w-2/3" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      {/* Top Toolbar: title, preview, export, save */}
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
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
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
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

            {/* Preview Toggle */}
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
                <DropdownMenuItem onClick={handleExportPDFServer}>
                  <FileType className="mr-2 h-4 w-4" />
                  Download as PDF
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

        {/* Formatting Toolbar */}
        <EditorToolbar onAction={handleToolbarAction} disabled={isLoading} />
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
            <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
              <Badge variant="secondary">Markdown</Badge>
            </div>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your markdown..."
              className="flex-1 resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
            />
          </div>

          {/* Preview Pane */}
          {showPreview && (
            <div className="flex flex-col border-r">
              <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
                <Badge variant="secondary">Preview</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <article className="prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  >
                    {content || "*No content to preview*"}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          )}

          {/* Stats Sidebar */}
          <div className="bg-muted/30 flex flex-col">
            <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
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
