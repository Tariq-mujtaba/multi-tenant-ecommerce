import Link from "next/link"
import { PriceDisplay } from "./price-display"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  slug: string
  title: string
  price: string
  currency: string
  image?: string
  sellerName: string
  sellerSlug: string
  badge?: string
  className?: string
}

export function ProductCard({
  slug,
  title,
  price,
  currency,
  image,
  sellerName,
  sellerSlug,
  badge,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "group border-2 border-border bg-background shadow-shadow flex flex-col rounded-base overflow-hidden",
        "hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150",
        className,
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${slug}`}
        className="block overflow-hidden border-b-2 border-border"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-150"
          />
        ) : (
          <div className="h-52 w-full bg-main/10 flex items-center justify-center">
            <span className="text-4xl font-heading text-main/30">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {badge && <Badge>{badge}</Badge>}

        <Link href={`/products/${slug}`}>
          <h3 className="font-heading font-bold text-base leading-tight hover:text-main transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <Link
          href={`/sellers/${sellerSlug}`}
          className="text-xs font-base text-foreground/60 hover:text-main transition-colors"
        >
          by {sellerName}
        </Link>

        <div className="mt-auto pt-2 border-t-2 border-border">
          <PriceDisplay price={price} currency={currency} className="text-lg" />
        </div>
      </div>
    </div>
  )
}
