"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";

export type ToolbarAction =
  | "undo"
  | "redo"
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "ul"
  | "ol"
  | "quote"
  | "link"
  | "image"
  | "hr";

interface EditorToolbarProps {
  onAction: (action: ToolbarAction) => void;
  disabled?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onAction,
  disabled,
}) => {
  const group = "flex items-center gap-1 rounded-md bg-muted/50 p-1";

  return (
    <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className={group}>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("undo")}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("redo")}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className={group}>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("strike")}>
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("code")}>
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className={group}>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("h1")}>
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("h2")}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("h3")}>
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className={group}>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("ul")}>
            <List className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("ol")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("quote")}>
            <Quote className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("hr")}>
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className={group}>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("link")}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={disabled} onClick={() => onAction("image")}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
