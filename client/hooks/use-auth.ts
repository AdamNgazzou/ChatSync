"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export function useProtectedRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if no token is found
    } else {
      setIsLoading(false); // Authentication check is complete
    }
  }, [router]);

  return isLoading; // Return the loading state
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to login");
      }

      const { token, user } = await response.json();
      localStorage.setItem("token", token); // Store the token
      localStorage.setItem("user", JSON.stringify(user)); // Store user info
      router.push("/chat"); // Redirect to the chat page
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      router.push("/login"); // Redirect to the login page after successful registration
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function 
  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    localStorage.removeItem("user"); // Remove user info
    router.push("/login"); // Redirect to the login page
  };

  return { login, register, logout, isLoading, error };
}