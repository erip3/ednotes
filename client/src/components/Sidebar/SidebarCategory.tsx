import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface Article {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
  articles?: Article[];
}

interface SidebarCategoryProps {
  category: Category;
}

export default function SidebarCategory({
  category,
}: SidebarCategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const hasChildren = category.children && category.children.length > 0;
  const hasArticles = category.articles && category.articles.length > 0;
  const isExpandable = hasChildren || hasArticles;

  return (
    <div className={styles.categoryContainer}>
      <div
        className={styles.categoryHeader}
      >
        {/* Expansion Arrow */}
        <span
          className={styles.arrow}
          onClick={(e) => {
            e.stopPropagation();
            if (isExpandable) setExpanded((v) => !v);
          }}
        >
          {isExpandable ? (expanded ? "▼" : "▶") : ""}
        </span>

        {/* Category Link */}
        <Link
          to={`/category/${category.id}`}
          className={`${styles.category} ${
            location.pathname.includes(`/category/${category.id}`)
              ? styles.active
              : ""
          }`}
        >
          {category.name}
        </Link>
      </div>
    </div>
  );
}
