import React from "react";
import styles from "./CategoryCard.module.css";

// Simple folder SVG icon
const DefaultIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
);

// Props for the CategoryCard component
interface CategoryCardProps {
  name: string;
  onClick?: () => void;
}

// CategoryCard component displays a single category.
const CategoryCard: React.FC<CategoryCardProps> = ({ name, onClick }) => (
  <div
    className={styles["category-card"]}
    onClick={onClick}
    tabIndex={0}
    role="button"
    onKeyDown={(e) => {
      if (e.key === "Enter" && onClick) onClick();
    }}
  >
    <DefaultIcon />
    <span style={{ marginTop: 12, fontWeight: 500, fontSize: 18 }}>{name}</span>
  </div>
);

export default CategoryCard;