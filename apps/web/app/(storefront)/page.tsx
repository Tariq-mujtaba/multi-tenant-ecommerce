import Link from "next/link"
import { ArrowRight, ShoppingBag, Store, Zap } from "lucide-react"
import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"

// ---------------------------------------------------------------------------
// TODO: Replace with real API call once backend product endpoints are ready
// e.g. const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?featured=true`)
// ---------------------------------------------------------------------------
const PLACEHOLDER_PRODUCTS = [
  {
    slug: "minimal-leather-wallet",
    title: "Minimal Leather Wallet",
    price: "39.99",
    currency: "USD",
    sellerName: "CraftedGoods",
    sellerSlug: "craftedgoods",
    badge: "New",
  },
  {
    slug: "ceramic-pour-over-set",
    title: "Ceramic Pour Over Coffee Set",
    price: "64.00",
    currency: "USD",
    sellerName: "BrewHouse",
    sellerSlug: "brewhouse",
  },
  {
    slug: "canvas-tote-bag",
    title: "Heavy Canvas Tote Bag",
    price: "24.50",
    currency: "USD",
    sellerName: "EverydayCarry",
    sellerSlug: "everydaycarry",
    badge: "Popular",
  },
  {
    slug: "wooden-desk-organiser",
    title: "Solid Oak Desk Organiser",
    price: "89.00",
    currency: "USD",
    sellerName: "OakWorks",
    sellerSlug: "oakworks",
  },
  {
    slug: "cotton-crew-tee",
    title: "Heavyweight Cotton Crew Tee",
    price: "32.00",
    currency: "USD",
    sellerName: "BasicThread",
    sellerSlug: "basicthread",
    badge: "New",
  },
  {
    slug: "enamel-coffee-mug",
    title: "Enamel Camp Coffee Mug",
    price: "18.00",
    currency: "USD",
    sellerName: "BrewHouse",
    sellerSlug: "brewhouse",
  },
]

const CATEGORIES = [
  { label: "Accessories", slug: "accessories", icon: ShoppingBag },
  { label: "Home & Living", slug: "home-living", icon: Store },
  { label: "Apparel", slug: "apparel", icon: Zap },
  { label: "Electronics", slug: "electronics", icon: Zap },
  { label: "Food & Drink", slug: "food-drink", icon: ShoppingBag },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b-2 border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 border-2 border-border bg-main text-main-foreground px-3 py-1 text-sm font-base font-medium">
                <span className="w-2 h-2 rounded-full bg-main-foreground" />
                Independent sellers, real products
              </div>

              <h1 className="text-5xl md:text-6xl font-heading leading-tight tracking-tight">
                Shop the Best.
                <br />
                <span className="text-main">Support Sellers.</span>
              </h1>

              <p className="text-lg font-base text-foreground/60 max-w-md">
                DashCart connects you with independent sellers offering unique,
                quality products you won&apos;t find anywhere else.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/products">
                    Browse Products
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="neutral" size="lg">
                  <Link href="/sellers">Meet Sellers</Link>
                </Button>
              </div>
            </div>

            {/* Decorative neobrutalism block */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-72 h-72">
                {/* Shadow layer */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-border bg-border" />
                {/* Main block */}
                <div className="relative border-2 border-border bg-main w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                  <ShoppingBag
                    size={56}
                    className="text-main-foreground"
                    strokeWidth={2.5}
                  />
                  <p className="text-main-foreground font-heading text-xl text-center">
                    1,000+
                    <br />
                    Products Listed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Category quick-links                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b-2 border-border bg-secondary-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-foreground/50 mr-2">
              Browse by:
            </span>
            {CATEGORIES.map(({ label, slug }) => (
              <Button key={slug} asChild variant="neutral">
                <Link href={`/products?category=${slug}`}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Featured products                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Section header */}
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-heading">
                Featured Products
              </h2>
              <p className="mt-1 text-sm font-base text-foreground/50">
                Hand-picked from our top sellers
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-base font-medium hover:text-main transition-colors whitespace-nowrap"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_PRODUCTS.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>

          {/* Mobile view all */}
          <div className="mt-8 sm:hidden text-center">
            <Button asChild variant="neutral">
              <Link href="/products">
                View all products <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Seller CTA banner                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t-2 border-border bg-main">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-heading text-main-foreground">
                Got something to sell?
              </h2>
              <p className="mt-1 text-sm font-base text-main-foreground/80">
                Join hundreds of independent sellers on DashCart.
              </p>
            </div>
            <Button asChild variant="neutral">
              <Link href="/register">
                Start Selling <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
