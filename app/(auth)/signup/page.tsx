"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/authStore";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Eye, EyeOff, Github, Mail, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const password = form.watch("password");

  const passwordChecks = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    hasLength: password?.length >= 8,
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API directly
      const response = await axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store auth state
        setAuth(user, token);

        // Show success toast
        toast.success("Account created!", {
          description: "Welcome to Markdown Editor",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";

      setError(errorMessage);

      toast.error("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hero Style with Better Spacing */}
      <div className="from-primary/95 via-primary/90 hidden w-1/2 bg-linear-to-br to-blue-600/95 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex flex-col gap-12">
          {/* Logo - Now Clickable */}
          <Link
            href="/"
            className="group flex w-fit items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-xl font-bold backdrop-blur transition-transform group-hover:scale-105">
              ME
            </div>
            <h1 className="text-2xl font-bold">Markdown Editor</h1>
          </Link>

          {/* Hero Text */}
          <div className="space-y-8">
            <h2 className="text-5xl leading-tight font-extrabold">
              Write.
              <br />
              Collaborate.
              <br />
              Create.
            </h2>
            <p className="max-w-md text-xl leading-relaxed text-white/90">
              The ultimate markdown editor for modern teams. Write together, see
              changes instantly, and ship documentation faster than ever.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold">5,000+</div>
                <div className="text-sm text-white/70">Active Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50k+</div>
                <div className="text-sm text-white/70">Documents</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-white/70">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer - Added for better visual separation */}
        <div className="min-h-[60px] flex-1" />

        {/* Footer */}
        <div className="space-y-4">
          <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="mb-2 font-semibold">✨ What's New</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">●</span> Real-time
                collaboration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">●</span> AI-powered suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">●</span> Version history
              </li>
            </ul>
          </div>
          <p className="text-xs text-white/60">
            © 2025 Markdown Editor. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="bg-background flex w-full flex-col items-center justify-center overflow-y-auto px-4 py-8 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join millions using Markdown Editor
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-destructive/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <span className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-sm">
                Or signup with email
              </span>
            </div>

            {/* Signup Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          autoComplete="name"
                          disabled={isLoading}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          disabled={isLoading}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="h-11 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />

                      {/* Password Requirements Checklist */}
                      {password && (
                        <div className="bg-muted mt-3 space-y-2 rounded-lg p-3 text-xs">
                          <div className="flex items-center gap-2">
                            {passwordChecks.hasLength ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <X className="text-muted-foreground h-4 w-4" />
                            )}
                            <span
                              className={
                                passwordChecks.hasLength
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordChecks.hasUpperCase ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <X className="text-muted-foreground h-4 w-4" />
                            )}
                            <span
                              className={
                                passwordChecks.hasUpperCase
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordChecks.hasLowerCase ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <X className="text-muted-foreground h-4 w-4" />
                            )}
                            <span
                              className={
                                passwordChecks.hasLowerCase
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordChecks.hasNumber ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <X className="text-muted-foreground h-4 w-4" />
                            )}
                            <span
                              className={
                                passwordChecks.hasNumber
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              One number
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordChecks.hasSpecial ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <X className="text-muted-foreground h-4 w-4" />
                            )}
                            <span
                              className={
                                passwordChecks.hasSpecial
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              One special character
                            </span>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="h-11 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer text-sm font-normal">
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="hover:text-foreground underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="hover:text-foreground underline"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="h-11 w-full text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
