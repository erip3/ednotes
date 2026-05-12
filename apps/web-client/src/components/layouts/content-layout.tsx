/**
 * @module components/layouts/content-layout
 * @description Provides a layout shell with a global header, footer, and flexible content area.
 * Supports both centered and document (narrow column) layouts.
 *
 * Functionality:
 * - **Layout modes**: Centered full-width or constrained document column layouts
 * - **Navigation**: Smart back/home navigation
 * - **Flexible styling**: Content and container styling hooks via className props
 *
 * Styling Approach:
 * - Uses `cn()` to conditionally apply Tailwind utility classes with proper conflict resolution
 * - Max-width constraints: 7xl for centered, 3xl for document layout
 *
 * Navigation Logic:
 * - Back button: Routes to parent category, personal page, or home
 * - Home button: Always routes to home (/)
 * - Handlers are memoized with useCallback to prevent unnecessary re-renders in Header
 *
 * @example
 * // Centered marketing-style layout
 * <ContentLayout
 *   title="Welcome to EdNotes"
 *   subtitle="Learn and organize"
 *   centered
 * >
 *   <Content />
 * </ContentLayout>
 *
 * @example
 * // Document-style layout with category navigation
 * <ContentLayout
 *   title="Category Name"
 *   parentId={5}
 *   centered={false}
 * >
 *   <ArticleGrid />
 * </ContentLayout>
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/ui/header';
import { cn } from '@/utils/cn';

/**
 * Props for the ContentLayout component.
 */
type ContentLayoutProps = {
  /** Child elements to render in the main content area. */
  children: React.ReactNode;
  /** Optional page heading rendered as the main `<h1>` element. */
  title?: string;
  /** Optional page subheading rendered below the title. */
  subtitle?: string;
  /** Category ID for computing default back navigation route. */
  parentId?: number;
  /** Footer text content. If omitted, footer still renders but empty. */
  footerContent?: string;
  /** Use centered layout (marketing/landing) vs. document column layout. */
  centered?: boolean;
  /** Treat as article content (affects back navigation to personal). */
  isArticle?: boolean;
  /** Indicates if the article is published (affects footer message). */
  articlePublished?: boolean;
  /** Override default back button behavior. */
  onBack?: () => void;
  /** Override default home button behavior. */
  onHome?: () => void;
  /** Additional Tailwind classes for the outer `main` element. */
  className?: string;
  /** Additional Tailwind classes for the inner content container (safe merging with cn). */
  contentClassName?: string;
  /** Whether to render the global footer (defaults to true). */
  showFooter?: boolean;
};

/**
 * Layout component providing page structure with header, footer, and flexible content area.
 *
 * Renders a full-viewport layout with:
 * - Global header with navigation controls
 * - Main content area (centered or document-width)
 * - Global footer
 *
 * Features:
 * - **Layout flexibility**: Choose centered or document column layout
 * - **Optional header/footer**: Show/hide footer; title/subtitle are optional
 * - **Safe class composition**: `cn()` prevents Tailwind utility conflicts
 *
 * @param {ContentLayoutProps} props - Layout configuration and content props.
 * @returns {JSX.Element} Full-page layout with header, main content, and footer.
 *
 * @example
 * // Root layout for app pages (centered home page)
 * <ContentLayout
 *   title="EdNotes"
 *   centered
 *   showFooter
 * >
 *   <Outlet />
 * </ContentLayout>
 *
 * @example
 * // Category page (document layout with back navigation)
 * <ContentLayout
 *   title={category.name}
 *   parentId={category.parentId}
 *   centered={false}
 * >
 *   <CategoryContent />
 * </ContentLayout>
 */
export const ContentLayout = ({
  children,
  title,
  subtitle,
  parentId,
  centered = true,
  isArticle = false,
  articlePublished = true,
  onBack,
  onHome,
  className,
  contentClassName,
  showFooter = true,
}: ContentLayoutProps) => {
  const navigate = useNavigate();
  const titleId = React.useId();

  // Handlers for navigation
  // Note: Project articles navigate back to /personal
  const handleBack = React.useCallback(() => {
    const PERSONAL_CATEGORY_ID = 1;
    if (parentId === PERSONAL_CATEGORY_ID) {
      navigate('/personal');
    } else if (parentId !== null && parentId !== undefined) {
      navigate(`/categories/${parentId}`);
    } else {
      navigate('/');
    }
  }, [navigate, parentId, isArticle]);

  // Home always goes to root
  const handleHome = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  const backHandler = onBack ?? handleBack;
  const homeHandler = onHome ?? handleHome;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to content for keyboard/screen reader users */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <Header onBack={backHandler} onHome={homeHandler} />

      <main
        id="content"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'flex flex-1 flex-col pt-4 sm:pt-6 md:pt-8',
          centered && 'items-center justify-center',
          className,
        )}
      >
        <div
          className={cn(
            centered
              ? 'w-full max-w-7xl px-4 text-center sm:px-6 md:px-8'
              : 'mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8',
            contentClassName,
          )}
        >
          {title && (
            <h1
              id={titleId}
              className={
                centered
                  ? 'pb-4 text-5xl font-semibold'
                  : 'mb-8 mt-8 pb-4 text-left text-4xl font-semibold'
              }
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <h2 className="pb-4 text-base font-semibold text-foreground sm:text-lg">
              {subtitle}
            </h2>
          )}

          <div className={centered ? 'py-4 sm:py-6' : 'py-0'}>{children}</div>
        </div>
      </main>

      {showFooter && (
        <Footer
          key={`footer-${articlePublished}`}
          isArticle={isArticle}
          articlePublished={articlePublished}
        />
      )}
    </div>
  );
};
