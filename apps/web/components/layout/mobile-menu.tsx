"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="neutral"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background border-b-2 border-border z-50">
          <nav className="flex flex-col p-4 gap-1">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="px-4 py-3 font-medium hover:bg-main hover:text-main-foreground border-2 border-transparent hover:border-border transition-colors"
            >
              Products
            </Link>
            <Link
              href="/sellers"
              onClick={() => setOpen(false)}
              className="px-4 py-3 font-medium hover:bg-main hover:text-main-foreground border-2 border-transparent hover:border-border transition-colors"
            >
              Sellers
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 font-medium hover:bg-main hover:text-main-foreground border-2 border-transparent hover:border-border transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
