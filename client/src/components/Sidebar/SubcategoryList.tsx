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
}

interface SubcategoryListProps {
  children?: Category[];
  depth?: number;
}

export default function SubcategoryList({
  children,
  depth = 0,
}: SubcategoryListProps) {
  return (
    <div
      className={styles.sidebarList}
      style={{ "--depth": depth } as React.CSSProperties}
    >
      <hr className={styles.sidebarDivider} />
      <span className={styles.arrow} /> {/* empty, just for alignment */}
      <label>Subcategories</label>
      {children!.map((child) => (
        <SidebarCategory key={child.id} category={child} depth={depth + 1} />
      ))}
    </div>
  );
}
