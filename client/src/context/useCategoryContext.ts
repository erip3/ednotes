import { useContext } from "react";
import { CategoryContext } from "./CategoryContext";

export function useCategoryContext() {
  const ctx = useContext(CategoryContext);
  if (!ctx)
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  return ctx;
}
