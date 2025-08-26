import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "./HomeIcon";

interface Category {
  id: number;
  name: string;
}

interface HeaderProps {
  onSelectCategory: (id: number) => void;
  selectedCategoryId: number | null;
}

export default function Header({
  onSelectCategory,
  selectedCategoryId,
}: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories/top-level")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  return (
    <header
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        height: 56,
        background: "#222",
        color: "#fff",
        padding: "0 32px",
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          style={{
            background:
              selectedCategoryId === cat.id ? "#ffd700" : "transparent",
            color: selectedCategoryId === cat.id ? "#222" : "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: 18,
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {cat.name}
        </button>
      ))}
    </header>
  );
}
