import { Button } from '@/components/ui/button';

type ArticleListingProps = {
  title?: string;
  published?: boolean;
  onClick?: () => void;
};

/**
 * ArticleListing component to display a single article.
 * @param props - Props containing title and onClick handler.
 * @returns JSX.Element
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
      className="w-full justify-start border-border bg-card text-lg font-medium transition hover:bg-muted"
    >
      {title ?? 'Untitled Article'}
      {published ? null : (
        <span className="ml-2 text-xs text-warning">Draft</span>
      )}
    </Button>
  );
};
