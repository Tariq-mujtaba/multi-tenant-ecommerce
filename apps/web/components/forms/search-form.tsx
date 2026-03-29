"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFormProps {
  className?: string
  placeholder?: string
}

export function SearchForm({
  className,
  placeholder = "Search products...",
}: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value.trim()
    if (!q) return
    router.push(`/products?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-stretch", className)}
    >
      <Input
        ref={inputRef}
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder={placeholder}
        className="flex-1 min-w-0 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        type="submit"
        variant="noShadow"
        size="icon"
        className="rounded-l-none border-l-0 shrink-0"
        aria-label="Search"
      >
        <Search size={15} />
      </Button>
    </form>
  )
}
