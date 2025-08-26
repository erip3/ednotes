import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface SidebarArticleProps {
  id: number;
  title: string;
}

export default function SidebarArticle({ id, title }: SidebarArticleProps) {
  return (
    <div
      className={styles.articleHeader}
    >
      <span className={styles.arrow} /> {/* empty for alignment */}
      <Link to={`/article/${id}`}>{title}</Link>
    </div>
  );
}