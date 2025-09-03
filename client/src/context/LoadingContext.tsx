// src/context/LoadingContext.tsx
import { createContext } from "react";

interface LoadingContextType {
  registerLoader: () => number;
  setLoaderDone: (id: number) => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export { LoadingContext };