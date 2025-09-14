import { Button } from '@/components/ui/button';

type ArticleListingProps = {
  title?: string;
  onClick?: () => void;
};

export const ArticleListing = ({ title, onClick }: ArticleListingProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full justify-start bg-card text-lg font-medium transition hover:bg-muted"
    >
      {title ?? 'Untitled Article'}
    </Button>
  );
};
