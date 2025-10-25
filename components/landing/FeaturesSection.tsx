"use client";

import { Edit3, Users, Zap, Lock, HistoryIcon, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Edit3,
    title: "Markdown Editor",
    description: "Powerful editor with syntax highlighting and live preview",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Multiple users can edit the same document simultaneously",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with instant updates and syncing",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "End-to-end encryption for all your documents and data",
  },
  {
    icon: HistoryIcon,
    title: "Version History",
    description: "Track changes and restore previous versions anytime",
  },
  {
    icon: Sparkles,
    title: "AI Assistance",
    description: "Get writing suggestions and improve your content with AI",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="border-border border-t px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features for Every Writer
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Everything you need to write, collaborate, and create beautiful
            markdown documents
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border border">
                <CardHeader>
                  <div className="bg-primary/10 mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg">
                    <Icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
