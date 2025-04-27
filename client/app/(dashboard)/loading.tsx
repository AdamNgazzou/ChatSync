"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 to-brand-100 dark:from-dark-200 dark:to-dark-300">
      {/* Sidebar Skeleton */}
      <div className="w-full md:w-80 flex-col glass-panel rounded-r-2xl shadow-glass dark:shadow-glass-dark z-10 absolute md:relative h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-6" />
        </div>

        {/* Friends List Skeleton */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}