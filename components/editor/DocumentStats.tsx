"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Type, 
  Clock, 
  Calendar 
} from "lucide-react";

interface DocumentStatsProps {
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({
  content,
  createdAt,
  updatedAt,
}) => {
  // Calculate stats
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const characters = content.length;
  const lines = content.split("\n").length;
  const readingTime = Math.ceil(words / 200); // 200 words per minute

  const stats = [
    {
      label: "Words",
      value: words.toLocaleString(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Characters",
      value: characters.toLocaleString(),
      icon: Type,
      color: "text-green-600",
    },
    {
      label: "Lines",
      value: lines.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
    },
    {
      label: "Reading Time",
      value: `${readingTime} min`,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-sm font-semibold">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created
            </span>
            <span className="font-medium">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated
            </span>
            <span className="font-medium">
              {new Date(updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
