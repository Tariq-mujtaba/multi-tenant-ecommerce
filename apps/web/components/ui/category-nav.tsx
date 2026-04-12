"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CategoryDropDown from "./category-dropdown";
import CategorySidebar from "./categories/category-sidebar";
import { Button } from "./button";
import { ListFilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChildCategory {
  id: string;
  name: string;
  displayName: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  color: string;
  children: ChildCategory[];
}

interface CategoryNavProps {
  categories: Category[];
}

const GAP = 16; // matches gap-4 in the visible container

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState<Category | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = "all";
  const activeCategoryIndex = categories.findIndex(
    (cat) => cat.name === activeCategory,
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  const calculateVisibleCategories = useCallback(() => {
    if (!containerRef.current || !measureRef.current || !viewAllRef.current)
      return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const viewAllWidth = viewAllRef.current.getBoundingClientRect().width;
    const availableWidth = containerWidth - viewAllWidth;

    const items = Array.from(measureRef.current.children) as HTMLDivElement[];

    let totalWidth = 0;
    let visible = 0;

    for (let i = 0; i < items.length; i++) {
      const width = items[i].getBoundingClientRect().width + (i > 0 ? GAP : 0);
      if (totalWidth + width > availableWidth) break;
      totalWidth += width;
      visible++;
    }

    setVisibleCount(visible);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(calculateVisibleCategories);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [categories.length, calculateVisibleCategories]);

  return (
    <div className="relative w-full" onMouseLeave={() => setActive(null)}>
      {/* Hidden container for measuring category widths */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex items-center flex-nowrap gap-4"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {categories.map((cat) => (
          <CategoryDropDown
            key={cat.id}
            category={cat}
            isActive={activeCategory === cat.name}
            isNavigationHovered={active !== null}
          />
        ))}
      </div>

      {/* Visible categories */}
      <div
        ref={containerRef}
        className="flex items-center flex-nowrap gap-4"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {categories?.slice(0, visibleCount)?.map((cat) => (
          <CategoryDropDown
            key={cat.id}
            category={cat}
            isActive={activeCategory === cat.name}
            isNavigationHovered={isAnyHovered}
          />
        ))}

        {categories?.length > 0 && (
          <div ref={viewAllRef}>
            <Button
              className={cn(
                "font-medium text-base border px-4 py-1 bg-transparent border-transparent rounded-full hover:bg-white hover:border-foreground text-black mb-1.5",
                isActiveCategoryHidden &&
                  !isAnyHovered &&
                  "bg-white border-foreground ",
              )}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="View all categories"
            >
              <span>View all</span>
              <ListFilterIcon size={16} />
            </Button>
          </div>
        )}
      </div>
      <CategorySidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        categories={categories}
      />
    </div>
  );
}
