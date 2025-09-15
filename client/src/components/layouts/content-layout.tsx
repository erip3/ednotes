import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/ui/header';

type ContentLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  parentId?: number;
  footerContent?: string;
  centered?: boolean;
  isArticle?: boolean;
};

/**
 * ContentLayout component provides a layout structure with a header, footer, and main content area.
 * @param props - Props including children, title, parentId, footerContent, and centered flag.
 * @returns JSX.Element
 */
export const ContentLayout = ({
  children,
  title,
  subtitle,
  parentId,
  footerContent,
  centered = true,
  isArticle = false,
}: ContentLayoutProps) => {
  const navigate = useNavigate();

  // Handlers for navigation
  const handleBack = () => {
    if (parentId !== null && parentId !== undefined) {
      navigate(`/categories/${parentId}`);
    } else if (isArticle) {
      navigate('/personal');
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <>
      <Header onBack={handleBack} onHome={handleHome} />
      <main
        className={
          centered
            ? 'flex min-h-screen flex-col items-center justify-center'
            : 'flex min-h-screen flex-col'
        }
      >
        <div
          className={
            centered
              ? 'w-full max-w-7xl px-4 text-center sm:px-6 md:px-8'
              : 'mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8'
          }
        >
          <h1
            className={
              centered
                ? 'pb-4 text-5xl font-semibold'
                : 'mb-8 mt-8 pb-4 text-left text-4xl font-semibold'
            }
          >
            {title}
          </h1>
          {subtitle && (
            <h2 className="pb-4 text-lg font-semibold text-secondary-foreground">
              {subtitle}
            </h2>
          )}
          <div className={centered ? 'py-6' : 'py-0'}>{children}</div>
        </div>
      </main>
      <Footer content={footerContent} />
    </>
  );
};
