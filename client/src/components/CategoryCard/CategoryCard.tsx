import React, { useState, type JSX } from "react";
import DefaultIcon from "./Icons/DefaultIcon";
import styles from "./CategoryCard.module.css";
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={
        styles.categoryCard + (comingSoon ? ` ${styles.comingSoon}` : "")
      }
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-disabled={comingSoon}
      style={
        {
          cursor: comingSoon ? "not-allowed" : "pointer",
          pointerEvents: comingSoon ? "none" : "auto",
          opacity: comingSoon ? 0.5 : 1,
          "--color-accent": accentColor || "#00da2465", // fallback color
        } as React.CSSProperties
      }
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!comingSoon && e.key === "Enter" && onClick) onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon ? icon() : <DefaultIcon />}
      <CategoryLabel name={name} comingSoon={comingSoon} hovered={hovered} />
    </div>
  );
};

export default CategoryCard;