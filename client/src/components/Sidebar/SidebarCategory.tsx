import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SubcategoryList from "./SubcategoryList";
import ArticleList from "./ArticleList";
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
  depth?: number;
}

export default function SidebarCategory({
  category,
  depth = 0,
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
        style={{ "--depth": depth } as React.CSSProperties}
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

      {/* Subcategories and Articles */}
      {expanded && (
        <div className={styles.children}>
          {hasChildren && (
            <SubcategoryList children={category.children} depth={depth + 1} />
          )}
          {hasArticles && (
            <ArticleList articles={category.articles} depth={depth + 1} />
          )}
        </div>
      )}
    </div>
  );
}
