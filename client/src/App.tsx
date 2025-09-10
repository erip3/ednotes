import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CategoryProvider } from "./context/CategoryProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Article from "./pages/Article";
import Personal from "./pages/Personal";

const queryClient = new QueryClient();

/**
 * Main application component.
 * @returns JSX.Element
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CategoryProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/article/:id" element={<Article />} />
            </Route>
          </Routes>
        </CategoryProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
