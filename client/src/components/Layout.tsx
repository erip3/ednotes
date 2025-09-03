import { useEffect, useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { useLoadingContext } from "../context/useLoadingContext";
import { useCategoryContext } from "../context/useCategoryContext";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

/**
 * Layout component that wraps the main content with a sidebar.
 * @returns JSX.Element
 */
function Layout() {
  const { registerLoader, setLoaderDone } = useLoadingContext(); // Get loading context

  // Get the category or article ID from the URL if present
  const categoryMatch = useMatch("/category/:id");
  const articleMatch = useMatch("/article/:id");
  const id = categoryMatch?.params.id || articleMatch?.params.id;

  const { setSelectedCategory, selectedTopic, setSelectedTopic } =
    useCategoryContext(); // Get the category context

  const [isTopic, setIsTopic] = useState(false); // Track if the current category is a topic

  useEffect(() => {
    const id = Math.random();
    console.log("Layout mounted", { id });
    return () => console.log("Layout unmounted", { id });
  }, []);

  // Update the selected category and topic when the ID changes
  useEffect(() => {
    if (!id) {
      // If there is no ID, reset the selected category and topic
      setSelectedCategory(null);
      setSelectedTopic(null);
      setIsTopic(false);
      return;
    }

    const numId = Number(id);

    if (categoryMatch) {
      // If the current match is a category, set the selected category
      setSelectedCategory(numId);

      // Fetch category details to determine if it's a topic and get its topic ID
      const loaderId = registerLoader();
      fetch(`/api/categories/${numId}`)
        .then((res) => res.json())
        .then((category) => {
          setSelectedTopic(category?.topicId ?? null);
          setIsTopic(category?.isTopic);
        })
        .finally(() => setLoaderDone(loaderId));
    } else if (articleMatch) {
      // If the current match is an article, set the selected topic
      const loaderId = registerLoader();
      fetch(`/api/articles/${numId}`)
        .then((res) => res.json())
        .then((article) => {
          if (article?.categoryId) {
            setSelectedCategory(article.categoryId);
            return fetch(`/api/categories/${article.categoryId}`)
              .then((res) => res.json())
              .then((category) => {
                setSelectedTopic(category?.topicId ?? null);
                setIsTopic(category?.isTopic);
              });
          } else {
            setSelectedCategory(null);
            setSelectedTopic(null);
            setIsTopic(false);
          }
        })
        .finally(() => setLoaderDone(loaderId));
    }
  }, []);

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

export default Layout;
