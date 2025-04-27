"use client"
import type React from "react"
import {useProtectedRoute } from "@/hooks/use-auth";
import Loading from "./loading"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoading = useProtectedRoute("auth"); // Get the loading state
  if (isLoading) {
      return <Loading/>; 
    }
  return children
}
