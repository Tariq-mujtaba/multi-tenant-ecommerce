import React from "react";
import { Category } from "../category-nav";
import Link from "next/link";

interface SubcategoryMenuProps {
  category: Category;
  isOpen: boolean;
  position: { top: number; left: number };
}

const SubcategoryMenu = ({
  category,
  isOpen,
  position,
}: SubcategoryMenuProps) => {
  if (!isOpen || !category.children || category.children.length === 0)
    return null;

  const backgroundColor = category.color || "#f5f5f5";

  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-60" />
      <div
        style={{ backgroundColor }}
        className="w-60 py-4 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5"
      >
        {category.children.map((child) => (
          <Link
            key={child.name}
            href={`/`}
            className="block w-full text-left px-4 py-2 hover:bg-black/20 hover:text-white underline underline-offset-4 font-medium transition-colors duration-200 ease-in-out"
          >
            {child.displayName}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryMenu;
