/**
 * @module features/categories/components/category-card
 * @description Displays a category as a clickable card with folder icon and title.
 * Applies muted styling when not published and interactive hover/active effects when published.
 *
 * Usage:
 * - Use within category listings to navigate to a category detail view
 * - Provide `onClick` to handle navigation or selection
 *
 * @example
 * <CategoryCard
 *   title="Algorithms"
 *   published={true}
 *   onClick={() => navigate('/categories/algorithms')}
 * />
 */
import { FolderIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/utils/cn';

/**
 * Props for `CategoryCard`.
 * @typedef {Object} CategoryCardProps
 * @property {string} [title] - Category display name
 * @property {() => void} [onClick] - Handler invoked when the card is activated
 * @property {boolean} [published] - Published flag; when false, the card appears muted/disabled
 */
type CategoryCardProps = {
  title?: string;
  onClick?: () => void;
  published?: boolean;
};

/**
 * Renders a category as a card with icon and title.
 *
 * When `published` is false, the card is visually muted and non-interactive.
 * When `published` is true, hover/active transitions indicate interactivity,
 * and `onClick` is invoked on activation.
 *
 * Accessibility:
 * - `role="button"` and `tabIndex={0}` enable keyboard focus
 * - Enter key triggers `onClick` when appropriate
 *
 * @component
 * @param {CategoryCardProps} props - Component props
 * @param {string} [props.title] - Category title text
 * @param {() => void} [props.onClick] - Click handler for activation
 * @param {boolean} [props.published] - Controls interactive styling and behavior
 * @returns {JSX.Element} A card representing the category
 */
export const CategoryCard = ({
  title,
  onClick,
  published,
}: CategoryCardProps) => {
  return (
    <div
      className={cn(
        'm-2 flex h-44 w-52 flex-col items-center justify-center rounded-xl border border-border bg-primary-background p-6 transition-transform text-center duration-200',
        !published
          ? 'pointer-events-none bg-muted-background text-muted-foreground opacity-50 shadow-none'
          : 'hover:-translate-y-1 hover:scale-105 hover:shadow-card-hover active:shardow-card-active active:translate-y-0.5 active:scale-95 cursor-pointer',
      )}
      tabIndex={0}
      role="button"
      aria-disabled={published}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!published && e.key === 'Enter' && onClick) onClick();
      }}
    >
      <div className="mb-2">
        <FolderIcon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
};
