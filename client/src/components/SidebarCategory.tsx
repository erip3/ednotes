import { Link, useLocation } from "react-router-dom";
import SidebarArticle from "./SidebarArticle";
import styles from "./Sidebar.module.css";
import { useState } from "react";

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
  const isExpandable = (hasChildren || hasArticles)

  return (
    <div
      className={styles.categoryContainer}
      style={{ paddingLeft: depth * 8 }}
    >
      <div className={styles.categoryHeader}>
        <span
          className={styles.arrow}
          onClick={(e) => {
            e.stopPropagation();
            if (isExpandable) setExpanded((v) => !v);
          }}
        >
          {isExpandable ? (expanded ? "▼" : "▶") : ""}
        </span>
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
      {expanded && (
        <div className={styles.children}>
          {hasChildren && (
            <div style={{ paddingLeft: depth * 8 }}>
              {category.children!.map((child) => (
                <SidebarCategory
                  key={child.id}
                  category={child}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
          {hasArticles && (
            <div style={{ paddingLeft: depth * 8 }}>
              {category.articles!.map((article) => (
                <SidebarArticle
                  key={article.id}
                  {...article}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
