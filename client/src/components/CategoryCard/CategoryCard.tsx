import React, { type JSX } from "react";
import DefaultIcon from "./Icons/DefaultIcon";
import CategoryLabel from "./CategoryLabel";

// Props for the CategoryCard component
interface CategoryCardProps {
  name: string;
  onClick?: () => void;
  comingSoon?: boolean;
  icon?: () => JSX.Element;
  accentColor?: string;
}

// CategoryCard component displays a single category.
const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  onClick,
  comingSoon,
  icon,
  accentColor,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 w-52 h-44 rounded-xl m-2
      cursor-pointer bg-neutral-700 transition-transform duration-200
      ease-[cubic-bezier(.4,2,.6,1)] will-change-transform will-change-shadow will-change-bg will-change-color
      ${
      comingSoon
        ? "pointer-events-none opacity-50 border border-gray-700 bg-neutral-900 shadow-none text-gray-400"
        : "hover:translate-y-[-6px] hover:scale-[1.04] hover:shadow-[0_8px_24px_var(--accent,rgba(0,218,36,0.4))] active:translate-y-[1px] active:scale-[0.98] active:shadow-[0_2px_8px_var(--accent,rgba(0,218,36,1))]"
      }`}
      style={{ "--accent": accentColor } as React.CSSProperties}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-disabled={comingSoon}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!comingSoon && e.key === "Enter" && onClick) onClick();
      }}
    >
      {icon ? icon() : <DefaultIcon />}
      <CategoryLabel name={name} />
    </div>
  );
};

export default CategoryCard;
