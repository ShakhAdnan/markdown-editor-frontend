"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="border-border border-t px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="border-border from-primary/5 rounded-lg border bg-linear-to-r to-blue-600/5 p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to collaborate?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join thousands of teams already using Markdown Editor to write
            better, faster, and together.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Writing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
