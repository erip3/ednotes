import { useEffect, useState } from "react";
import SidebarCategory from "./SidebarCategory";
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
  comingSoon?: boolean;
}

interface SidebarProps {
  parentCategoryId: number | null;
}

export default function Sidebar({ parentCategoryId }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (parentCategoryId) {
      fetch(`/api/categories/${parentCategoryId}/children`)
        .then((res) => res.json())
        .then(setCategories);
    } else {
      setCategories([]);
    }
  }, [parentCategoryId]);

  return (
    <aside
      style={{
        width: 260,
        position: "fixed",
        top: 56,
        left: 0,
        bottom: 0,
        background: "#181818",
        color: "#fff",
        overflowY: "auto",
      }}
    >
      {categories.map((cat) => (
        <SidebarCategory key={cat.id} category={cat} depth={0} />
      ))}
    </aside>
  );
}