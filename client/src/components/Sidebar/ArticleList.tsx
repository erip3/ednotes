import SidebarArticle from "./SidebarArticle";
import styles from "./Sidebar.module.css";

interface Article {
    id: number;
    title: string;
}

interface ArticleListProps {
    articles?: Article[];
    depth?: number;
}

export default function ArticleList({ 
    articles, 
    depth = 0
}: ArticleListProps) {
  return (
    <div
      className={styles.sidebarList}
      style={{ "--depth": depth } as React.CSSProperties}
    >
      <hr className={styles.sidebarDivider} />
      <span className={styles.arrow} /> {/* empty, just for alignment */}
      <label className={styles.label}>Articles</label>
      {articles!.map((article) => (
        <SidebarArticle key={article.id} {...article} />
      ))}
    </div>
  );
}