import React from "react";

// Simple SVG icon (folder)
const DefaultIcon = () => (
  <svg
    width="32"
    height="32"
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

interface CategoryCardProps {
  name: string;
}

// CategoryCard component displays a single category.
const CategoryCard: React.FC<CategoryCardProps> = ({ name }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      minWidth: 160,
      minHeight: 140,
      boxShadow: "0 5px 15px var(--color-accent, #00da24)",
      background: "var(--color-bg-card, #303c32)",
      margin: 8,
      cursor: "pointer",
      transition: "box-shadow 0.2s",
    }}
  >
    <DefaultIcon />
    <span style={{ marginTop: 12, fontWeight: 500, fontSize: 18 }}>{name}</span>
  </div>
);

export default CategoryCard;
