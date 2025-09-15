import { Button } from '@/components/ui/button';

type ArticleListingProps = {
  title?: string;
  onClick?: () => void;
};

/**
 * ArticleListing component to display a single article.
 * @param props - Props containing title and onClick handler.
 * @returns JSX.Element
 */
export const ArticleListing = ({ title, onClick }: ArticleListingProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full justify-start border-border bg-card text-lg font-medium transition hover:bg-muted"
    >
      {title ?? 'Untitled Article'}
    </Button>
  );
};
