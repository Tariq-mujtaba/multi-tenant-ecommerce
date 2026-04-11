import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Category } from "./category-nav";
import { cn } from "@/lib/utils";
import { useDropDownPosition } from "../hooks/use-dropdown-position";
import SubcategoryMenu from "./categories/subcategory-menu";

interface CategoryDropDownProps {
  category: Category;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

const CategoryDropDown = ({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getDropDownPosition } = useDropDownPosition(dropdownRef);
  const position = getDropDownPosition();

  const onMouseEnter = () => {
    if (category.children?.length > 0) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };
  return (
    <div
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative"
    >
      <div className="relative">
        <Button
          className={cn(
            "font-medium text-base border px-4 py-1 bg-transparent border-transparent rounded-full hover:bg-white hover:border-foreground text-black mb-1.5",
            isActive && !isNavigationHovered && "bg-white border-foreground ",
          )}
        >
          {category.displayName}
        </Button>
      </div>

      {category.children.length > 0 && (
        <div
          className={cn(
            "absolute opacity-0 -bottom-3 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-b-12 border-b-black left-1/2 -translate-x-1/2",
            isOpen && "opacity-100 ",
          )}
        />
      )}

      {category.children.length > 0 && (
        <SubcategoryMenu
          category={category}
          isOpen={isOpen}
          position={position}
        />
      )}
    </div>
  );
};

export default CategoryDropDown;
