import { useState, useCallback } from "react";
import type { ArticleBlock } from "@/features/articles/types/article-content";
import { uploadArticle, updateArticle } from "../api/articles";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export const useDraftSave = () => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveDraft = useCallback(
    async (
      blocks: ArticleBlock[],
      metadata: {
        title: string;
        description: string;
        parentId?: number | null;
      },
      articleId?: number | null
    ) => {
      setSaveStatus("saving");
      try {
        // Save to localStorage automatically
        localStorage.setItem("article-draft-blocks", JSON.stringify(blocks));
        localStorage.setItem(
          "article-draft-metadata",
          JSON.stringify(metadata)
        );
        localStorage.setItem(
          "article-draft-id",
          articleId != null ? String(articleId) : ""
        );

        setLastSaved(new Date());
        setSaveStatus("saved");

        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (error) {
        console.error("Failed to save draft:", error);
        setSaveStatus("error");
      }
    },
    []
  );

  const uploadToDB = useCallback(
    async (
      blocks: ArticleBlock[],
      metadata: {
        title: string;
        description: string;
        parentId?: number | null;
      },
      articleId?: number | null
    ) => {
      setSaveStatus("saving");
      try {
        const payload = {
          title: metadata.title,
          content: JSON.stringify(blocks),
          categoryId: metadata.parentId ?? null,
        };
        const result =
          articleId != null
            ? await updateArticle(articleId, payload)
            : await uploadArticle(payload);
        setLastSaved(new Date());
        setSaveStatus("saved");
        alert(
          articleId != null
            ? `Article ${articleId} updated successfully!`
            : `Article uploaded successfully! ID: ${result.id}`
        );
        setTimeout(() => setSaveStatus("idle"), 3000);
        return result;
      } catch (error) {
        console.error("Failed to upload article:", error);
        setSaveStatus("error");
        alert("Failed to upload article. Check console for details.");
        throw error;
      }
    },
    []
  );

  return { saveStatus, lastSaved, saveDraft, uploadToDB };
};
