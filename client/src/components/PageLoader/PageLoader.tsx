import React from "react";
import styles from "./PageLoader.module.css";

interface PageLoaderProps {
  loading: boolean;
  children: React.ReactNode;
}

export default function PageLoader({ loading, children }: PageLoaderProps) {
  if (loading) {
    return (
      <div className={styles.loaderOverlay} />
    );
  }
  return <div className={styles.fadeIn}>{children}</div>;
}
