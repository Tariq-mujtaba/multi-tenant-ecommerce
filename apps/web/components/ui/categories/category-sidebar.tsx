"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Category } from "@/components/ui/category-nav";

interface CategorySidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

const CategorySidebar = ({
  open,
  onOpenChange,
  categories,
}: CategorySidebarProps) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const visibleCategories = categories.filter((cat) => cat.name !== "all");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setActiveCategory(null);
    onOpenChange(isOpen);
  };

  const isSubView = activeCategory !== null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 w-80 border-r-2 border-border flex flex-col gap-0 overflow-hidden transition-colors duration-50"
        style={{ backgroundColor: isSubView ? "#000" : undefined }}
      >
        {/* Header */}
        {isSubView ? (
          <SheetHeader className="px-4 py-4 border-b-2 border-white/20 flex-row items-center gap-3 space-y-0">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-white hover:text-white/70 transition-colors duration-50"
              aria-label="Back to categories"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <SheetTitle className="text-left font-bold text-lg text-white">
              {activeCategory.displayName}
            </SheetTitle>
          </SheetHeader>
        ) : (
          <SheetHeader className="px-4 py-4 border-b-2 border-border">
            <SheetTitle className="text-left font-bold text-lg">
              All Categories
            </SheetTitle>
          </SheetHeader>
        )}

        <ScrollArea className="flex-1">
          <nav>
            {isSubView ? (
              <>
                {/* Back item */}
                <button
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-white/60 border-b border-white/10 hover:text-white hover:bg-white/5 transition-colors duration-50"
                >
                  <ArrowLeftIcon size={14} />
                  Back to all categories
                </button>

                {/* Subcategories */}
                {activeCategory.children?.map((child) => (
                  <Link
                    key={child.id}
                    href={`/`}
                    className="block px-6 py-3.5 text-sm font-medium text-white border-b border-white/10 hover:bg-white/10 transition-colors duration-50"
                  >
                    {child.displayName}
                  </Link>
                ))}
              </>
            ) : (
              visibleCategories.map((category) => {
                const hasChildren =
                  category.children && category.children.length > 0;
                return hasChildren ? (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold border-b-2 border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
                    style={{ borderLeftColor: category.color, borderLeftWidth: 4 }}
                  >
                    {category.displayName}
                    <ChevronRightIcon size={16} className="text-foreground/50" />
                  </button>
                ) : (
                  <Link
                    key={category.id}
                    href={`/`}
                    className="flex items-center w-full px-4 py-3 text-sm font-semibold border-b-2 border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
                    style={{ borderLeftColor: category.color, borderLeftWidth: 4 }}
                  >
                    {category.displayName}
                  </Link>
                );
              })
            )}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySidebar;
