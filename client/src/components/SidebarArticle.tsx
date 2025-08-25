import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface SidebarArticleProps {
  id: number;
  title: string;
  depth?: number;
}

export default function SidebarArticle({ id, title, depth }: SidebarArticleProps) {
  return (
    <div style={{ paddingLeft: depth ? depth * 16 : 0 }}>
      <Link to={`/article/${id}`}>{title}</Link>
    </div>
  );
}
