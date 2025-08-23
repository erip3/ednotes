import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

/**
 * Layout component that wraps the main content with a sidebar.
 * @returns JSX.Element
 */
function Layout() {
  return (
    <div>
      <Sidebar />
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
