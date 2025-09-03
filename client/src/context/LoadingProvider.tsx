import React, { useState, useCallback, useRef, useMemo } from "react";
import { LoadingContext } from "./LoadingContext";

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeLoaders, setActiveLoaders] = useState<Set<number>>(new Set());
  const nextId = useRef(1);

  const registerLoader = useCallback(() => {
    const id = nextId.current++;
    setActiveLoaders((prev) => new Set(prev).add(id));
    return id;
  }, []);

  const setLoaderDone = useCallback((id: number) => {
    setActiveLoaders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isLoading = activeLoaders.size > 0;

  const value = useMemo(
    () => ({ registerLoader, setLoaderDone, isLoading }),
    [registerLoader, setLoaderDone, isLoading]
  );

  return (
    <LoadingContext.Provider
      value={value}
    >
      {children}
    </LoadingContext.Provider>
  );
};
