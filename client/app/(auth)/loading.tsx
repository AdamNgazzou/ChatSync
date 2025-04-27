"use client";

import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="auth-container">
      <div className="absolute inset-0 bg-auth-pattern opacity-30 dark:opacity-10"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"></div>
        
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>

        <CardFooter className="flex justify-center pb-8">
          <Skeleton className="h-4 w-40" />
        </CardFooter>
      </motion.div>
    </div>
  );
}
