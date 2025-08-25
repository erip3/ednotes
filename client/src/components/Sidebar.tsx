import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarCategory from "./SidebarCategory";
import styles from "./Sidebar.module.css";

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
    <path d="M3 12L12 4L21 12Z" />
    <rect x="6" y="12" width="12" height="8" />
    <rect x="11" y="16" width="2" height="4" />
  </svg>
);

interface Article {
  id: number;
  title: string;
}
interface Category {
  id: number;
  name: string;
  children?: Category[];
  articles?: Article[];
  comingSoon?: boolean;
}

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/navigation/tree")
      .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <h2 style={{ marginTop: 0 }}>Categories</h2>
        <Link to="/" className={styles.home}>
          <HomeIcon />
        </Link>
      </div>
      {categories.map((cat) => (
        <SidebarCategory key={cat.id} category={cat} />
      ))}
    </aside>
  );
}