import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-border bg-secondary-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="text-xl font-heading">DashCart</p>
            <p className="mt-1 text-sm font-base text-foreground/60">
              Shop the best from independent sellers.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-main transition-colors"
            >
              Products
            </Link>
            <Link
              href="/sellers"
              className="text-sm font-medium hover:text-main transition-colors"
            >
              Sellers
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-main transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t-2 border-border pt-6">
          <p className="text-xs font-base text-foreground/50">
            &copy; {new Date().getFullYear()} DashCart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
