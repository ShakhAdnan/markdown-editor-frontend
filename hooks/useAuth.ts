"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import axiosInstance from "@/lib/axios";
import type { LoginFormValues, SignupFormValues } from "@/lib/validations/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: logoutStore, user, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login function
  const login = async (credentials: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await axiosInstance.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Check if response is successful
      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store auth state
        setAuth(user, token);

        // Show success toast
        toast.success("Welcome back!", {
          description: `Logged in as ${user.email}`,
        });

        // Redirect to dashboard
        router.push("/dashboard");
        return { success: true };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";

      setError({ message: errorMessage });

      // Show error toast
      toast.error("Login failed", {
        description: errorMessage,
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (credentials: Omit<SignupFormValues, "confirmPassword" | "agreeToTerms">) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await axiosInstance.post("/auth/register", {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.password, // Backend expects this
      });

      // Check if response is successful
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
        return { success: true };
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";

      setError({ message: errorMessage });

      // Show error toast
      toast.error("Signup failed", {
        description: errorMessage,
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Optional: Call logout endpoint if you add one
      // await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local state regardless of API call result
      logoutStore();

      toast.info("Logged out", {
        description: "You have been logged out successfully",
      });

      router.push("/login");
    }
  };

  return {
    login,
    signup,
    logout,
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
