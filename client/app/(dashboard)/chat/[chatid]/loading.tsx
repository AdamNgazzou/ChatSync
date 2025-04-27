import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-dark-200 dark:to-dark-300">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-500" />
        <p className="mt-4 text-lg font-medium">Loading chat...</p>
      </div>
    </div>
  )
}
