"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { CreateDocumentDialog } from "@/components/documents/CreateDocumentDialog";
import { RenameDocumentDialog } from "@/components/documents/RenameDocumentDialog";
import { DeleteDocumentDialog } from "@/components/documents/DeleteDocumentDialog";
import { EmptyState } from "@/components/documents/EmptyState";
import { useDocumentStore } from "@/stores/documentStore";
import { documentsApi } from "@/lib/api/documents";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus, Search, SortAsc, LayoutGrid, List, Star, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Document } from "@/types/document";

export default function DashboardPage() {
  const router = useRouter();
  const {
    documents,
    setDocuments,
    addDocument,
    updateDocument,
    removeDocument,
    isLoading,
    setLoading,
  } = useDocumentStore();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title">("updated");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  // Fetch on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Re-fetch when window becomes visible (user comes back from editor)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDocuments();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Search when debounced value changes
  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    } else {
      fetchDocuments();
    }
  }, [debouncedSearch]);

  const fetchDocuments = async () => {
  console.log("🔍 Dashboard: Fetching documents..."); // ← ADD
  setLoading(true);
  try {
    const docs = await documentsApi.getAll();
    console.log("✅ Dashboard: Received documents:", docs); // ← ADD
    console.log("📊 Dashboard: Document count:", docs?.length); // ← ADD
    setDocuments(docs);
    console.log("💾 Dashboard: Store updated"); // ← ADD
  } catch (error) {
    console.error("❌ Dashboard: Error:", error); // ← ADD
    toast.error("Failed to load documents");
  } finally {
    setLoading(false);
  }
};

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const docs = await documentsApi.search(query);
      setDocuments(docs);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (title: string, content?: string) => {
    const optimisticDoc: Document = {
      _id: `optimistic-${Date.now()}`,
      title,
      content: content || "# Untitled Document\n\nStart writing...",
      owner: "",
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocument(optimisticDoc);

    try {
      const newDoc = await documentsApi.create({ title, content });
      updateDocument(optimisticDoc._id, newDoc);
      toast.success("Document created successfully");
      router.push(`/editor/${newDoc._id}`);
    } catch (error) {
      removeDocument(optimisticDoc._id);
      toast.error("Failed to create document");
      throw error;
    }
  };

  const handleToggleFavorite = async (document: Document) => {
    const previousState = document.isFavorite;
    const documentId = document._id;

    updateDocument(documentId, {
      isFavorite: !previousState,
    });

    try {
      const updatedDoc = await documentsApi.toggleFavorite(documentId);

      updateDocument(documentId, {
        isFavorite: updatedDoc.isFavorite,
      });

      toast.success(
        updatedDoc.isFavorite ? "Added to favorites" : "Removed from favorites",
        { duration: 1500 }
      );
    } catch (error) {
      updateDocument(documentId, {
        isFavorite: previousState,
      });

      toast.error("Failed to update favorite");
    }
  };

  const handleRenameDocument = async (id: string, title: string) => {
    try {
      await documentsApi.update(id, { title });
      updateDocument(id, { title });
      toast.success("Document renamed successfully");
    } catch (error) {
      toast.error("Failed to rename document");
      throw error;
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await documentsApi.delete(id);
      removeDocument(id);
      toast.success("Document moved to trash");
    } catch (error) {
      toast.error("Failed to delete document");
      throw error;
    }
  };

  const openRenameDialog = (document: Document) => {
    setSelectedDocument(document);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      if (filter === "favorites" && !doc.isFavorite) return false;
      return doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const favoriteCount = documents.filter((doc) => doc.isFavorite).length;

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-tr from-primary/10 via-blue-50 to-white">
      <DashboardHeader />

      <div className="relative mb-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-br from-primary/90 via-primary/80 to-blue-600/80 -z-10 rounded-b-3xl shadow-lg"></div>
        <div className="px-6 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-black drop-shadow-sm">My Documents</h1>
            <p className="text-black/80 mt-1 drop-shadow-sm">
              {documents.length} {documents.length === 1 ? "document" : "documents"}
              {favoriteCount > 0 && ` · ${favoriteCount} favorites`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={fetchDocuments}
              disabled={isLoading}
              className="bg-white hover:bg-white/90"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>
        <div className="h-16"></div>
      </div>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(v: any) => setFilter(v)} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="mr-2 h-4 w-4" />
                Favorites ({favoriteCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {documents.length > 0 && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last Updated</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Documents Grid or List */}
          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "divide-y rounded-lg border bg-white"
              }
            >
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            searchQuery || filter === "favorites" ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No documents found matching "${searchQuery}"`
                    : "No favorite documents yet"}
                </p>
              </div>
            ) : (
              <EmptyState onCreateDocument={() => setCreateDialogOpen(true)} />
            )
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document._id}
                  document={document}
                  onRename={openRenameDialog}
                  onDelete={openDeleteDialog}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="divide-y rounded-lg border bg-white">
              {filteredDocuments.map((document) => (
                <div
                  key={document._id}
                  className="flex items-center justify-between p-4 hover:bg-muted transition cursor-pointer"
                  onClick={() => router.push(`/editor/${document._id}`)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(document);
                      }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          document.isFavorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <div>
                      <div className="text-lg font-medium">{document.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(document.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRenameDialog(document);
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(document);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateDocumentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateDocument}
      />
      <RenameDocumentDialog
        document={selectedDocument}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onRename={handleRenameDocument}
      />
      <DeleteDocumentDialog
        document={selectedDocument}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}
