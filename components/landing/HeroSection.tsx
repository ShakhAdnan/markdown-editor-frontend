"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, Shield } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="bg-primary/10 text-primary inline-flex items-center rounded-lg px-3 py-1 text-sm">
                ✨ Now with AI-powered suggestions
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Write, Collaborate, Create in{" "}
                <span className="from-primary bg-linear-to-r to-blue-600 bg-clip-text text-transparent">
                  Real-Time
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                The ultimate markdown editor for modern teams. Write together,
                see changes instantly, and ship documentation faster.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="space-y-2 pt-4">
              <p className="text-muted-foreground text-sm">
                ✅ Free forever plan • No credit card required
              </p>
              <p className="text-muted-foreground text-sm">
                ✅ Used by 5,000+ teams worldwide
              </p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex items-center justify-center">
            <div className="border-border from-primary/5 relative flex h-96 w-full items-center justify-center rounded-lg border bg-linear-to-br to-blue-600/5 p-8">
              <div className="text-center">
                <div className="bg-primary/20 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg">
                  <Zap className="text-primary h-8 w-8" />
                </div>
                <p className="text-muted-foreground">
                  Beautiful preview of markdown editor coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
