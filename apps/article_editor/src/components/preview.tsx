import React from "react";
import type { ArticleBlock } from "@/features/articles/types/article-content";
import { ArticleRenderer } from "@/features/articles/components/article-renderer";

interface PreviewProps {
  blocks: ArticleBlock[];
}

export const Preview: React.FC<PreviewProps> = ({ blocks }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-marginal-border bg-marginal-background px-6 py-4 sticky top-0 z-10">
        <h2 className="font-semibold text-foreground">Live Preview</h2>
      </div>
      <div className="flex-1 overflow-auto dark:bg-dark bg-light">
        {/* Simulate the article page layout matching ContentLayout */}
        <main className="flex min-h-full flex-col pt-4 sm:pt-6 md:pt-8">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8">
            <ArticleRenderer content={JSON.stringify(blocks)} />
          </div>
        </main>
      </div>
    </div>
  );
};
