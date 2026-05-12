/**
 * @module features/articles/components/article-listing
 * @description Renders a single article entry as a full-width, outline-styled button
 * with an optional "Draft" badge for unpublished items.
 *
 * Usage:
 * - Use inside lists like `ArticleList` to render navigable entries
 * - Provide `onClick` to navigate to the article detail route
 *
 * @example
 * <ArticleListing
 *   title="Introduction to Algorithms"
 *   published={true}
 *   onClick={() => navigate('/articles/123')}
 * />
 */
import { Button } from '@/components/ui/button';

/**
 * Props for `ArticleListing`.
 * @typedef {Object} ArticleListingProps
 * @property {string} [title] - Display title; falls back to "Untitled Article" if not provided
 * @property {boolean} [published] - Whether the article is published; when false, shows a "Draft" badge
 * @property {() => void} [onClick] - Click handler invoked when the listing is selected
 */
type ArticleListingProps = {
  title?: string;
  published?: boolean;
  onClick?: () => void;
};

/**
 * Displays a single article as a full-width outline button with optional draft badge.
 *
 * The component left-aligns the title, applies subtle hover styling, and
 * triggers `onClick` when selected. If `published` is falsy, a small "Draft"
 * indicator appears next to the title.
 *
 * @component
 * @param {ArticleListingProps} props - Component props
 * @param {string} [props.title] - Display title text
 * @param {boolean} [props.published] - Published flag controlling the draft badge
 * @param {() => void} [props.onClick] - Handler for click interactions
 * @returns {JSX.Element} A button representing the article listing
 */
export const ArticleListing = ({
  title,
  published,
  onClick,
}: ArticleListingProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full justify-start border bg-primary-background text-lg font-medium transition hover:bg-muted-background"
    >
      <span
        className="min-w-0 flex-1 truncate"
        title={title ?? 'Untitled Article'}
      >
        {title ?? 'Untitled Article'}
      </span>
      {published ? null : (
        <span className="ml-2 shrink-0 text-xs text-warning-foreground">
          Draft
        </span>
      )}
    </Button>
  );
};
