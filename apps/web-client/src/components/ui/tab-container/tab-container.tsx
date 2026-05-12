/**
 * @module components/ui/tab-container
 * @description Pill-style tab switcher that animates panel height and accepts arbitrary content.
 *
 * Usage pattern:
 * <TabContainer
 *   tabs=[
 *     { value: 'a', label: 'A', content: <div>Content A</div> },
 *     { value: 'b', label: 'B', content: <div>Content B</div> },
 *   ]
 *   defaultValue="a"
 * />
 *
 * Notes:
 * - Supports controlled (`value`, `onValueChange`) and uncontrolled (`defaultValue`) modes.
 * - Measures the active panel to animate height smoothly; inactive panels are hidden for sizing.
 * - `content` can be any ReactNode (e.g., ArticleRenderer when used in article content).
 */
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * Item definition for a tab inside TabContainer.
 * `content` can be any ReactNode; when used inside article content, it is typically an ArticleRenderer.
 */
type TabItem = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

/**
 * Props for TabContainer.
 * Supports controlled (`value`) and uncontrolled (`defaultValue`) modes and forwards layout classes.
 */
type TabContainerProps = {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabListClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
};

/**
 * A pill-style tab switcher with animated panel height that accepts arbitrary content.
 * Panels are measured to smoothly animate height; inactive panels are hidden for correct sizing.
 */
const TabContainer = React.forwardRef<HTMLDivElement, TabContainerProps>(
  (
    {
      tabs,
      value,
      defaultValue,
      onValueChange,
      className,
      tabListClassName,
      contentClassName,
      ariaLabel = 'Tab switcher',
      ...props
    },
    ref,
  ) => {
    if (!tabs?.length) return null;

    const fallbackValue = tabs[0]?.value ?? '';
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? fallbackValue,
    );
    const currentValue = value ?? internalValue;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const panelRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
    const activePanel = currentValue
      ? panelRefs.current[currentValue]
      : undefined;
    const [height, setHeight] = React.useState<number | undefined>(undefined);

    React.useLayoutEffect(() => {
      if (!activePanel) return;

      const measure = () => setHeight(activePanel.scrollHeight);
      // measure now and on next frame for paint-complete values
      measure();
      const raf = requestAnimationFrame(measure);

      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(measure);
        observer.observe(activePanel);
        return () => {
          observer.disconnect();
          cancelAnimationFrame(raf);
        };
      }
      return () => cancelAnimationFrame(raf);
    }, [activePanel, currentValue, tabs.length]);

    const handleChange = (next: string) => {
      if (!next) return;
      onValueChange?.(next);
      if (value === undefined) setInternalValue(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-border bg-card shadow-sm',
          className,
        )}
        {...props}
      >
        <ToggleGroup.Root
          type="single"
          value={currentValue}
          onValueChange={handleChange}
          aria-label={ariaLabel}
          className={cn(
            'flex gap-1 border-b border-border px-2 py-2',
            tabListClassName,
          )}
        >
          {tabs.map(({ value: tabValue, label, description, disabled }) => {
            const hasDesc = Boolean(description);
            return (
              <ToggleGroup.Item
                key={tabValue}
                value={tabValue}
                disabled={disabled}
                className={cn(
                  'group relative inline-flex min-w-[120px] flex-col gap-0.5 px-3 py-2 text-sm font-medium transition-colors',
                  // Rectangle, browser-style tab shape (top corners only)
                  'rounded-t-md border',
                  // Active state: solid background and border
                  'data-[state=on]:border-border data-[state=on]:bg-primary-background data-[state=on]:text-foreground',
                  // Inactive state: muted look
                  'data-[state=off]:border-transparent data-[state=off]:bg-muted-background data-[state=off]:text-muted-foreground',
                  // Hover state for inactive
                  'hover:border-border',
                  // Alignment based on presence of description
                  hasDesc ? 'items-start text-left' : 'items-center text-left',
                  disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <span className={cn('w-full', !hasDesc && 'justify-center')}>
                  {label}
                </span>
                {hasDesc && (
                  <span className="w-full text-xs font-normal text-muted-foreground">
                    {description}
                  </span>
                )}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>

        <div className="relative px-4 pb-4 pt-3">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden transition-[height] duration-300 ease-in-out"
            style={height != null ? { height } : { height: 'auto' }}
          >
            {tabs.map(({ value: tabValue, content }) => {
              const isActive = tabValue === currentValue;
              return (
                <div
                  key={tabValue}
                  ref={(node) => {
                    panelRefs.current[tabValue] = node;
                  }}
                  className={cn(
                    'top-0 left-0 w-full transition-opacity duration-200 ease-out',
                    isActive
                      ? 'relative opacity-100'
                      : 'hidden opacity-0 pointer-events-none',
                  )}
                  aria-hidden={!isActive}
                >
                  <div
                    className={cn(
                      'prose prose-sm max-w-none text-foreground dark:prose-invert',
                      contentClassName,
                    )}
                  >
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

TabContainer.displayName = 'TabContainer';

export { TabContainer };
export type { TabContainerProps, TabItem };
