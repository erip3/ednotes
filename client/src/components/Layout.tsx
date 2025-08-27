import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useCategoryContext } from "../context/useCategoryContext";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

/**
 * Layout component that wraps the main content with a sidebar.
 * @returns JSX.Element
 */
function Layout() {
  const location = useLocation();
  const {
    setSelectedCategory,
    selectedTopic,
    setSelectedTopic,
  } = useCategoryContext();

  const [isTopic, setIsTopic] = useState(false);

  useEffect(() => {
    // Extract category/article ID from the URL
    const match = location.pathname.match(/\/(category|article)\/(\d+)/);
    if (match) {
      const id = Number(match[2]);
      setSelectedCategory(id);

      // Fetch the topic ancestor for this category/article
      fetch(`/api/categories/${id}`)
        .then((res) => res.json())
        .then((category) => {
          setSelectedTopic(category?.topicId ?? null); // Set selected topic based on category data
          setIsTopic(category?.isTopic ?? false); // Set isTopic based on category data
        });
    } else {
      setSelectedCategory(null);
      setSelectedTopic(null);
      setIsTopic(false);
    }
  }, [location.pathname, setSelectedCategory, setSelectedTopic]);

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
