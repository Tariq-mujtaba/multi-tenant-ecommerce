import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function StorefrontLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <ProductGridSkeleton count={6} />
    </div>
  );
}
