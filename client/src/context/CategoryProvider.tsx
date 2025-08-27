import React, { useState } from "react";
import { CategoryContext } from "./CategoryContext";

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedTopic,
        setSelectedTopic,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
