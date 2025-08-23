import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

// Article interface representing a blog article
interface Article {
  id: number;
  title: string;
}

// Category interface representing a blog category
interface Category {
  id: number;
  name: string;
  children?: Category[]; 
  articles?: Article[];
}

// Simple home SVG icon
const HomeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-icon, currentColor)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    {/* Roof */}
    <path d="M3 12L12 4L21 12Z" />
    {/* House body */}
    <rect x="6" y="12" width="12" height="8" />
    {/* Door */}
    <rect x="11" y="16" width="2" height="4" />
  </svg>
);

/**
 * Sidebar component that displays the navigation categories.
 * @returns JSX.Element
 */
function Sidebar() {
    const [categories, setCategories] = useState<Category[]>([]); // Initialize categories state
    const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({}); // Initialize expanded state for each category
    const location = useLocation(); // Get current location

    // Fetch categories from API
    useEffect(() => {
        fetch("/api/navigation/tree")
            .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
            .then(setCategories)
            .catch((err) => console.error("Failed to load categories:", err));
    }, []);

    // Toggle category expansion
    const toggle = (id: number) => {
        setExpanded((e) => ({ ...e, [id]: !e[id] }));
    };

    // Render a category when expanded
    const renderCategory = (cat: Category) => (
      <div key={cat.id} className={styles.categoryContainer}>
        {/* Category Header */}
        <div className={styles.categoryHeader}>
          <span
            className={styles.arrow}
            onClick={(e) => {
              e.stopPropagation();
              toggle(cat.id);
            }}
          >
            {cat.children && cat.children.length > 0
              ? expanded[cat.id]
                ? "▼"
                : "▶"
              : ""}
          </span>
          <Link
            to={`/category/${cat.id}`}
            className={`${styles.category} ${
              location.pathname.includes(`/category/${cat.id}`)
                ? styles.active
                : ""
            }`}
          >
            {cat.name}
          </Link>
        </div>
        {expanded[cat.id] && (
          <div className={styles.children}>
            {cat.children && cat.children.map(renderCategory)}
            {cat.articles &&
              cat.articles.map((article) => (
                <div key={article.id} className={styles.article}>
                  <Link to={`/article/${article.id}`}>{article.title}</Link>
                </div>
              ))}
          </div>
        )}
      </div>
    );

    return (
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <h2 style={{ marginTop: 0 }}>Categories</h2>
          <Link to="/" className={styles.home}>
            <HomeIcon />
          </Link>
        </div>
        {categories.map(renderCategory)}
      </aside>
    );
}

export default Sidebar;