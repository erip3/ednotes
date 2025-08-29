import { useEffect, useRef, useState } from "react";
import styles from "./CategoryCard.module.css";

interface CategoryLabelProps {
  name: string;
  comingSoon?: boolean;
  hovered?: boolean;
}

export default function CategoryLabel({
  name,
  comingSoon,
  hovered
}: CategoryLabelProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (outer && inner) {
      if (inner.scrollWidth > outer.clientWidth) {
        setShouldScroll(true);
        setScrollDistance(inner.scrollWidth - outer.clientWidth);
      } else {
        setShouldScroll(false);
        setScrollDistance(0);
      }
    }
  }, [name]);

  // Animation duration: 50px/sec, min 2s, max 6s
  const duration = Math.min(Math.max(scrollDistance / 50, 2), 6);

  return (
    <span className={styles.categoryLabel}>
      <div ref={outerRef} className={styles.categoryNameWrapper}>
        <span
          ref={innerRef}
          className={`${styles.categoryName} ${
            shouldScroll && hovered ? styles.scrolling : ""
          }`}
          style={
            shouldScroll && hovered
              ? ({
                  "--scroll-distance": `-${scrollDistance}px`,
                  "--scroll-duration": `${duration}s`,
                } as React.CSSProperties)
              : undefined
          }
        >
          {name}
        </span>
      </div>
      {comingSoon && (
        <span className={styles.comingSoonLabel}>Unavailable</span>
      )}
    </span>
  );
}
