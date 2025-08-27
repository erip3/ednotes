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
  categories?: Category[];
}
  
export default function SubcategoryList({
  categories,
}: SubcategoryListProps) {
  return (
    <div className={styles.sidebarList}>
      <label>Subcategories</label>
      {categories!.map((child) => (
        <SidebarCategory key={child.id} category={child} />
      ))}
    </div>
  );
}
