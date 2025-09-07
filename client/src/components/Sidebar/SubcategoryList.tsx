import SidebarCategory from "./SidebarCategory";

interface Article {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
  articles?: Article[];
}

interface SubcategoryListProps {
  categories?: Category[];
  subcategoryArticlesMap?: Record<number, Article[]>;
}

export default function SubcategoryList({
  categories,
  subcategoryArticlesMap = {},
}: SubcategoryListProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2 px-2">
        Subcategories
      </label>
      <div className="flex flex-col gap-1">
        {categories &&
          categories.map((child) => (
            <SidebarCategory
              key={child.id}
              category={child}
              articles={subcategoryArticlesMap[child.id] ?? []}
            />
          ))}
      </div>
    </div>
  );
}
