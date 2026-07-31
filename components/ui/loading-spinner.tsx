import { Loader2 } from "lucide-react"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={`h-4 w-4 animate-spin text-brand ${className || ''}`} />
  )
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  )
}
