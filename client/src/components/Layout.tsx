import { useEffect, useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCategoryContext } from "../context/useCategoryContext";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

/**
 * Layout component that wraps the main content with a sidebar.
 * @returns JSX.Element
 */
export default function Layout() {
  // Get the category or article ID from the URL if present
  const categoryMatch = useMatch("/category/:id");
  const articleMatch = useMatch("/article/:id");
  const id = categoryMatch?.params.id || articleMatch?.params.id;

  const { setSelectedCategory, selectedTopic, setSelectedTopic } =
    useCategoryContext(); // Get the category context

  const [isTopic, setIsTopic] = useState(false); // Track if the current category is a topic

  // Fetch category if on a category route
  const { data: categoryData, isSuccess: isCategorySuccess } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await axios.get(`/api/categories/${id}`);
      return res.data;
    },
    enabled: !!(id && categoryMatch),
  });

  // Fetch article if on an article route
  const { data: articleData, isSuccess: isArticleSuccess } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const res = await axios.get(`/api/articles/${id}`);
      return res.data;
    },
    enabled: !!(id && articleMatch),
  });

  // Fetch category for article's categoryId if on article route and articleData is loaded
  const { data: articleCategoryData, isSuccess: isArticleCategorySuccess } =
    useQuery({
      queryKey: ["category", articleData?.categoryId],
      queryFn: async () => {
        const res = await axios.get(
          `/api/categories/${articleData.categoryId}`
        );
        return res.data;
      },
      enabled: !!(articleData?.categoryId && articleMatch && isArticleSuccess),
    });

  // Update the selected category and topic when the ID changes
  useEffect(() => {
    if (!id) {
      // If there is no ID, reset the selected category and topic
      setSelectedCategory(null);
      setSelectedTopic(null);
      setIsTopic(false);
      return;
    }

    if (categoryMatch && isCategorySuccess && categoryData) {
      // If the current match is a category, set the selected category
      setSelectedCategory(Number(id));
      setSelectedTopic(categoryData?.topicId ?? null);
      setIsTopic(categoryData?.isTopic ?? false);
    } else if (articleMatch && isArticleSuccess && articleData) {
      // If the current match is an article, set the selected topic
      if (articleData?.categoryId) {
        setSelectedCategory(articleData.categoryId);
        if (isArticleCategorySuccess && articleCategoryData) {
          setSelectedTopic(articleCategoryData?.topicId ?? null);
          setIsTopic(articleCategoryData?.isTopic ?? false);
        }
      } else {
        setSelectedCategory(null);
        setSelectedTopic(null);
        setIsTopic(false);
      }
    }
    // eslint-disable-next-line
  }, [
    id,
    categoryMatch,
    isCategorySuccess,
    categoryData,
    articleMatch,
    isArticleSuccess,
    articleData,
    isArticleCategorySuccess,
    articleCategoryData,
    setSelectedCategory,
    setSelectedTopic,
  ]);

  // If there is a selected topic or the selected category is a topic, show the sidebar
  const showSidebar = selectedTopic !== null || isTopic;

  return (
    <div>
      <Header />
      {showSidebar && <Sidebar />}
      <main
        style={{
          marginLeft: showSidebar ? 260 : 0,
          padding: 32,
          background: "var(--color-bg)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
