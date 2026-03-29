"use client"

import { Button } from "@/components/ui/button"

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center gap-6 text-center">
      <div className="border-2 border-border bg-background p-8 shadow-shadow max-w-md w-full rounded-base">
        <h2 className="text-2xl font-bold mb-2">
          Something went wrong
        </h2>
        <p className="font-base text-foreground/60 mb-6 text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
