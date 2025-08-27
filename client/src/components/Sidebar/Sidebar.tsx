import { useEffect, useState } from "react";
import { useCategoryContext } from "../../context/useCategoryContext";
import SubcategoryList from "./SubcategoryList";
import ArticleList from "./ArticleList";
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

/**
 * Sidebar component for displaying categories and articles.
 * @param props - Props containing the parent category ID and name.
 * @returns JSX.Element
 */
export default function Sidebar() {
  const { selectedTopic } = useCategoryContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [topicName, setTopicName] = useState<string>("");

  // Fetch topic name
  useEffect(() => {
    if (selectedTopic) {
      fetch(`/api/categories/${selectedTopic}`)
        .then((res) => res.json())
        .then((cat) => setTopicName(cat.name));
    } else {
      setTopicName("");
    }
  }, [selectedTopic]);

  // Fetch subcategories
  useEffect(() => {
    if (selectedTopic) {
      fetch(`/api/categories/${selectedTopic}/children`)
        .then((res) => res.json())
        .then(setCategories);
    } else {
      setCategories([]);
    }
  }, [selectedTopic]);

  // Fetch articles
  useEffect(() => {
    if (selectedTopic) {
      fetch(`/api/articles/category/${selectedTopic}`)
        .then((res) => res.json())
        .then(setArticles);
    } else {
      setArticles([]);
    }
  }, [selectedTopic]);

  return (
    <aside className={styles.sidebar}>
      <h2>{topicName}</h2>
      <SubcategoryList categories={categories} />
      <ArticleList articles={articles} />
    </aside>
  );
}