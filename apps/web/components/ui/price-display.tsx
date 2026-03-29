import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: string;
  currency: string;
  className?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "₨",
};

export function PriceDisplay({ price, currency, className }: PriceDisplayProps) {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency;
  const formatted = parseFloat(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className={cn("font-heading font-bold", className)}>
      {symbol}
      {formatted}
    </span>
  );
}
