import React, { useState, useEffect } from "react";
import type { ArticleBlock } from "@/features/articles/types/article-content";
import { Editor } from "./components/editor";
import { Preview } from "./components/preview";
import { useLocalStorage } from "./hooks/use-local-storage";
import { useDraftSave } from "./hooks/use-draft-save";
import { fetchArticle } from "./api/articles";
import { useTheme } from "./hooks/use-theme";

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [blocks, setBlocks] = useLocalStorage<ArticleBlock[]>(
    "article-draft-blocks",
    []
  );
  const [metadata, setMetadata] = useLocalStorage<{
    title: string;
    description: string;
    parentId?: number | null;
  }>("article-draft-metadata", { title: "", description: "", parentId: null });

  const { saveStatus, lastSaved, saveDraft, uploadToDB } = useDraftSave();
  const [isUploading, setIsUploading] = useState(false);
  const [articleIdInput, setArticleIdInput] = useState<string>(
    localStorage.getItem("article-draft-id") || ""
  );
  const [currentArticleId, setCurrentArticleId] = useState<number | null>(
    articleIdInput ? Number(articleIdInput) : null
  );

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Auto-save draft every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft(blocks, metadata, currentArticleId);
    }, 10000);
    return () => clearInterval(timer);
  }, [blocks, metadata, currentArticleId, saveDraft]);

  const handleBlocksChange = (newBlocks: ArticleBlock[]) => {
    setBlocks(newBlocks);
  };

  const handleMetadataChange = (
    field: "title" | "description" | "parentId",
    value: string | number | null
  ) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!metadata.title.trim()) {
      alert("Please enter an article title");
      return;
    }
    setIsUploading(true);
    try {
      await uploadToDB(blocks, metadata, currentArticleId ?? undefined);
      // Clear draft after successful upload
      if (currentArticleId == null) {
        setBlocks([]);
        setMetadata({ title: "", description: "", parentId: null });
        setArticleIdInput("");
        setCurrentArticleId(null);
        localStorage.removeItem("article-draft-id");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadArticle = async () => {
    const id = Number(articleIdInput);
    if (!id || Number.isNaN(id)) {
      alert("Enter a valid numeric article ID");
      return;
    }
    try {
      const article = await fetchArticle(id);
      // Populate blocks and metadata from response
      const parsedBlocks: ArticleBlock[] = JSON.parse(article.content || "[]");
      setBlocks(parsedBlocks);
      setMetadata({
        title: article.title || "",
        description: metadata.description || "",
        parentId: article.categoryId ?? null,
      });
      setCurrentArticleId(id);
      localStorage.setItem("article-draft-id", String(id));
    } catch (err) {
      console.error("Failed to load article", err);
      alert("Could not load article. Check ID and try again.");
    }
  };

  const handleNewArticle = () => {
    setBlocks([]);
    setMetadata({ title: "", description: "", parentId: null });
    setArticleIdInput("");
    setCurrentArticleId(null);
    localStorage.removeItem("article-draft-id");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-marginal-border bg-marginal-background px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Article Editor
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-muted-border bg-primary-background px-4 py-2 font-medium text-foreground hover:opacity-80"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={articleIdInput}
                onChange={(e) => setArticleIdInput(e.target.value)}
                placeholder="Article ID"
                className="w-28 rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
              />
              <button
                onClick={handleLoadArticle}
                className="rounded-lg border border-muted-border bg-primary-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
              >
                Load
              </button>
              <button
                onClick={handleNewArticle}
                className="rounded-lg border border-muted-border bg-primary-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
              >
                New
              </button>
              {currentArticleId != null && (
                <span className="text-xs text-muted-foreground">
                  Editing ID: {currentArticleId}
                </span>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload to Database"}
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto border-r border-marginal-border">
          <Editor
            blocks={blocks}
            metadata={metadata}
            onBlocksChange={handleBlocksChange}
            onMetadataChange={handleMetadataChange}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <Preview blocks={blocks} />
        </div>
      </div>
    </div>
  );
};
