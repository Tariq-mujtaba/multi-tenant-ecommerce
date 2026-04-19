import { CategoryNav, type Category } from "@/components/ui/category-nav";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const categories = await res.json();

    const allCategories = [
      { id: "all", name: "all", displayName: "All", children: [] },
      ...categories,
    ];
    return allCategories;
  } catch {
    return [];
  }
}

export default async function CategoriesBar() {
  const categories = await getCategories();

  return (
    <>
      {categories.length > 0 && (
        <section className="border-b-2 border-border bg-secondary-background overflow-visible relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
            <CategoryNav categories={categories} />
          </div>
        </section>
      )}
    </>
  );
}
