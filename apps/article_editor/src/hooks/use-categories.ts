import { useEffect, useState } from "react";

import type { Category } from "@/types/aliases";

import { fetchChildCategories, fetchTopCategories } from "../api/categories";

type Status = "idle" | "loading" | "error" | "success";

export const useCategories = () => {
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [children, setChildren] = useState<Category[]>([]);
  const [path, setPath] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [childStatus, setChildStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // load top level once
  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    fetchTopCategories()
      .then((cats) => {
        if (!mounted) return;
        setTopCategories(cats);
        setStatus("success");
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message ?? "Failed to load categories");
        setStatus("error");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const loadChildren = async (parentId: number | null) => {
    if (parentId == null) {
      setChildren([]);
      setChildStatus("idle");
      return;
    }
    setChildStatus("loading");
    try {
      const kids = await fetchChildCategories(parentId);
      setChildren(kids);
      setChildStatus("success");
    } catch (err: any) {
      setError(err?.message ?? "Failed to load subcategories");
      setChildStatus("error");
    }
  };

  const selectTop = (id: number | null) => {
    if (id == null) {
      setPath([]);
      setChildren([]);
      return;
    }
    const top = topCategories.find((c) => c.id === id);
    setPath(top ? [top] : []);
    loadChildren(id);
  };

  const selectChild = (id: number | null) => {
    if (id == null) return;
    const child = children.find((c) => c.id === id);
    if (!child) return;
    setPath((prev) => [...prev, child]);
    loadChildren(id);
  };

  const goUp = () => {
    setPath((prev) => {
      if (prev.length === 0) {
        setChildren([]);
        return prev;
      }
      if (prev.length === 1) {
        loadChildren(prev[0]?.id ?? null);
        return prev;
      }
      const next = prev.slice(0, -1);
      const newParentId = next[next.length - 1]?.id ?? null;
      loadChildren(newParentId);
      return next;
    });
  };

  const reset = () => {
    setPath([]);
    setChildren([]);
  };

  return {
    topCategories,
    children,
    status,
    childStatus,
    error,
    path,
    selectTop,
    selectChild,
    goUp,
    reset,
  };
};
