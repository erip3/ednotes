import { useEffect, useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { useCategoryContext } from "../context/useCategoryContext";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

/**
 * Layout component that wraps the main content with a sidebar.
 * @returns JSX.Element
 */
function Layout() {
  // Get the category or article ID from the URL if present
  const categoryMatch = useMatch("/category/:id");
  const articleMatch = useMatch("/article/:id");
  const id = categoryMatch?.params.id || articleMatch?.params.id;

  const { setSelectedCategory, selectedTopic, setSelectedTopic } =
    useCategoryContext(); // Get the category context

  const [isTopic, setIsTopic] = useState(false); // Track if the current category is a topic

  // Update the selected category and topic when the ID changes
  useEffect(() => {
    if (id) {
      const numId = Number(id);
      setSelectedCategory(numId);

      // Fetch category details to determine if it's a topic and get its topic ID
      fetch(`/api/categories/${numId}`)
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
  }, [id, setSelectedCategory, setSelectedTopic]);

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
