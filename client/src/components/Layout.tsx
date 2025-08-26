import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

/**
 * Layout component that wraps the main content with a sidebar.
 * @returns JSX.Element
 */
function Layout() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetch("/api/categories/top-level")
      .then((res) => res.json())
      .then((categories) => {
        if (categories.length > 0) setSelectedCategoryId(categories[0].id);
      });
  }, []);

  return (
    <div>
      <Header
        onSelectCategory={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />
      <Sidebar parentCategoryId={selectedCategoryId} />
      <main
        style={{
          marginLeft: 260, // same as sidebar width
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
