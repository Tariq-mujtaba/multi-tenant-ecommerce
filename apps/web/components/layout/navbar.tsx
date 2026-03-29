import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { MobileMenu } from "./mobile-menu"
import { SearchForm } from "@/components/forms/search-form"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export function Navbar() {
  return (
    <header className="relative w-full border-b-2 border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl uppercase font-black tracking-tight hover:text-main transition-colors"
          >
            DashCart
          </Link>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-sm">
            <Suspense fallback={<div className="w-full h-10 bg-secondary-background animate-pulse rounded-base" />}>
              <SearchForm />
            </Suspense>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="px-4 py-2 font-medium border-2 border-transparent hover:border-border hover:bg-main hover:text-main-foreground transition-colors"
            >
              Products
            </Link>
            <Link
              href="/sellers"
              className="px-4 py-2 font-medium border-2 border-transparent hover:border-border hover:bg-main hover:text-main-foreground transition-colors"
            >
              Sellers
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Cart */}
            <Button asChild variant="neutral" size="icon">
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart size={16} />
              </Link>
            </Button>

            {/* Login — placeholder until BetterAuth is wired */}
            <Button asChild className="hidden md:inline-flex">
              <Link href="/login">Login</Link>
            </Button>

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
