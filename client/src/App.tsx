import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Article from "./pages/Article";

/**
 * Main application component.
 * @returns JSX.Element
 */
function App() {
  return (
    <BrowserRouter>
      <CategoryProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/article/:id" element={<Article />} />
          </Route>
        </Routes>
      </CategoryProvider>
    </BrowserRouter>
  );
}

export default App;
