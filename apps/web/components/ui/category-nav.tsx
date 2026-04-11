"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import CategoryDropDown from "./category-dropdown"

interface ChildCategory {
  id: string
  name: string
  displayName: string
}

export interface Category {
  id: string
  name: string
  displayName: string
  color: string
  children: ChildCategory[]
}

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState<Category | null>(null)

  return (
    <div className="relative w-full" onMouseLeave={() => setActive(null)}>
      <div className="flex items-center flex-nowrap gap-4">
        {categories.map((cat) => (
          <CategoryDropDown
            key={cat.id}
            category={cat}
            isActive={active?.id === cat.id}
            isNavigationHovered={active !== null}
          />
        ))}
      </div>
    </div>
  );
}
