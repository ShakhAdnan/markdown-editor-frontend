"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  Star, // ← ADD THIS
} from "lucide-react";
import type { Document } from "@/types/document";

interface DocumentCardProps {
  document: Document;
  onRename: (document: Document) => void;
  onDelete: (document: Document) => void;
  onToggleFavorite: (document: Document) => void; // ← ADD THIS
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onRename,
  onDelete,
  onToggleFavorite, // ← ADD THIS
}) => {
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/editor/${document._id}`);
  };

  const getPreview = (content: string) => {
    const lines = content.split("\n");
    const textContent = lines
      .filter((line) => !line.startsWith("#"))
      .join(" ")
      .slice(0, 100);
    return textContent || "No content";
  };

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer relative">
      {/* Favorite Star Button - Top Right Corner */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(document);
        }}
        className="absolute top-3 right-12 z-10 p-1.5 rounded-full hover:bg-muted transition-colors"
      >
        <Star
          className={`h-5 w-5 transition-colors ${
            document.isFavorite
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground hover:text-yellow-400"
          }`}
        />
      </button>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-12" onClick={handleOpen}>
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {document.title}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3" />
              Updated {format(new Date(document.updatedAt), "MMM d, yyyy")}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpen}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(document)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(document)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent onClick={handleOpen}>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getPreview(document.content)}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <FileText className="mr-1 h-3 w-3" />
            Markdown
          </Badge>
          {document.isFavorite && (
            <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">
              <Star className="mr-1 h-3 w-3 fill-yellow-400" />
              Favorite
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
